/* خادم تنبيهات الدراسة (Firebase Functions، يحتاج خطة Blaze).
   - reminders: يشتغل الساعة 7 الصبح و7 و8 و9 مساءً بتوقيت الرياض، ويرسل لكل طالب في وقته.
   - notifyTest: زر «جرّب تنبيه الحين» في حسابي.
   - unsubscribe: رابط «إيقاف التنبيهات» في آخر كل إيميل.
   الأسرار: GMAIL_APP_PASSWORD (كلمة مرور تطبيق لإيميل الموقع). */
process.env.TZ = "Asia/Riyadh";
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { build, emailHtml, emailText, ymd } = require("./reminders");

admin.initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 3 });
const GMAIL = defineSecret("GMAIL_APP_PASSWORD");
const FROM = "najdacdemy@gmail.com";
const SITE = "https://najdacdemy.com/";
const UNSUB = "https://us-central1-najd-141.cloudfunctions.net/unsubscribe";

let mailer = null;
function mail() {
  if (!mailer) mailer = nodemailer.createTransport({ service: "gmail", auth: { user: FROM, pass: GMAIL.value() } });
  return mailer;
}
const unsubLink = (uid, key) => `${UNSUB}?u=${encodeURIComponent(uid)}&k=${encodeURIComponent(key || "")}`;

/* يرسل لطالب واحد. يرجّع وش انرسل */
async function sendTo(ref, u, r, slot) {
  const n = u.notify || {}, out = { email: false, push: 0 };
  const firstName = String(u.name || "").trim().split(/\s+/)[0] || "";
  if (n.email && u.email) {
    try {
      const unsub = unsubLink(ref.id, n.key);
      await mail().sendMail({
        from: `أكاديمية نجد <${FROM}>`, to: u.email, subject: r.subject,
        html: emailHtml({ name: firstName, items: r.items, slot, site: SITE, unsub, settings: SITE + "account.html#notify" }),
        text: emailText({ name: firstName, items: r.items, slot, unsub }),
        headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      });
      out.email = true;
    } catch (e) { console.warn("email failed", ref.id, e.message); }
  }
  const tokens = Object.keys(n.tokens || {});
  if (n.push && tokens.length && r.push) {
    const res = await admin.messaging().sendEachForMulticast({
      tokens,
      webpush: { data: { title: r.push.title, body: r.push.body, link: r.push.link, tag: r.push.tag }, headers: { Urgency: "high", TTL: "43200" } },
    });
    const bad = {};
    res.responses.forEach((x, i) => {
      if (x.success) out.push++;
      else if (["messaging/registration-token-not-registered", "messaging/invalid-registration-token", "messaging/invalid-argument"].includes(x.error && x.error.code)) bad[tokens[i]] = 1;
    });
    if (Object.keys(bad).length) {
      const left = {}; tokens.forEach((t) => { if (!bad[t]) left[t] = n.tokens[t]; });
      await ref.set({ notify: { tokens: left, push: Object.keys(left).length > 0 } }, { merge: true });
    }
  }
  return out;
}

exports.reminders = onSchedule({ schedule: "0 7,19,20,21 * * *", timeZone: "Asia/Riyadh", secrets: [GMAIL], timeoutSeconds: 540, memory: "512MiB" }, async () => {
  const now = new Date(), hour = now.getHours(), slot = hour < 12 ? "am" : "pm", stamp = ymd(now) + "-" + slot;
  const snap = await admin.firestore().collection("users").where("notify.on", "==", true).get();
  let sent = 0, skipped = 0;
  for (const d of snap.docs) {
    const u = d.data(), n = u.notify || {};
    if (slot === "pm" && (+n.hour || 20) !== hour) continue;   // كل طالب في الساعة اللي اختارها
    if (n.last === stamp) { skipped++; continue; }              // ما نكرر لو الدالة اشتغلت مرتين
    try {
      const r = build(u.data || {}, n, now, slot);
      if (!r.items.length) continue;
      const o = await sendTo(d.ref, u, r, slot);
      if (o.email || o.push) { sent++; await d.ref.set({ notify: { last: stamp } }, { merge: true }); }
    } catch (e) { console.warn("reminder failed", d.id, e.message); }
  }
  console.log(`reminders ${stamp}: users ${snap.size}, sent ${sent}, skipped ${skipped}`);
});

/* «جرّب تنبيه الحين» من صفحة حسابي */
exports.notifyTest = onCall({ secrets: [GMAIL] }, async (req) => {
  if (!req.auth) throw new HttpsError("unauthenticated", "سجّل دخولك");
  const ref = admin.firestore().collection("users").doc(req.auth.uid), s = await ref.get();
  const u = s.exists ? s.data() : {};
  const r = { items: [{ kind: "study", when: "تجربة", text: "هذا تنبيه تجريبي من أكاديمية نجد. إذا وصلك، تنبيهاتك شغالة." }], subject: "تجربة تنبيهات الدراسة", push: { title: "تنبيهاتك شغالة", body: "هذا تنبيه تجريبي من أكاديمية نجد.", link: "account.html#notify", tag: "najd-test" } };
  return sendTo(ref, u, r, "pm");
});

/* رابط «إيقاف التنبيهات» في الإيميل: يوقف الإيميل بس، بدون دخول */
exports.unsubscribe = onRequest(async (req, res) => {
  const uid = String(req.query.u || ""), key = String(req.query.k || "");
  let ok = false;
  if (uid && key) {
    const ref = admin.firestore().collection("users").doc(uid), s = await ref.get();
    const n = s.exists ? s.data().notify || {} : {};
    if (n.key && n.key === key) { await ref.set({ notify: { email: false, on: !!n.push } }, { merge: true }); ok = true; }
  }
  res.set("Content-Type", "text/html; charset=utf-8").status(ok ? 200 : 400).send(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>أكاديمية نجد</title></head>
<body style="margin:0;background:#F4F7F7;font-family:Tahoma,Arial,sans-serif;color:#243D3C;display:flex;min-height:100vh;align-items:center;justify-content:center">
<div style="background:#fff;border-radius:16px;padding:28px;max-width:420px;margin:16px;text-align:center;box-shadow:0 8px 24px rgba(36,61,60,.08)">
<h1 style="font-size:22px;margin:0 0 10px">${ok ? "أوقفنا إيميلات التنبيه" : "الرابط ما اشتغل"}</h1>
<p style="color:#55696B;line-height:1.8;margin:0 0 18px">${ok ? "ما راح توصلك إيميلات تذكير بعد اليوم. تقدر ترجعها متى ما تبي من حسابك." : "يمكن الرابط قديم. تقدر توقف التنبيهات من صفحة حسابك."}</p>
<a href="${SITE}account.html#notify" style="display:inline-block;background:#2F4F4E;color:#fff;text-decoration:none;font-weight:bold;border-radius:10px;padding:12px 20px">إعدادات التنبيهات</a></div></body></html>`);
});
