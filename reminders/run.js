/* يرسل تنبيهات الدراسة. يشغّله GitHub Actions (.github/workflows/reminders.yml)، وما يحتاج خطة Blaze.
   MODE=7          تذكير الصبح
   MODE=19|20|21   تذكير المساء لكل طالب اختار هذي الساعة
   MODE=tests      الإيميلات التجريبية اللي طلبها الطلاب من «حسابي ← تنبيهاتي»
   يحتاج: FIREBASE_SERVICE_ACCOUNT (ملف JSON لحساب الخدمة) و GMAIL_APP_PASSWORD. */
process.env.TZ = "Asia/Riyadh";
const { build, emailHtml, emailText, ymd } = require("./build");

const FROM = "najdacdemy@gmail.com";
const SITE = "https://najdacdemy.com/";
const BAD_TOKEN = ["messaging/registration-token-not-registered", "messaging/invalid-registration-token", "messaging/invalid-argument"];
const TEST_MAX_AGE = 6 * 36e5; // طلب التجربة يسقط بعد ٦ ساعات

/* تذكير متأخر ما نرسله: GitHub أحيانًا يأخر التشغيل ساعات.
   الصبح (7) يطلع بين 6 و11 الصبح، والمساء (19/20/21) من الساعة اللي قبلها لين 12 الليل. بتوقيت الرياض */
function onTime(mode, now) {
  const h = now.getHours();
  if (mode === 7) return h >= 6 && h < 11;
  return h >= mode - 1 && h <= 23;
}

const unsubLink = (uid, key) => `${SITE}unsubscribe.html?u=${encodeURIComponent(uid)}&k=${encodeURIComponent(key || "")}`;

/* يرسل لطالب واحد ويرجّع وش انرسل */
async function sendTo({ ref, u, r, slot, mail, messaging }) {
  const n = u.notify || {}, out = { email: false, push: 0 };
  const firstName = String(u.name || "").trim().split(/\s+/)[0] || "";
  if (n.email && u.email && mail) {
    try {
      const unsub = unsubLink(ref.id, n.key);
      await mail({
        from: `أكاديمية نجد <${FROM}>`, to: u.email, subject: r.subject,
        html: emailHtml({ name: firstName, items: r.items, slot, site: SITE, unsub, settings: SITE + "account.html#notify" }),
        text: emailText({ name: firstName, items: r.items, slot, unsub }),
        headers: { "List-Unsubscribe": `<${unsub}>, <mailto:${FROM}?subject=unsubscribe>` },
      });
      out.email = true;
    } catch (e) { console.warn("email failed", ref.id, e.message); }
  }
  const tokens = Object.keys(n.tokens || {});
  if (n.push && tokens.length && r.push && messaging) {
    try {
      const res = await messaging.sendEachForMulticast({
        tokens,
        webpush: { data: { title: r.push.title, body: r.push.body, link: r.push.link, tag: r.push.tag }, headers: { Urgency: "high", TTL: "43200" } },
      });
      const bad = {};
      res.responses.forEach((x, i) => {
        if (x.success) out.push++;
        else if (BAD_TOKEN.includes(x.error && x.error.code)) bad[tokens[i]] = 1;
      });
      if (Object.keys(bad).length) {
        const left = {}; tokens.forEach((t) => { if (!bad[t]) left[t] = n.tokens[t]; });
        // mergeFields يبدّل قائمة الرموز كاملة (merge العادي يخلّي الرموز القديمة)
        await ref.set({ notify: { tokens: left, push: Object.keys(left).length > 0 } }, { mergeFields: ["notify.tokens", "notify.push"] });
      }
    } catch (e) { console.warn("push failed", ref.id, e.message); }
  }
  return out;
}

/* تذكير الصبح أو المساء */
async function runSlot({ db, hour, now, mail, messaging }) {
  const slot = hour < 12 ? "am" : "pm", stamp = ymd(now) + "-" + slot;
  const snap = await db.collection("users").where("notify.on", "==", true).get();
  let sent = 0, empty = 0, dup = 0;
  for (const d of snap.docs) {
    const u = d.data(), n = u.notify || {};
    if (!n.email && !n.push) { await d.ref.set({ notify: { on: false } }, { merge: true }); continue; } // وقّف الإيميل من الرابط
    if (slot === "pm" && (+n.hour || 20) !== hour) continue;   // كل طالب في الساعة اللي اختارها
    if (n.last === stamp) { dup++; continue; }                  // ما نكرر لو التشغيل صار مرتين
    try {
      const r = build(u.data || {}, n, now, slot);
      if (!r.items.length) { empty++; continue; }
      const o = await sendTo({ ref: d.ref, u, r, slot, mail, messaging });
      if (o.email || o.push) { sent++; await d.ref.set({ notify: { last: stamp } }, { merge: true }); }
    } catch (e) { console.warn("reminder failed", d.id, e.message); }
  }
  const line = `reminders ${stamp} (${hour}): on ${snap.size}, sent ${sent}, nothing due ${empty}, already sent ${dup}`;
  console.log(line);
  return { sent, empty, dup, size: snap.size };
}

/* «جرّب تنبيه» من حسابي: الطالب يطلبه، وهنا نرسله */
async function runTests({ db, now, mail, messaging }) {
  const snap = await db.collection("users").where("notify.test", ">", 0).get();
  let sent = 0;
  for (const d of snap.docs) {
    const u = d.data(), n = u.notify || {};
    try {
      if (now.getTime() - (+n.test || 0) <= TEST_MAX_AGE) {
        const r = {
          items: [{ kind: "study", when: "تجربة", text: "هذا تنبيه تجريبي من أكاديمية نجد. إذا وصلك، تنبيهاتك شغالة." }],
          subject: "تجربة تنبيهات الدراسة",
          push: { title: "تنبيهاتك شغالة", body: "هذا تنبيه تجريبي من أكاديمية نجد.", link: "account.html#notify", tag: "najd-test" },
        };
        const o = await sendTo({ ref: d.ref, u, r, slot: "pm", mail, messaging });
        if (o.email || o.push) sent++;
      }
    } catch (e) { console.warn("test failed", d.id, e.message); }
    await d.ref.set({ notify: { test: 0 } }, { merge: true });
  }
  console.log(`tests: requested ${snap.size}, sent ${sent}`);
  return { sent, size: snap.size };
}

module.exports = { runSlot, runTests, sendTo, unsubLink, onTime };

async function main() {
  const mode = String(process.env.MODE || "").trim();
  if (!/^(7|19|20|21|tests)$/.test(mode)) throw new Error("MODE must be 7, 19, 20, 21 or tests");
  const admin = require("firebase-admin");
  const nodemailer = require("nodemailer");
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  const transport = nodemailer.createTransport({ service: "gmail", auth: { user: FROM, pass: process.env.GMAIL_APP_PASSWORD } });
  const ctx = { db: admin.firestore(), now: new Date(), mail: (m) => transport.sendMail(m), messaging: admin.messaging() };
  if (mode !== "tests") {
    if (onTime(+mode, ctx.now)) await runSlot({ ...ctx, hour: +mode });
    else console.log(`reminders ${mode}: late run at ${ctx.now.toTimeString().slice(0, 5)} Riyadh, skipped`);
  }
  await runTests(ctx);
}

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
