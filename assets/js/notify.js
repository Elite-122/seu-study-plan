/* تنبيهات الدراسة: الموافقة بعد التسجيل، وإعداداتها في «حسابي»، وتسجيل الجوال للإشعارات.
   الإعدادات تنحفظ في users/{uid}.notify، و reminders/run.js (يشغّله GitHub Actions) يقراها ويرسل.
   notify = {on, email, push, hour, types:{exam,hw,mist,study}, key, tokens:{رمز الجهاز: وقت}, asked, skipped, reasked,
             test (طلب تجربة), last و unsub (يكتبها الخادم وصفحة إيقاف الإيميل)} */
import { app, auth, db } from "./auth.js?v=202611162300";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const N = window.Najd, esc = N.esc, I = N.icon;
const EN = document.documentElement.lang === "en", L = (a, e) => (EN ? e : a);
const PUSH_KEY = window.NAJD_PUSH_KEY || "";
const HOURS = [19, 20, 21];
const DEF = { email: true, push: false, hour: 20, types: { exam: true, hw: true, mist: true, study: true } };
let user = null, prefs = null;

const rand = () => [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, "0")).join("");
const mask = (m) => { const [a, b] = String(m || "").split("@"); return a && b ? a.slice(0, 1) + "•••@" + b : ""; };
/* الإشعار يحتاج: متصفح يدعمه، وفي الآيفون يكون التطبيق مثبّت */
function pushState() {
  if (!PUSH_KEY) return "soon";
  if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent), app = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
    return ios && !app ? "install" : "no";
  }
  if (Notification.permission === "denied") return "denied";
  return "ok";
}
const SERVER = ["test", "last", "unsub"]; // حقول ما نكتبها إلا إذا قصدناها، عشان نسخة قديمة عندنا ما تمسح شغل الخادم
async function save(patch) {
  prefs = { ...(prefs || DEF), ...patch };
  prefs.types = { ...DEF.types, ...(prefs.types || {}) };
  prefs.on = !!(prefs.email || prefs.push);
  /* مفتاح رابط «إيقاف التنبيهات». لو انستخدم قبل، نغيّره عشان الرابط القديم ما يشتغل مرة ثانية */
  if (!prefs.key || prefs.key === prefs.unsub) prefs.key = rand();
  const out = { ...prefs };
  SERVER.forEach((k) => { if (!(k in patch)) delete out[k]; });
  /* mergeFields: كل حقل ينكتب كامل (عشان رمز جهاز انشال ما يرجع)، والباقي في المستند ما يتغير */
  await setDoc(doc(db, "users", user.uid), { notify: out }, { mergeFields: Object.keys(out).map((k) => "notify." + k) });
  return prefs;
}
/* يطلب إذن الجوال ويسجل رمز الجهاز. لازم يجي من ضغطة الطالب */
async function enablePush() {
  const st = pushState();
  if (st !== "ok") return st;
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return "denied";
  const { getMessaging, getToken } = await import("https://www.gstatic.com/firebasejs/13.2.0/firebase-messaging.js");
  const reg = await navigator.serviceWorker.ready;
  const token = await getToken(getMessaging(app), { vapidKey: PUSH_KEY, serviceWorkerRegistration: reg });
  if (!token) return "no";
  const tokens = { ...((prefs && prefs.tokens) || {}) }; tokens[token] = Date.now();
  try { localStorage.setItem("najd_push_token", token); } catch (e) {}
  await save({ push: true, tokens });
  return "ok";
}
const pushNote = (st) => ({
  soon: L("إشعارات الجوال تتفعل قريبًا. الإيميل شغال الحين.", "Phone notifications are coming soon. Email works now."),
  install: L("في الآيفون: ثبّت التطبيق أول (مشاركة ← إضافة إلى الشاشة الرئيسية)، وبعدها فعّل الإشعارات من حسابي.", "On iPhone: install the app first (Share → Add to Home Screen), then enable notifications in My account."),
  no: L("متصفحك ما يدعم الإشعارات. الإيميل يوصلك.", "Your browser doesn't support notifications. Email still works."),
  denied: L("الإشعارات مقفلة من إعدادات المتصفح لهذا الموقع. فعّلها من الإعدادات وارجع هنا.", "Notifications are blocked in your browser settings for this site."),
}[st] || "");

/* ===== شاشة الموافقة: مرة وحدة بعد إنشاء الحساب ===== */
function sheet(html) {
  document.getElementById("nj-ntf")?.remove();
  const d = document.createElement("div"); d.id = "nj-ntf"; d.className = "nj-sheet"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "nj-ntf-h");
  d.innerHTML = `<div class="nj-sheet-box nj-ntf">${html}</div>`;
  document.getElementById("najd").appendChild(d); document.documentElement.classList.add("nj-noscroll");
  return d;
}
function close() { document.getElementById("nj-ntf")?.remove(); document.documentElement.classList.remove("nj-noscroll"); }
const BELL = '<span class="nj-ntf-ic">' + I("bell") + "</span>";

function ask() {
  const st = pushState(), canMail = !!(user && user.email);
  const d = sheet(`${BELL}<h2 id="nj-ntf-h">${L("خطوة أخيرة: خلّنا نذكّرك", "One last step: let us remind you")}</h2>
    <p class="nj-ntf-lead">${L("أكثر شي يضيّع الدرجات موعد ينسى. نذكّرك قبل لا يفوتك:", "Missed dates cost grades. We'll remind you before:")}</p>
    <ul class="nj-ntf-why"><li><b>${EN ? "1" : "١"}</b>${L("اختبارك: قبله بيوم، ويوم الاختبار الصبح", "Your exam: the day before, and that morning")}</li><li><b>${EN ? "2" : "٢"}</b>${L("الواجبات والكويزات: قبلها بيومين", "Homework and quizzes: two days before")}</li><li><b>${EN ? "3" : "٣"}</b>${L("أسئلتك الغلط لما يجي وقت مراجعتها", "Mistakes when they're due for review")}</li><li><b>${EN ? "4" : "٤"}</b>${L("جلسات مذاكرتك اليوم", "Today's study sessions")}</li></ul>
    <label class="nj-ntf-opt${canMail ? "" : " is-off"}"><span><b>${L("إيميل التذكير", "Reminder email")}</b><small>${canMail ? esc(L(`على ${mask(user.email)}، مرة باليوم بس`, `To ${mask(user.email)}, once a day`)) : L("حسابك ما فيه إيميل", "No email on your account")}</small></span><input type="checkbox" class="nj-switch" id="ntf-mail" ${canMail ? "checked" : "disabled"}></label>
    <div class="nj-ntf-opt"><span><b>${L("إشعار على الجوال", "Phone notification")}</b><small>${st === "ok" ? L("يوصل حتى لو الموقع مسكّر", "Arrives even when the site is closed") : esc(pushNote(st))}</small></span>${st === "ok" ? `<span class="nj-tag is-ok" id="ntf-push-st">${L("بنطلب الإذن", "We'll ask")}</span>` : ""}</div>
    <button type="button" class="nj-btn nj-btn-fill" id="ntf-yes">${L("فعّل التنبيهات وكمّل", "Turn on reminders")}</button>
    <button type="button" class="nj-ntf-skip" id="ntf-no">${L("أكمّل بدون تنبيهات", "Continue without reminders")}</button>
    <p class="nj-ntf-note">${L("نرسل لك عن دراستك بس، وما نرسل إعلانات. تغيّرها من «حسابي» متى ما تبي.", "Only about your studies, never ads. Change it anytime in My account.")}</p>`);
  d.querySelector("#ntf-yes").onclick = async (e) => {
    const b = e.currentTarget; b.disabled = true;
    try {
      await save({ ...DEF, email: !!d.querySelector("#ntf-mail")?.checked && canMail, asked: Date.now(), skipped: false });
      let r = "skip"; if (st === "ok") r = await enablePush();
      close();
      N.toast(r === "ok" ? L("فعّلنا التنبيهات على الإيميل والجوال", "Reminders on for email and phone") : prefs.email ? L("فعّلنا تنبيهات الإيميل", "Email reminders on") : L("انحفظ اختيارك", "Saved"));
    } catch (err) { console.warn("najd notify", err); b.disabled = false; N.toast(L("ما قدرنا نحفظ، جرب مرة ثانية", "Couldn't save, try again")); }
  };
  d.querySelector("#ntf-no").onclick = async () => { try { await save({ ...DEF, email: false, push: false, asked: Date.now(), skipped: true }); } catch (e) {} close(); };
}
/* اللي تخطاها: نسأله مرة وحدة بس بعد ما يضيف أول اختبار */
function reask() {
  const d = sheet(`${BELL}<h2 id="nj-ntf-h">${L("تبينا نذكّرك قبل اختبارك؟", "Want a reminder before your exam?")}</h2>
    <p class="nj-ntf-lead">${L("نرسل لك قبله بيوم، ويوم الاختبار الصبح.", "We'll remind you the day before, and that morning.")}</p>
    <button type="button" class="nj-btn nj-btn-fill" id="ntf-yes">${L("إيه، ذكّرني", "Yes, remind me")}</button>
    <button type="button" class="nj-ntf-skip" id="ntf-no">${L("لا، شكرًا", "No, thanks")}</button>`);
  d.querySelector("#ntf-yes").onclick = async () => { try { await save({ email: !!user.email, reasked: Date.now(), skipped: false }); if (pushState() === "ok") await enablePush(); } catch (e) {} close(); N.toast(L("فعّلنا التنبيهات", "Reminders on")); };
  d.querySelector("#ntf-no").onclick = async () => { try { await save({ reasked: Date.now() }); } catch (e) {} close(); };
}
function hasExam() { try { const s = JSON.parse(localStorage.getItem("stq_schedule_v1") || "null"); return !!(s && (s.exams || []).some((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.date || ""))); } catch (e) { return false; } }

/* ===== إعدادات «حسابي» ===== */
export async function settings(box, u) {
  user = u || user || auth.currentUser;
  if (!user) return;
  if (!prefs) { try { const s = await getDoc(doc(db, "users", user.uid)); prefs = (s.exists() && s.data().notify) || null; } catch (e) {} }
  const p = { ...DEF, ...(prefs || {}), types: { ...DEF.types, ...((prefs || {}).types || {}) } }, st = pushState();
  const myToken = (() => { try { return localStorage.getItem("najd_push_token"); } catch (e) { return null; } })();
  const here = !!(p.push && myToken && p.tokens && p.tokens[myToken]);
  const row = (id, t, s, on, dis) => `<label class="nj-ntf-row${dis ? " is-off" : ""}"><span><b>${t}</b>${s ? `<small>${s}</small>` : ""}</span><input type="checkbox" class="nj-switch" data-n="${id}" ${on ? "checked" : ""} ${dis ? "disabled" : ""}></label>`;
  box.innerHTML = `<h2>${L("تنبيهاتي", "My reminders")}</h2><p class="nj-hint">${L("نذكّرك بمواعيدك من الجدول وخطة المذاكرة. ما نرسل إعلانات.", "Reminders come from your schedule and study plan. No ads.")}</p>
    <p class="nj-ntf-lbl">${L("وين نوصلك", "Where to reach you")}</p>
    ${row("email", L("الإيميل", "Email"), user.email ? esc(mask(user.email)) : L("حسابك ما فيه إيميل", "No email on your account"), p.email && !!user.email, !user.email)}
    ${row("push", L("إشعار الجوال", "Phone notification"), here ? L("مفعّل على هذا الجهاز", "On for this device") : st === "ok" ? L("فعّله لهذا الجهاز", "Turn on for this device") : esc(pushNote(st)), here, st !== "ok" && !here)}
    <p class="nj-ntf-lbl">${L("وش نذكّرك فيه", "What to remind you about")}</p>
    ${row("t.exam", L("الاختبارات", "Exams"), L("قبلها بيوم + يوم الاختبار", "The day before + the day itself"), p.types.exam)}
    ${row("t.hw", L("الواجبات والكويزات", "Homework and quizzes"), L("قبلها بيومين", "Two days before"), p.types.hw)}
    ${row("t.mist", L("مراجعة الأخطاء", "Mistake reviews"), "", p.types.mist)}
    ${row("t.study", L("جلسات المذاكرة", "Study sessions"), L("ملخص الصبح", "Morning summary"), p.types.study)}
    <p class="nj-ntf-lbl">${L("وقت التذكير", "Reminder time")}</p>
    <div class="nj-seg" id="ntf-hour" role="group" aria-label="${L("وقت التذكير", "Reminder time")}">${HOURS.map((h) => `<button type="button" data-h="${h}" aria-pressed="${p.hour === h}">${EN ? (h - 12) + " PM" : (h - 12) + " م"}</button>`).join("")}</div>
    <button type="button" class="nj-btn nj-btn-line" id="ntf-test" style="width:100%;margin-top:var(--sp-6)" ${p.email || here ? "" : "disabled"}>${L("جرّب تنبيه الحين", "Send a test reminder")}</button>
    <p class="nj-hint" id="ntf-msg" aria-live="polite" style="margin:8px 0 0">${p.email || here ? "" : L("التنبيهات طافية الحين. شغّل الإيميل أو إشعار الجوال عشان توصلك.", "Reminders are off. Turn on email or phone notifications to get them.")}</p>`;
  const msg = (t) => { box.querySelector("#ntf-msg").textContent = t; };
  box.onchange = async (e) => {
    const k = e.target.getAttribute("data-n"); if (!k) return;
    const on = e.target.checked;
    try {
      if (k === "push") { if (on) { const r = await enablePush(); if (r !== "ok") { e.target.checked = false; msg(pushNote(r) || L("ما قدرنا نفعّلها", "Couldn't turn it on")); return; } } else { const t = { ...((prefs && prefs.tokens) || {}) }; if (myToken) delete t[myToken]; await save({ push: Object.keys(t).length > 0, tokens: t }); } }
      else if (k === "email") await save({ email: on });
      else { const types = { ...p.types, [k.slice(2)]: on }; p.types = types; await save({ types }); }
      if (!prefs.asked) await save({ asked: Date.now() });
      settings(box, user); msg(L("انحفظ", "Saved"));
    } catch (err) { console.warn(err); e.target.checked = !on; msg(L("ما قدرنا نحفظ، جرب مرة ثانية", "Couldn't save")); }
  };
  box.querySelector("#ntf-hour").onclick = async (e) => { const b = e.target.closest("[data-h]"); if (!b) return; try { await save({ hour: +b.dataset.h }); settings(box, user); msg(L("انحفظ", "Saved")); } catch (err) { msg(L("ما قدرنا نحفظ", "Couldn't save")); } };
  /* التجربة: نسجّل الطلب، والإرسال يمر عليه خلال ساعة */
  const what = () => [p.email && user.email ? L("إيميل", "an email") : "", here ? L("إشعار", "a notification") : ""].filter(Boolean).join(L(" و", " and "));
  const pending = () => L(`طلبت تجربة. بيوصلك ${what()} خلال ساعة تقريبًا. لو ما لقيت الإيميل، شيك على مجلد الرسائل غير المرغوب فيها.`, `Test requested. You'll get ${what()} within about an hour. If the email isn't there, check your spam folder.`);
  const testBtn = box.querySelector("#ntf-test");
  if (p.test && Date.now() - p.test < 36e5) { testBtn.disabled = true; msg(pending()); }
  testBtn.onclick = async (e) => {
    const b = e.currentTarget; b.disabled = true;
    try { await save({ test: Date.now() }); p.test = prefs.test; msg(pending()); }
    catch (err) { console.warn(err); b.disabled = false; msg(L("ما قدرنا نسجّل الطلب، جرب مرة ثانية", "Couldn't send the request, try again")); }
  };
}

/* ===== البداية: يناديها auth.js بعد ما يجيب بيانات الحساب ===== */
export function start(u, notify) {
  user = u; prefs = notify || null;
  const page = document.getElementById("najd")?.getAttribute("data-page") || "";
  if (["admin", "login", "register", "unsubscribe"].includes(page)) return;
  if (!prefs || !prefs.asked) { setTimeout(ask, 900); return; }
  if (prefs.skipped && !prefs.reasked) {
    const check = () => { if (hasExam()) { window.removeEventListener("najd:dirty", onDirty); reask(); } };
    const onDirty = (e) => { if (e.detail && e.detail.key === "stq_schedule_v1") setTimeout(check, 400); };
    window.addEventListener("najd:dirty", onDirty);
  }
  /* لو الطالب مفعّل الإشعار، نجدد رمز هذا الجهاز بهدوء (الرموز تتغير مع الوقت) */
  if (prefs.push && pushState() === "ok" && Notification.permission === "granted") enablePush().catch(() => {});
}
