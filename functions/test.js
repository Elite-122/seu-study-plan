/* اختبار محلي لتجهيز التذكير (بدون إرسال): node test.js
   يحتاج نسخة من ملفات الموقع في shared/ (وقت النشر تنسخ لحالها):
   mkdir -p shared && cp ../assets/js/study-core.js ../assets/js/courses-data.js shared/ */
process.env.TZ = "Asia/Riyadh";
const assert = require("assert");
const { build, emailHtml } = require("./reminders");

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
console.log("ok: all reminder checks passed");
