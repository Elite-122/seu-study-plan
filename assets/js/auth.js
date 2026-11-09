/* أكاديمية نجد — الحسابات (Firebase Auth) وحفظ التقدم في السحابة (Firestore).
   يحفظ الخطة والجدول والمعدل في users/{uid} ويرجعها لك من أي جهاز. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, sendPasswordResetEmail, sendEmailVerification, signOut,
  setPersistence, browserLocalPersistence, browserSessionPersistence,
  GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

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
  "auth/invalid-phone-number": "رقم الجوال غير صحيح. اكتبه بهذا الشكل: 05XXXXXXXX",
  "auth/missing-phone-number": "اكتب رقم جوالك.",
  "auth/invalid-verification-code": "الكود غير صحيح. تأكد منه وجرب مرة ثانية.",
  "auth/missing-verification-code": "اكتب الكود اللي وصلك.",
  "auth/code-expired": "انتهت صلاحية الكود. اطلب كود جديد.",
  "auth/captcha-check-failed": "ما قدرنا نتحقق إنك مو روبوت. حدّث الصفحة وجرب مرة ثانية.",
  "auth/quota-exceeded": "وصلنا الحد الأعلى لرسائل التحقق اليوم. جرب بعدين أو ادخل بالبريد.",
  "auth/billing-not-enabled": "الدخول بالجوال غير مفعّل حاليًا. ادخل بالبريد الإلكتروني.",
  "auth/requires-recent-login": "سجّل دخولك من جديد وبعدها جرب."
};
const errText = (e) => MSG[e && e.code] || "صار خطأ غير متوقع. جرب مرة ثانية.";

/* ===== المزامنة ===== */
async function pull(uid) {
  N.setSync("جاري مزامنة تقدمك…");
  const snap = await getDoc(doc(db, "users", uid));
  const cloud = snap.exists() ? snap.data() : {};
  const cData = cloud.data || {}, cT = cloud.t || {};
  const meta = readMeta();
  let changed = false, needPush = false;
  for (const k of KEYS) {
    const lv = localStorage.getItem(k), lt = meta[k] || 0;
    const cv = cData[k], ct = cT[k] || 0;
    if (cv != null && ct >= lt && cv !== lv) { setLocal(k, cv); meta[k] = ct; changed = true; }
    else if (lv != null && (cv == null || lt > ct)) { needPush = true; if (!lt) meta[k] = Date.now(); }
  }
  writeMeta(meta);
  if (needPush) await push();
  N.setSync("تقدمك محفوظ في حسابك ☁️");
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
    N.setSync("تقدمك محفوظ في حسابك ☁️");
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
  } catch (e) {
    console.warn("najd pull", e);
    N.setSync("ما قدرنا نجيب تقدمك من السحابة");
  }
});

function userInfo(u) { return { name: u.displayName || "", email: u.email || "", phone: u.phoneNumber || "" }; }
let verifier = null, confirmation = null;

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
  google() { return signInWithPopup(auth, new GoogleAuthProvider()); },
  reset(email) { return sendPasswordResetEmail(auth, email.trim()); },
  /* الدخول برقم الجوال: نرسل كود SMS، وبعدين نأكده */
  async phoneStart(phone, containerId) {
    if (!verifier) verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
    try {
      confirmation = await signInWithPhoneNumber(auth, phone, verifier);
    } catch (e) {
      try { verifier.clear(); } catch (x) {}
      verifier = null;
      throw e;
    }
  },
  async phoneConfirm(code) {
    if (!confirmation) throw { code: "auth/code-expired" };
    const cred = await confirmation.confirm(code.trim());
    confirmation = null;
    return cred;
  },
  async setName(name) {
    if (!current || !name) return;
    await updateProfile(current, { displayName: name.trim() });
    N.setUser(userInfo(current));
    await push();
  },
  async logout() {
    if (pushTimer) await push();
    await signOut(auth);
    N.toast("سجلت خروجك. نشوفك قريب 👋");
  },
  user: () => current
};
window.dispatchEvent(new CustomEvent("najd:auth-ready"));

export { app, auth, db };
