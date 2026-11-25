/* أكاديمية نجد — الحسابات (Firebase Auth) وحفظ التقدم في السحابة (Firestore).
   يحفظ الخطة والجدول والمعدل في users/{uid} ويرجعها لك من أي جهاز. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, sendPasswordResetEmail, sendEmailVerification, signOut,
  setPersistence, browserLocalPersistence, browserSessionPersistence,
  GoogleAuthProvider, signInWithPopup, deleteUser, reauthenticateWithPopup
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP2uDTCYm22Dy7B4KTFbeRFNTpwPOnzpY",
  authDomain: "najd-141.firebaseapp.com",
  projectId: "najd-141",
  storageBucket: "najd-141.firebasestorage.app",
  messagingSenderId: "282868703172",
  appId: "1:282868703172:web:1249a0a3edbb8a16d6ce91",
  measurementId: "G-2HN0BW55EP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "ar";
const db = getFirestore(app);

const N = window.Najd || { SYNC_KEYS: [], META: "najd_sync_meta", setUser() {}, toast() {}, setSync() {} };
const KEYS = N.SYNC_KEYS;
let current = null;
let pushTimer = null;
let cloudNotify; /* إعدادات التنبيهات من الحساب (notify.js) */

const readMeta = () => { try { return JSON.parse(localStorage.getItem(N.META) || "{}") || {}; } catch (e) { return {}; } };
const writeMeta = (m) => { try { window.__najdSilent = true; localStorage.setItem(N.META, JSON.stringify(m)); } finally { window.__najdSilent = false; } };
const setLocal = (k, v) => { try { window.__najdSilent = true; localStorage.setItem(k, v); } finally { window.__najdSilent = false; } };

/* رسائل الأخطاء بالعربي */
const MSG = {
  "auth/invalid-email": "البريد الإلكتروني مكتوب بشكل غير صحيح.",
  "auth/missing-password": "اكتب كلمة المرور.",
  "auth/invalid-credential": "البريد أو كلمة المرور غير صحيحة.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/user-not-found": "ما لقينا حساب بهذا البريد.",
  "auth/user-disabled": "هذا الحساب موقوف.",
  "auth/email-already-in-use": "هذا البريد مسجل عندنا من قبل. جرّب تسجيل الدخول.",
  "auth/weak-password": "كلمة المرور ضعيفة. خلها 6 أحرف أو أكثر.",
  "auth/too-many-requests": "محاولات كثيرة. انتظر شوي وجرب مرة ثانية.",
  "auth/network-request-failed": "تأكد من اتصالك بالإنترنت وجرب مرة ثانية.",
  "auth/popup-closed-by-user": "قفلت نافذة قوقل قبل ما يكتمل الدخول.",
  "auth/popup-blocked": "المتصفح منع نافذة قوقل. اسمح بالنوافذ المنبثقة وجرب مرة ثانية.",
  "auth/operation-not-allowed": "طريقة الدخول هذي غير مفعّلة حاليًا.",
  "auth/unauthorized-domain": "هذا النطاق غير مضاف في إعدادات Firebase (Authorized domains).",
  "auth/requires-recent-login": "للأمان، سجّل خروج وادخل من جديد، وبعدها جرّب مرة ثانية.",
  "auth/cancelled-popup-request": "فيه نافذة دخول مفتوحة من قبل. كمّل فيها أو قفلها وجرب مرة ثانية.",
  "auth/account-exists-with-different-credential": "هذا البريد مسجل بطريقة دخول ثانية. جرّب تدخل بالبريد وكلمة المرور."
};
const errText = (e) => MSG[e && e.code] || "صار خطأ غير متوقع. جرب مرة ثانية.";

/* ===== المزامنة ===== */
const ACT_KEY = "najd_act_v1";
const actObj = (v) => { try { const o = JSON.parse(v); return o && typeof o.d === "object" && o.d ? o.d : {}; } catch (e) { return {}; } };
/* نفس الترتيب دايم عشان نقارن النص */
function canonAct(v) { const d = actObj(v), out = {}; Object.keys(d).sort().forEach((k) => { const x = d[k] || {}, y = {}; Object.keys(x).sort().forEach((f) => { y[f] = +x[f] || 0; }); out[k] = y; }); return JSON.stringify({ d: out }); }
function mergeAct(a, b) {
  const A = actObj(a), B = actObj(b), d = {};
  for (const src of [A, B]) for (const k of Object.keys(src)) { const x = src[k] || {}; d[k] = d[k] || {}; for (const f of Object.keys(x)) d[k][f] = Math.max(+d[k][f] || 0, +x[f] || 0); }
  const keys = Object.keys(d).sort(); while (keys.length > 120) delete d[keys.shift()];
  return canonAct(JSON.stringify({ d }));
}

async function pull(uid) {
  N.setSync("جاري مزامنة تقدمك…");
  const snap = await getDoc(doc(db, "users", uid));
  const cloud = snap.exists() ? snap.data() : {};
  cloudNotify = cloud.notify || null;
  const cData = cloud.data || {}, cT = cloud.t || {};
  const meta = readMeta();
  let changed = false, needPush = false;
  for (const k of KEYS) {
    const lv = localStorage.getItem(k), lt = meta[k] || 0;
    const cv = cData[k], ct = cT[k] || 0;
    /* أيام المذاكرة: نجمع أيام الجهازين بدل ما واحد يمسح الثاني */
    if (k === ACT_KEY && cv != null && lv != null && cv !== lv) {
      const m = mergeAct(lv, cv);
      if (m !== canonAct(lv)) { setLocal(k, m); changed = true; }
      if (m !== canonAct(cv)) needPush = true;
      meta[k] = Math.max(lt, ct) || Date.now();
      continue;
    }
    if (cv != null && ct >= lt && cv !== lv) { setLocal(k, cv); meta[k] = ct; changed = true; }
    else if (lv != null && (cv == null || lt > ct)) { needPush = true; if (!lt) meta[k] = Date.now(); }
  }
  writeMeta(meta);
  if (needPush) await push();
  N.setSync("تقدمك محفوظ في حسابك");
  return changed;
}

async function push() {
  if (!current) return;
  clearTimeout(pushTimer); pushTimer = null;
  const meta = readMeta(), data = {}, t = {};
  for (const k of KEYS) { const v = localStorage.getItem(k); if (v != null) { data[k] = v; t[k] = meta[k] || Date.now(); } }
  try {
    N.setSync("جاري الحفظ…");
    await setDoc(doc(db, "users", current.uid), {
      name: current.displayName || "", email: current.email || "", phone: current.phoneNumber || "", data, t, updatedAt: serverTimestamp()
    }, { merge: true });
    N.setSync("تقدمك محفوظ في حسابك");
  } catch (e) {
    console.warn("najd sync", e);
    N.setSync("ما قدرنا نحفظ في السحابة، محفوظ في جهازك");
  }
}

window.addEventListener("najd:dirty", () => {
  if (!current) return;
  N.setSync("فيه تغييرات بتنحفظ…");
  clearTimeout(pushTimer);
  pushTimer = setTimeout(push, 1500);
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && pushTimer) push(); });

/* ===== حالة الدخول ===== */
onAuthStateChanged(auth, async (user) => {
  current = user;
  if (!user) { N.setUser(null); return; }
  N.setUser(userInfo(user));
  checkAdmin(user);
  try {
    const changed = await pull(user.uid);
    const flag = "najd_pulled_" + user.uid;
    const usesData = !!document.querySelector("[data-sync]");
    if (changed && usesData && !sessionStorage.getItem(flag)) {
      sessionStorage.setItem(flag, "1");
      location.reload();
      return;
    }
    sessionStorage.setItem(flag, "1");
    /* تنبيهات الدراسة: الموافقة أول مرة، وتجديد رمز الجهاز */
    import("./notify.js?v=202611251013").then((m) => m.start(user, cloudNotify)).catch((e) => console.warn("najd notify", e));
    /* ملف الحساب للوحة الإدارة (الاسم والإيميل وتاريخ التسجيل) */
    import("./stats.js?v=202611251013").then((m) => m.saveProfile(user)).catch(() => {});
  } catch (e) {
    console.warn("najd pull", e);
    N.setSync("ما قدرنا نجيب تقدمك من السحابة");
  }
});

/* المشرف: نتأكد من admins/{uid} مرة في الجلسة، ونحدّث عدد اللي ينتظر الموافقة كل ٥ دقايق بالكثير.
   هذا للعرض بس (زر لوحة الإدارة)، والحماية الحقيقية في قواعد Firestore */
const snapLen = (sn) => (typeof sn.size === "number" ? sn.size : sn.docs ? sn.docs.length : 0);
async function pendingCount() {
  let n = 0;
  for (const col of ["courseReviews", "instructorReviews"]) n += snapLen(await getDocs(query(collection(db, col), where("status", "==", "pending"))));
  return n + snapLen(await getDocs(collection(db, "testimonialInbox")));
}
async function checkAdmin(user) {
  if (!N.setAdmin) return;
  const key = "najd_adm_" + user.uid, ss = (k, v) => { try { return v === undefined ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch (e) { return null; } };
  try {
    let flag = ss(key);
    if (flag !== "1" && flag !== "0") { flag = (await getDoc(doc(db, "admins", user.uid))).exists() ? "1" : "0"; ss(key, flag); }
    if (flag !== "1") { N.setAdmin(false); return; }
    let cached = 0; try { cached = +(JSON.parse(localStorage.getItem("najd_admin") || "null") || {}).n || 0; } catch (e) {}
    N.setAdmin(true, cached);
    if (Date.now() - (+ss(key + "_t") || 0) > 3e5) { N.setAdmin(true, await pendingCount()); ss(key + "_t", String(Date.now())); }
  } catch (e) { console.warn("najd admin", e); }
}

function userInfo(u) { return { name: u.displayName || "", email: u.email || "", phone: u.phoneNumber || "" }; }

/* ===== واجهة للصفحات ===== */
window.NajdAuth = {
  errText,
  async login(email, pass, remember) {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email.trim(), pass);
  },
  async register(name, email, pass) {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name) await updateProfile(cred.user, { displayName: name.trim() });
    N.setUser(userInfo(cred.user));
    try { await sendEmailVerification(cred.user); } catch (e) {}
    await push();
    return cred;
  },
  google() {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, p);
  },
  reset(email) { return sendPasswordResetEmail(auth, email.trim()); },
  async setName(name) {
    if (!current || !name) return;
    await updateProfile(current, { displayName: name.trim() });
    N.setUser(userInfo(current));
    await push();
  },
  async logout() {
    if (pushTimer) await push();
    await signOut(auth);
    N.toast("سجلت خروجك. نشوفك قريب");
  },
  user: () => current,
  info() {
    if (!current) return null;
    const pv = (current.providerData[0] || {}).providerId || "";
    return { name: current.displayName || "", email: current.email || "", verified: !!current.emailVerified, google: pv === "google.com" };
  },
  resendVerification() { return sendEmailVerification(current); },
  /* حذف الحساب نهائيًا: تقييمات الطالب، ثم بياناته، ثم الحساب نفسه */
  async deleteAccount() {
    if (!current) return;
    const uid = current.uid;
    if ((current.providerData[0] || {}).providerId === "google.com") {
      await reauthenticateWithPopup(current, new GoogleAuthProvider());
    }
    for (const c of ["courseReviews", "instructorReviews"]) {
      try { const sn = await getDocs(query(collection(db, c), where("uid", "==", uid))); for (const d of sn.docs) await deleteDoc(d.ref); } catch (e) { console.warn("najd delete", c, e); }
    }
    try { await deleteDoc(doc(db, "users", uid)); } catch (e) { console.warn("najd delete user doc", e); }
    await deleteUser(current);
    try { KEYS.forEach((k) => localStorage.removeItem(k)); localStorage.removeItem(N.META); localStorage.removeItem("najd_user"); } catch (e) {}
  }
};
window.dispatchEvent(new CustomEvent("najd:auth-ready"));

/* شريط الإعلان: نجيبه من settings/announcement ونعرضه في كل الصفحات */
getDoc(doc(db, "settings", "announcement")).then((s) => { if (s.exists() && N.announce) N.announce(s.data()); }).catch(() => {});

export { app, auth, db };
/* عدّاد الزوار: مرة وحدة لكل جهاز في اليوم */
setTimeout(() => { import("./stats.js?v=202611251013").then((m) => m.countVisit()).catch(() => {}); }, 1200);
window.NajdNotify = { settings: async (box, u) => (await import("./notify.js?v=202611251013")).settings(box, u) };
