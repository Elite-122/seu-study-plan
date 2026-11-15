/* يجهّز تذكير طالب واحد من بياناته المحفوظة في حسابه (users/{uid}.data).
   الصبح (am): اختبار اليوم، وموعد اليوم، وجلسات مذاكرة اليوم.
   المساء (pm، في الساعة اللي اختارها): اختبار بكرة، وواجب بكرة أو بعد يومين، وأسئلة جا وقت مراجعتها.
   ما يرسل شيء إذا ما فيه شيء. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DAY = 864e5;
const pad = (n) => (n < 10 ? "0" : "") + n;
const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const add = (d, n) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() + n); return x; };
const parse = (s) => { try { return JSON.parse(s || "null"); } catch (e) { return null; } };
const t12 = (hhmm) => { const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || ""); if (!m) return ""; const h = +m[1]; return ((h % 12) || 12) + ":" + m[2] + (h >= 12 ? " م" : " ص"); };
const clock = (min) => { const h = Math.floor(min / 60), m = min % 60; return ((h % 12) || 12) + ":" + pad(m) + (h >= 12 ? " م" : " ص"); };
const typeName = (x) => (x.type === "final" ? "فاينل" : "ميدتيرم");
const qn = (n) => (n === 1 ? "سؤال واحد" : n === 2 ? "سؤالين" : n <= 10 ? n + " أسئلة" : n + " سؤال");
const sn = (n) => (n === 1 ? "جلسة وحدة" : n === 2 ? "جلستين" : n <= 10 ? n + " جلسات" : n + " جلسة");

/* محرك خطة المذاكرة نفسه اللي في الموقع (يقراه من assets/js) */
let STUDY = null;
function studyEngine() {
  if (STUDY !== null) return STUDY;
  try {
    const dir = path.join(__dirname, "..", "assets", "js");
    const code = fs.readFileSync(path.join(dir, "courses-data.js"), "utf8") + "\n" + fs.readFileSync(path.join(dir, "study-core.js"), "utf8");
    const store = {};
    const ctx = { window: {}, localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } }, console };
    vm.runInNewContext(code, ctx);
    STUDY = { S: ctx.window.NajdStudy, store };
  } catch (e) { console.warn("study engine unavailable", e.message); STUDY = false; }
  return STUDY;
}

/**
 * @param data  users/{uid}.data (كل قيمة نص JSON)
 * @param n     users/{uid}.notify
 * @param now   الوقت الحين (بتوقيت الرياض)
 * @param slot  "am" | "pm"
 * @returns {{items: Array<{when:string, text:string, kind:string}>, push: {title, body, link} | null, subject: string}}
 */
function build(data, n, now, slot) {
  const types = { exam: true, hw: true, mist: true, study: true, ...((n && n.types) || {}) };
  const sched = parse(data && data.stq_schedule_v1) || {};
  const study = parse(data && data.najd_study_v1) || {};
  const mist = parse(data && data.najd_mist_v1) || {};
  const today = ymd(now), tom = ymd(add(now, 1)), in2 = ymd(add(now, 2));
  const exams = (sched.exams || []).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.date || "") && String(x.subject || "").trim());
  const items = [];
  const chapLeft = (sub) => { const c = (study.chap || {})[sub]; if (!c || !c.n) return ""; const left = []; for (let i = 1; i <= c.n; i++) if (!(c.done || []).includes(i)) left.push(i); return left.length ? "باقي عليك الفصل " + left.join(" و") : "خلّصت كل الفصول، راجع أخطاءك"; };

  if (slot === "am") {
    if (types.exam) exams.filter((x) => x.date === today).forEach((x) => items.push({ kind: "exam", when: "اليوم", text: `${typeName(x)} ${x.subject.trim()}${x.time ? " الساعة " + t12(x.time) : ""}`, tip: "مراجعة خفيفة لأخطائك بس، وبالتوفيق" }));
    if (types.hw) (study.dl || []).filter((x) => x.date === today).forEach((x) => items.push({ kind: "hw", when: "اليوم", text: `${x.title}${x.sub ? " · " + x.sub : ""}` }));
    if (types.study) {
      const E = studyEngine();
      if (E && E.S && (sched.cells && Object.keys(sched.cells).length)) {
        E.store.najd_study_v1 = data.najd_study_v1 || "{}";
        const p = E.S.plan({ sched, state: E.S.state(), now });
        const D = E.S.todayOf(p), list = D ? D.ses.filter((x) => !x.missed) : [];
        if (list.length) items.push({ kind: "study", when: "اليوم", text: `${sn(list.length)} مذاكرة، أولها ${clock(list[0].start)}: ${list[0].name}` });
      }
    }
  } else {
    if (types.exam) exams.filter((x) => x.date === tom).forEach((x) => { const l = chapLeft(x.subject.trim()); items.push({ kind: "exam", when: "بكرة", text: `${typeName(x)} ${x.subject.trim()}${x.time ? " الساعة " + t12(x.time) : ""}`, tip: l }); });
    if (types.hw) (study.dl || []).filter((x) => x.date === tom || x.date === in2).sort((a, b) => a.date.localeCompare(b.date)).forEach((x) => items.push({ kind: "hw", when: x.date === tom ? "بكرة" : "بعد يومين", text: `${x.title}${x.sub ? " · " + x.sub : ""}` }));
    if (types.mist) { const due = Object.values(mist.items || {}).filter((x) => x && x.due && x.due <= tom).length; if (due) items.push({ kind: "mist", when: "بكرة", text: `${qn(due)} غلطت فيها قبل، جا وقت مراجعتها`, link: "quiz.html?review=all" }); }
  }
  if (!items.length) return { items, push: null, subject: "" };

  const first = items[0];
  const link = first.kind === "mist" ? "quiz.html?review=all" : first.kind === "exam" ? "study.html#exam" : first.kind === "study" ? "study.html" : "study.html";
  const title = first.kind === "exam" ? `${first.when} ${first.text.split(" الساعة")[0]}` : first.kind === "hw" ? `موعد ${first.when}: ${first.text.split(" · ")[0]}` : first.kind === "study" ? "مذاكرة اليوم" : "دفتر أخطائك";
  let body = first.kind === "exam" ? `${first.when} ${first.text}.${first.tip ? " " + first.tip + "." : ""}` : `${first.text}.`;
  if (items.length > 1) body += ` وعندك ${items.length - 1 === 1 ? "تذكير ثاني" : items.length - 1 + " تذكيرات ثانية"}.`;
  const subject = (slot === "am" ? "تذكيرك لليوم: " : "تذكيرك لبكرة: ") + (first.kind === "mist" ? "مراجعة أخطائك" : first.text.split(" الساعة")[0]);
  return { items, push: { title, body, link, tag: "najd-" + today + "-" + slot }, subject };
}

/* الإيميل: بسيط، من اليمين لليسار، ويشتغل في كل برامج البريد */
function emailHtml({ name, items, slot, site, unsub, settings }) {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const color = { exam: "#A3473E", hw: "#B8943A", mist: "#568A88", study: "#2F4F4E" };
  const hi = slot === "am" ? "صباح الخير" : "مساء الخير";
  const rows = items.map((x) => `<tr><td style="padding:0 0 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F7F7;border-radius:10px;border-right:4px solid ${color[x.kind] || "#568A88"}"><tr><td style="padding:10px 12px;font-size:15px;color:#243D3C;line-height:1.7"><span style="display:inline-block;background:#fff;border-radius:99px;padding:1px 10px;font-size:12px;font-weight:bold;margin-left:6px">${esc(x.when)}</span>${esc(x.text)}${x.tip ? `<br><span style="font-size:13px;color:#55696B">${esc(x.tip)}</span>` : ""}</td></tr></table></td></tr>`).join("");
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#EEF2F2;font-family:Tahoma,Arial,sans-serif;direction:rtl">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F2;padding:20px 0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;text-align:right">
<tr><td style="background:#2F4F4E;padding:16px 20px;color:#ffffff;font-size:18px;font-weight:bold">أكاديمية نجد</td></tr>
<tr><td style="padding:20px">
<p style="margin:0 0 14px;font-size:18px;font-weight:bold;color:#243D3C">${hi}${name ? " " + esc(name) : ""}، هذي مواعيدك ${slot === "am" ? "اليوم" : "القريبة"}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<p style="margin:16px 0 0"><a href="${site}study.html" style="display:inline-block;background:#2F4F4E;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:10px;padding:12px 20px">افتح خطة المذاكرة</a></p>
</td></tr>
<tr><td style="padding:12px 20px;border-top:1px solid #EEF2F2;font-size:12px;color:#777;line-height:1.8">وصلك هذا الإيميل لأنك فعّلت تنبيهات الدراسة في أكاديمية نجد. ما نرسل إعلانات.<br><a href="${unsub}" style="color:#777">إيقاف التنبيهات</a> · <a href="${settings}" style="color:#777">تعديل الإعدادات</a></td></tr>
</table></td></tr></table></body></html>`;
}
function emailText({ name, items, slot, unsub }) {
  return `${slot === "am" ? "صباح الخير" : "مساء الخير"}${name ? " " + name : ""}، هذي مواعيدك:\n\n` + items.map((x) => `- ${x.when}: ${x.text}${x.tip ? " (" + x.tip + ")" : ""}`).join("\n") + `\n\nإيقاف التنبيهات: ${unsub}\n`;
}

module.exports = { build, emailHtml, emailText, ymd };
