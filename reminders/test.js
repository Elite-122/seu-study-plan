/* اختبار محلي للتنبيهات بدون إرسال حقيقي: node reminders/test.js */
process.env.TZ = "Asia/Riyadh";
const assert = require("assert");
const { build, emailHtml } = require("./build");
const { runSlot, runTests } = require("./run");

const data = {
  stq_schedule_v1: JSON.stringify({
    cells: { "0-0": "مبادئ المحاسبة", "1-0": "الإحصاء", "1-1": "الإحصاء", "2-5": "مبادئ الإدارة" },
    exams: [{ subject: "الإحصاء", type: "mid", date: "2026-11-22", time: "18:00" }, { subject: "مبادئ المحاسبة", type: "final", date: "2026-12-20" }],
  }),
  najd_study_v1: JSON.stringify({ setup: 1, chap: { "الإحصاء": { n: 6, done: [1, 2, 3, 4] } }, dl: [{ id: "d1", title: "واجب 2", sub: "مبادئ الإدارة", date: "2026-11-23", kind: "hw" }, { id: "d2", title: "كويز 1", sub: "الإحصاء", date: "2026-11-22", kind: "quiz" }] }),
  najd_mist_v1: JSON.stringify({ items: { a: { due: "2026-11-21" }, b: { due: "2026-11-22" }, c: { due: "2026-11-30" } } }),
};
const on = { types: { exam: true, hw: true, mist: true, study: true } };

// مساء السبت 21: بكرة ميدتيرم + كويز بكرة + واجب بعد يومين + سؤالين للمراجعة
let r = build(data, on, new Date("2026-11-21T20:00:00"), "pm");
console.log("PM:", JSON.stringify(r.items.map((x) => x.when + " | " + x.text + (x.tip ? " | " + x.tip : ""))), "\n   push:", r.push.title, "—", r.push.body, "\n   subject:", r.subject);
assert.strictEqual(r.items[0].kind, "exam");
assert.ok(r.items[0].text.includes("6:00 م"));
assert.ok(r.items[0].tip.includes("5 و6"));
assert.ok(r.items.some((x) => x.kind === "hw" && x.when === "بعد يومين"));
assert.ok(r.items.some((x) => x.kind === "mist" && x.text.startsWith("سؤالين")));

// صبح الأحد 22: اختبار اليوم + كويز اليوم + جلسات مذاكرة
r = build(data, on, new Date("2026-11-22T07:00:00"), "am");
console.log("AM:", JSON.stringify(r.items.map((x) => x.when + " | " + x.text)));
assert.ok(r.items.some((x) => x.kind === "exam" && x.when === "اليوم"));

// الطالب طفّى الاختبارات
r = build(data, { types: { exam: false, hw: false, mist: false, study: false } }, new Date("2026-11-21T20:00:00"), "pm");
assert.strictEqual(r.items.length, 0); assert.strictEqual(r.push, null);

// يوم فاضي: ما يرسل شيء
r = build({ stq_schedule_v1: JSON.stringify({ exams: [] }) }, on, new Date("2026-11-10T20:00:00"), "pm");
assert.strictEqual(r.items.length, 0);

// بيانات خربانة ما تطيّح الخادم
r = build({ stq_schedule_v1: "{oops", najd_study_v1: null }, on, new Date("2026-11-21T20:00:00"), "pm");
assert.strictEqual(r.items.length, 0);

const html = emailHtml({ name: "سارة", items: build(data, on, new Date("2026-11-21T20:00:00"), "pm").items, slot: "pm", site: "https://najdacdemy.com/", unsub: "https://x/unsub?u=1&k=2", settings: "https://najdacdemy.com/account.html#notify" });
require("fs").writeFileSync(require("path").join(__dirname, "email-preview.html"), html);
assert.ok(html.includes("إيقاف التنبيهات") && html.includes('dir="rtl"'));

/* التشغيل كامل على قاعدة بيانات وهمية */
function fakeDb(docs) {
  const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const merge = (a, b) => { const o = { ...a }; for (const k in b) o[k] = b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) && a[k] && typeof a[k] === "object" ? merge(a[k], b[k]) : b[k]; return o; };
  const setPath = (o, p, v) => { const ks = p.split("."), last = ks.pop(); let x = o; for (const k of ks) x = x[k] = x[k] && typeof x[k] === "object" ? x[k] : {}; x[last] = v; };
  const ref = (id) => ({ id, set: async (v, o = {}) => {
    if (o.mergeFields) { const cur = docs[id] || {}; o.mergeFields.forEach((p) => setPath(cur, p, get(v, p))); docs[id] = cur; }
    else docs[id] = o.merge ? merge(docs[id] || {}, v) : v;
  } });
  return {
    docs,
    collection: () => ({
      where: (f, op, v) => ({
        get: async () => {
          const list = Object.keys(docs).filter((id) => { const x = get(docs[id], f); return op === "==" ? x === v : x > v; });
          return { size: list.length, docs: list.map((id) => ({ id, ref: ref(id), data: () => JSON.parse(JSON.stringify(docs[id])) })) };
        },
      }),
    }),
  };
}
(async () => {
  const base = { types: on.types, key: "k123", on: true };
  const db = fakeDb({
    sara: { name: "سارة محمد", email: "sara@x.com", data, notify: { ...base, email: true, push: true, hour: 20, tokens: { good: 1, dead: 1 } } },
    ali: { name: "علي", email: "ali@x.com", data, notify: { ...base, email: true, push: false, hour: 21 } },
    noor: { name: "نور", email: "noor@x.com", data: {}, notify: { ...base, email: true, push: false, hour: 20 } },
    gone: { name: "خالد", email: "k@x.com", data, notify: { ...base, email: false, push: false, hour: 20 } },
    off: { name: "ريم", email: "r@x.com", data, notify: { ...base, on: false, email: true, hour: 20 } },
  });
  const mails = [], pushes = [];
  const mail = async (m) => { mails.push(m); };
  const messaging = { sendEachForMulticast: async (m) => { pushes.push(m); return { responses: m.tokens.map((t) => (t === "dead" ? { success: false, error: { code: "messaging/registration-token-not-registered" } } : { success: true })) }; } };
  const now = new Date("2026-11-21T20:00:00");

  let r = await runSlot({ db, hour: 20, now, mail, messaging });
  assert.deepStrictEqual(mails.map((m) => m.to), ["sara@x.com"]);          // علي ساعته 21، ونور ما عندها شيء، وخالد وريم طافين
  assert.ok(mails[0].subject.includes("الإحصاء") && mails[0].html.includes("سارة"));
  assert.ok(mails[0].headers["List-Unsubscribe"].includes("unsubscribe.html?u=sara&k=k123"));
  assert.strictEqual(pushes.length, 1);
  assert.deepStrictEqual(Object.keys(db.docs.sara.notify.tokens), ["good"]); // الرمز الميت انشال
  assert.strictEqual(db.docs.sara.notify.last, "2026-11-21-pm");
  assert.strictEqual(db.docs.gone.notify.on, false);                        // وقّف الإيميل من الرابط ← يطلع من القائمة
  assert.strictEqual(r.empty, 1);

  r = await runSlot({ db, hour: 20, now, mail, messaging });                // تشغيل ثاني بالغلط: ما يكرر
  assert.strictEqual(mails.length, 1); assert.strictEqual(r.dup, 1);

  await runSlot({ db, hour: 21, now: new Date("2026-11-21T21:00:00"), mail, messaging });
  assert.deepStrictEqual(mails.map((m) => m.to), ["sara@x.com", "ali@x.com"]);

  // طلب تجربة: يوصل مرة وحدة، والقديم يسقط
  db.docs.noor.notify.test = now.getTime() - 60e3;
  db.docs.ali.notify.test = now.getTime() - 7 * 36e5;
  r = await runTests({ db, now, mail, messaging });
  assert.strictEqual(r.size, 2); assert.strictEqual(r.sent, 1);
  assert.strictEqual(mails[mails.length - 1].to, "noor@x.com");
  assert.strictEqual(db.docs.noor.notify.test, 0); assert.strictEqual(db.docs.ali.notify.test, 0);
  r = await runTests({ db, now, mail, messaging });
  assert.strictEqual(r.size, 0);

  // إيميل فشل: ما ينحسب انرسل، ونجرب مرة ثانية التشغيل الجاي
  const db2 = fakeDb({ a: { email: "a@x.com", data, notify: { ...base, email: true, hour: 20 } } });
  await runSlot({ db: db2, hour: 20, now, mail: async () => { throw new Error("smtp down"); }, messaging });
  assert.strictEqual(db2.docs.a.notify.last, undefined);

  console.log("ok: all reminder checks passed");
})().catch((e) => { console.error(e); process.exit(1); });
