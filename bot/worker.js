/* بوت تيليقرام لأكاديمية نجد (@NajdAcademyBot) على Cloudflare Workers.
   ١) يرد على أسئلة الطلاب من دليل الطالب والتقويم الأكاديمي اللي في الموقع (assets/data/bot.json):
      في الخاص دايم، وفي القروبات بس لما أحد يمنشن البوت أو يرد على رسالته أو يستخدم أمر.
   ٢) ردودك الخاصة: كلمة ← رد (نص أو صورة أو ملف)، تشتغل في أي رسالة فيها الكلمة، في الخاص والقروبات.
   ٣) حماية القروبات: الكلام الممنوع ينحذف وصاحبه ينطرد (ويوصلك تنبيه فيه زر «فك الطرد»)،
      والروابط وأرقام الجوالات من غير المشرفين تنحذف إلا المواقع المسموحة.
   ٤) النشر: المشرف يرسل الإعلان للبوت في الخاص، يختار القروبات، والبوت ينشره.
   كل الإدارة من البوت في الخاص: /admin

   الإعدادات في Cloudflare (Settings ← Variables and Secrets):
     BOT_TOKEN       (Secret)  توكن البوت من BotFather. لا تكتبه في أي مكان ثاني.
     WEBHOOK_SECRET  (Secret)  كلمة سر طويلة تختارها أنت (حروف إنجليزي وأرقام بس).
     ADMIN_IDS       (Text)    أرقام حسابات المشرفين في تيليقرام، بينها فاصلة. رقمك يعطيك إياه البوت بأمر /myid
     BOT_USERNAME    (Text)    NajdAcademyBot
     DATA_URL        (Text)    اختياري. الافتراضي https://najdacdemy.com/assets/data/bot.json
   وKV namespace مربوط باسم BOT_KV. */

const DEFAULT_DATA = 'https://najdacdemy.com/assets/data/bot.json';
const TZ = 'Asia/Riyadh';
const NOTICE_MS = 20000; // تنبيهات القروب تنحذف بعد ٢٠ ثانية

/* ---------- القوائم الافتراضية (تقدر تعدّلها كلها من البوت: /admin) ---------- */
const CATS = {
  politics: 'كلام سياسي',
  insults: 'سب وشتم',
  sexual: 'محتوى غير لائق',
  crypto: 'إعلانات عملات رقمية وأرباح',
  homework: 'بيع حلول واجبات واختبارات',
  sickleave: 'بيع سكليف وأعذار',
  ads: 'إعلانات'
};
const DEFAULT_BANNED = {
  politics: ['الحوثي', 'الحوثيين', 'حوثي', 'اسرائيل', 'اسرائيلي', 'الصهاينة', 'صهيوني', 'حزب الله', 'داعش', 'الاخوان المسلمين', 'ترامب', 'بايدن', 'نتنياهو', 'بوتين', 'خامنئي', 'اردوغان', 'مظاهرات', 'انقلاب عسكري'],
  insults: ['يا كلب', 'يا حمار', 'يا حيوان', 'يا حقير', 'يا وسخ', 'يا زبالة', 'يا غبي', 'ابن الكلب', 'ابن الحرام', 'يلعن', 'لعنة الله', 'قحبة', 'شرموط', 'شرموطة', 'عرص', 'منيوك', 'خرا', 'كس امك', 'زب', 'طيز', 'تفو'],
  sexual: ['سكس', 'اباحي', 'اباحية', 'نيك', 'porn', 'xxx', 'sex'],
  crypto: ['بيتكوين', 'بتكوين', 'bitcoin', 'btc', 'usdt', 'كريبتو', 'crypto', 'عملات رقمية', 'بينانس', 'binance', 'فوركس', 'forex', 'ارباح يومية', 'ربح مضمون', 'استثمار مضمون', 'توصيات تداول'],
  homework: ['حل واجبات', 'حلول واجبات', 'نحل واجبات', 'نحل الواجبات', 'حل الواجبات', 'حل اختبارات', 'نحل اختبارات', 'نحل الاختبارات', 'نختبر عنك', 'اختبر عنك', 'بحوث جاهزة', 'كتابة بحوث', 'عمل بحوث', 'مشاريع تخرج جاهزة'],
  sickleave: ['سكليف', 'سكاليف', 'سك ليف', 'sick leave', 'اجازات مرضية', 'تقارير طبية', 'اعذار طبية معتمدة', 'معتمدة من صحتي'],
  ads: ['للتواصل واتساب', 'تواصل واتساب', 'راسلني خاص', 'راسلنا خاص', 'متوفر لدينا', 'اطلب الان']
};
const DEFAULT_DOMAINS = ['najdacdemy.com', 'seu.edu.sa', 't.me/najdacdemy'];

/* ---------- أدوات عامة ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  let j = null; try { j = await r.json(); } catch (e) { j = { ok: false }; }
  return j;
}
const send = (env, chat, text, extra = {}) => tg(env, 'sendMessage', { chat_id: chat, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...extra });
const edit = (env, chat, msg, text, extra = {}) => tg(env, 'editMessageText', { chat_id: chat, message_id: msg, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...extra });
const kb = (rows) => ({ reply_markup: { inline_keyboard: rows } });
const btn = (text, data) => ({ text, callback_data: data });
const url = (text, u) => ({ text, url: u });
const replyTo = (id) => (id ? { reply_parameters: { message_id: id, allow_sending_without_reply: true } } : {});
const admins = (env) => String(env.ADMIN_IDS || '').split(/[,\s]+/).filter(Boolean).map(Number);
const isAdmin = (env, id) => admins(env).includes(Number(id));
const botName = (env) => String(env.BOT_USERNAME || 'NajdAcademyBot').replace(/^@/, '');
const who = (u) => esc(((u && (u.first_name || '') + (u.last_name ? ' ' + u.last_name : '')) || 'عضو').trim() || 'عضو');
async function kvJson(env, key, def) { try { const v = await env.BOT_KV.get(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
const kvPut = (env, key, v, ttl) => env.BOT_KV.put(key, JSON.stringify(v), ttl ? { expirationTtl: ttl } : undefined);

/* ---------- البيانات (من الموقع، تنحفظ ١٠ دقايق) ---------- */
let DATA = null, DATA_AT = 0;
async function data(env) {
  if (DATA && Date.now() - DATA_AT < 10 * 60e3) return DATA;
  const r = await fetch(env.DATA_URL || DEFAULT_DATA, { cf: { cacheTtl: 600 } });
  if (!r.ok) { if (DATA) return DATA; throw new Error('data ' + r.status); }
  DATA = await r.json(); DATA_AT = Date.now();
  return DATA;
}

/* ---------- تطبيع النص العربي ---------- */
function norm(s) {
  return String(s).toLowerCase().replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[ً-ٰٟـ​-‏‪-‮⁦-⁩]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[^ء-يa-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
const squash = (s) => norm(s).replace(/\s+/g, '');
const PREFIX = /^(وال|بال|فال|كال|لل|ال|و|ف|ب)(?=..)/;

/* ---------- البحث في الدليل والتقويم ---------- */
const STOP = new Set('وش ايش شو كيف متي هل اقدر ابي ابغي ابغا ودي عن في من علي الي او و لو ما اذا يا انا لي كم وين شي مع بعد قبل اللي الي هذا هذي ذا يعني تكفي الله السلام عليكم مرحبا هلا سوال ممكن لازم يصير وشلون ليش لماذا ماذا هو هي انت عندي عندك له لها كان يكون اي قد لا'.split(' '));
const CAL_HINT = /(متي|موعد|مواعيد|تاريخ|يبدا|يفتح|يقفل|اخر يوم|فتره|التقويم|بدايه|نهايه)/;
function stem(w) {
  w = w.replace(/^(وال|بال|فال|كال|لل|ال)/, '');
  if (w.length > 4) w = w.replace(/(ات|ين|ون|ها|هم|نا|كم)$/, '');
  if (w.length > 3) w = w.replace(/[هي]$/, '');
  return w;
}
/* كلمات بنفس المعنى: الطالب يكتب «مادة» والدليل يقول «مقرر» */
const SYN = { ماده: 'مقرر', مواد: 'مقرر', ماد: 'مقرر', باسورد: 'مرور', سعر: 'رسوم', اسعار: 'رسوم', تكلفه: 'رسوم', فلوس: 'رسوم', تبدا: 'بدايه', يبدا: 'بدايه', بدا: 'بدايه', بدء: 'بدايه', تبدي: 'بدايه', اجل: 'تاجيل', ااجل: 'تاجيل', اجيل: 'تاجيل', تاجيل: 'تاجيل', درجات: 'درجه' };
const syn = (w) => SYN[w] || SYN[w.replace(/^(وال|بال|فال|لل|ال)/, '')] || w;
const toks = (s) => norm(s).split(' ').filter((w) => w.length > 1 && !STOP.has(w)).map(syn).map(stem).filter((w) => w.length > 1);
const hit = (a, b) => a === b || (a.length >= 3 && b.length >= 3 && (a.startsWith(b) || b.startsWith(a)));
function score(q, words, weight) { let s = 0; for (const t of q) if (words.some((w) => hit(t, w))) s += weight; return s; }
let INDEX = null, INDEX_FOR = null;
function index(D) {
  if (INDEX_FOR === D) return INDEX;
  INDEX = { qa: [], cal: [] };
  D.sections.forEach((s, i) => s.qa.forEach((x, j) => INDEX.qa.push({ i, j, qw: toks(x.q), aw: toks(x.p), sw: toks(s.t) })));
  D.cal.items.forEach((x, k) => INDEX.cal.push({ k, w: toks(x.t) }));
  INDEX_FOR = D; return INDEX;
}
function search(D, text) {
  const q = toks(text); const I = index(D);
  if (!q.length) return { q, guide: [], cal: [], calIntent: false };
  const sy = q.filter((t) => Object.values(SYN).map(stem).includes(t)); // كلمة جات من «نفس المعنى» تاخذ وزن أكبر شوي
  const guide = I.qa.map((x) => ({ i: x.i, j: x.j, s: score(q, x.qw, 3) + score(sy, x.qw, 1) + score(q, x.aw, 1) + score(q, x.sw, 1), qs: score(q, x.qw, 1) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const cal = I.cal.map((x) => ({ k: x.k, s: score(q, x.w, 2) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  return { q, guide, cal, calIntent: CAL_HINT.test(norm(text)) };
}

/* ---------- التواريخ ---------- */
function today() { return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()); }
const D2 = (s) => { const p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)); };
const fmt = (s) => new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(D2(s));
const days = (a, b) => Math.round((D2(b) - D2(a)) / 864e5);
const ANN = { ext: 'مدّدته العمادة', chg: 'عدّلته العمادة' };
function line(x, t) {
  const tag = x.a && ANN[x.a.k] ? ` <i>(${ANN[x.a.k]})</i>` : '';
  if (x.e && x.d <= t && t <= x.e) return `• ${esc(x.t)}: يقفل ${fmt(x.e)}${days(t, x.e) <= 3 ? ' ⏳' : ''}${tag}`;
  if (x.e) return `• ${esc(x.t)}: من ${fmt(x.d)} إلى ${fmt(x.e)}${tag}`;
  return `• ${esc(x.t)}: ${fmt(x.d)}${tag}`;
}
function datesText(D) {
  const t = today(); const items = D.cal.items;
  const open = items.filter((x) => x.e && x.d <= t && t <= x.e).sort((a, b) => (a.e < b.e ? -1 : 1));
  const soon = items.filter((x) => x.d > t).slice(0, 4);
  let s = '';
  if (open.length) s += '<b>مفتوح أو جاري الحين:</b>\n' + open.map((x) => line(x, t)).join('\n');
  if (soon.length) s += (s ? '\n\n' : '') + '<b>الجاي:</b>\n' + soon.map((x) => line(x, t)).join('\n');
  if (!s) s = 'ما فيه مواعيد جاية في التقويم الحالي. نضيف تقويم السنة الجاية أول ما تنشره الجامعة.';
  return s + `\n\n<i>المصدر: التقويم الأكاديمي الرسمي ${esc(D.cal.year)}هـ. لو اختلف موعد، المعتمد موقع الجامعة.</i>`;
}

/* ---------- رسائل الطالب ---------- */
const HOME = (admin) => kb([[btn('دليل الطالب', 'g'), btn('المواعيد الجاية', 'd')], [btn('📋 قائمة الردود', 'm'), btn('أدوات نجد', 't')]].concat(admin ? [[btn('لوحة البوت (للمشرفين)', 'a:menu')]] : []));
const WELCOME = 'هلا! أنا بوت <b>أكاديمية نجد</b>.\nاسألني عن لوائح الجامعة ومواعيدها، مثل: «وش شروط حذف مقرر؟» أو «متى يقفل الانسحاب؟»، أو اختر من تحت.';
function sectionsMenu(D) { const rows = []; D.sections.forEach((s, i) => { if (i % 2 === 0) rows.push([]); rows[rows.length - 1].push(btn(s.t, 's:' + i)); }); rows.push([btn('المواعيد الجاية', 'd')]); return kb(rows); }
function questionsMenu(D, i) { const rows = D.sections[i].qa.map((x, j) => [btn(x.q, `q:${i}:${j}`)]); rows.push([btn('رجوع للأقسام', 'g')]); return kb(rows); }
function answerText(D, i, j) {
  const x = D.sections[i].qa[j]; let src = '';
  if (x.s) { const p = x.s.split(':'); const S = D.src[p[0]]; if (S) src = `\n\n<i>المصدر: <a href="${esc(S.u)}">${esc(S.t)}</a>${p[1] ? '، المادة ' + esc(p[1]) : ''}</i>`; }
  return `<b>${esc(x.q)}</b>\n\n${x.a}${src}`;
}
const answerKb = (D, i, j) => kb([[url('افتحه في دليل الطالب', D.sections[i].qa[j].link), btn('أسئلة قريبة', 's:' + i)]]);
const GREET = /^(السلام عليكم|سلام عليكم|السلام|سلام|هلا|اهلا|هلا والله|مرحبا|هاي|صباح الخير|مساء الخير|الو)( .{0,20})?$/;
const SEU_INTERN = 'https://t.me/SEUintern';
const TOOL_GROUPS = [
  ['خطّط', [['الخطط الدراسية', '/plans.html'], ['الجدول الدراسي', '/schedule.html'], ['وش أسجل الفصل الجاي؟', '/next-term.html'], ['التقويم الأكاديمي', '/calendar.html']]],
  ['ذاكر', [['خطة المذاكرة', '/study.html'], ['اختبر نفسك', '/quiz.html'], ['الشروحات', '/lessons.html'], ['المقررات', '/courses.html'], ['حاسبة المعدل', '/gpa.html']]],
  ['اعرف', [['دليل الطالب', '/guide.html'], ['تقييم الدكاترة', '/ratings.html'], ['فرص التدريب التعاوني', '/coop.html#opp'], ['دليل التدريب التعاوني', '/coop.html#guide'], ['المتجر', '/store.html']]]
];
const TOOLS_TXT = '🧰 <b>أدوات أكاديمية نجد</b>\nاختر الأداة وتفتح لك في الموقع:\n\n' + TOOL_GROUPS.map(([g, l]) => '<b>' + g + ':</b> ' + l.map((x) => x[0]).join('، ')).join('\n');
function toolsMenu(D) { const rows = []; for (const [, l] of TOOL_GROUPS) for (let i = 0; i < l.length; i += 2) rows.push(l.slice(i, i + 2).map(([t, path]) => url(t, D.site + path))); return kb(rows); }
const COOP_KB = (D) => kb([[url('دليل التدريب التعاوني', D.site + '/coop.html#guide'), url('فرص التدريب', D.site + '/coop.html#opp')], [url('قروب التدريب التعاوني (للأسئلة)', SEU_INTERN)]]);
const TOOLS = [
  [/(احسب|حساب|اعرف|حاسبه).{0,12}معدل|معدل.{0,12}(احسب|حساب|حاسبه)/, 'حاسبة المعدل في موقعنا تحسب معدلك الفصلي والتراكمي، وتعرف كم تحتاج عشان توصل هدفك.', 'افتح حاسبة المعدل', '/gpa.html'],
  [/(اسوي|اصمم|ارتب|اسو|تصميم|ترتيب).{0,12}جدول/, 'تقدر تصمم جدولك الدراسي في موقعنا وتحمّله صورة أو PDF.', 'افتح الجدول الدراسي', '/schedule.html'],
  [/(خطتي|الخطه الدراسيه|خطه التخصص|المقررات الباقيه|كم باقي لي)/, 'خطتك الدراسية كاملة في موقعنا: تعلّم على اللي خلصته، وتشوف كم باقي لك على التخرج.', 'افتح الخطط الدراسية', '/plans.html'],
  [/(اختبار تجريبي|اختبارات تجريبيه|كويز|اختبر نفسي|بنك اسئله)/, 'اختبر نفسك في موقعنا: اختبارات تتصحح على طول، ودفتر لأخطائك عشان تراجعها.', 'افتح اختبر نفسك', '/quiz.html'],
  [/(الشروحات|شروحات|شرح ماده|شرح مقرر)/, 'الشروحات في موقعنا: فيديو وملفات PDF لكل مقرر.', 'افتح الشروحات', '/lessons.html'],
  [/(وش اسجل|ايش اسجل|وش انزل|مواد الفصل الجاي|الفصل الجاي)/, 'أداة «وش أسجل الفصل الجاي؟» تقترح لك المقررات حسب خطتك والمتطلبات.', 'افتح وش أسجل الفصل الجاي؟', '/next-term.html'],
  [/(خطه مذاكره|ارتب مذاكرتي|جدول مذاكره|تنظيم المذاكره)/, 'خطة المذاكرة في موقعنا ترتب لك مذاكرتك حسب اختباراتك.', 'افتح خطة المذاكرة', '/study.html'],
  [/(اقيم دكتور|تقييم دكتور|تقييم الدكاتره|رايكم بالدكتور|رايكم في الدكتور|وش رايكم بدكتور)/, 'تقييم الدكاترة في موقعنا: تجارب الطلاب مع كل دكتور، وتقدر تضيف تجربتك.', 'افتح تقييم الدكاترة', '/ratings.html'],
  [/(وصف مقرر|وصف الماده|وصف ماده)/, 'وصف كل مقرر وتجارب الطلاب فيه تلقاها في صفحة المقررات.', 'افتح المقررات', '/courses.html'],
  [/(المتجر)/, 'متجر أكاديمية نجد:', 'افتح المتجر', '/store.html']
];
/* ---------- قائمة الردود (tools/bot-topics.js ← bot.json) ---------- */
const MENU_CALL = /^(يا ?|ي )?نجد$/;
const MENU_WORDS = new Set(['قائمه الردود', 'الردود', 'القائمه']);
const isMenuCall = (text) => { const n = norm(text); return MENU_CALL.test(n) || MENU_WORDS.has(n); };
const SOON = 'هذا الرد قريبًا ✨ نجهّز معلومته. لين ذاك تقدر تسأل في القروب العام: https://t.me/najdacadmey';
function rows2(list) { const r = []; list.forEach((b, i) => { if (i % 2 === 0) r.push([]); r[r.length - 1].push(b); }); return r; }
function replyMenu(D) {
  const M = D.menu; if (!M) return kb([[btn('دليل الطالب', 'g'), btn('المواعيد الجاية', 'd')]]);
  return kb(rows2(M.cats.map((c, i) => btn(c.t, 'mc:' + i))).concat([[btn('📘 دليل الطالب', 'g'), btn('🧰 أدوات نجد', 't')]]));
}
const MENU_HI = 'سمّ لبيه 🌿\nوش تبي تعرف؟ اختر القسم:';
function catMenu(D, i) {
  const c = D.menu.cats[i]; const list = D.menu.topics.filter((t) => t.cat === c.id);
  return { text: `<b>${esc(c.t)}</b>\nاختر الموضوع:`, kb: kb(rows2(list.map((t) => btn(t.t, 'mt:' + t.id))).concat([[btn('→ رجوع للأقسام', 'm')]])) };
}
let TOPIC_IDX = null, TOPIC_FOR = null;
function findTopic(D, text) {
  if (!D.menu) return null;
  if (TOPIC_FOR !== D) { TOPIC_IDX = new Map(); for (const t of D.menu.topics) for (const w of [t.t].concat(t.k || [])) TOPIC_IDX.set(norm(w), t); TOPIC_FOR = D; }
  const n = norm(text); return TOPIC_IDX.get(n) || TOPIC_IDX.get(n.replace(/^(ال)/, '')) || null;
}
function calFor(D, re, nx) {
  const t = today(); const R = new RegExp(re), X = nx ? new RegExp(nx) : null;
  const list = D.cal.items.filter((x) => R.test(x.t) && !(X && X.test(x.t)) && (x.e || x.d) >= t).slice(0, 3);
  if (!list.length) return 'ما فيه مواعيد جاية لهذا في التقويم الحالي. نضيف تقويم السنة الجاية أول ما تنشره الجامعة.';
  return list.map((x) => line(x, t)).join('\n');
}
/* رقم الأسبوع الدراسي: من بداية الدراسة في التقويم، والأسبوع من الأحد للسبت */
function weekText(D) {
  const t = today(); const items = D.cal.items;
  const start = items.filter((x) => /بداية الدراسة/.test(x.t) && x.d <= t).sort((a, b) => (a.d < b.d ? 1 : -1))[0];
  const fin = items.filter((x) => /الاختبارات النهائية/.test(x.t) && !/السنة الأولى/.test(x.t) && x.d >= (start ? start.d : t)).sort((a, b) => (a.d < b.d ? -1 : 1))[0];
  if (!start || (fin && (fin.e || fin.d) < t)) return 'الفصل الدراسي ما بدأ للحين. ' + (items.find((x) => /بداية الدراسة/.test(x.t) && x.d > t) ? `يبدأ ${fmt(items.find((x) => /بداية الدراسة/.test(x.t) && x.d > t).d)}.` : '');
  const n = Math.floor(days(start.d, t) / 7) + 1;
  const ws = new Date(D2(start.d).getTime() + (n - 1) * 7 * 864e5).toISOString().slice(0, 10), we = new Date(D2(ws).getTime() + 6 * 864e5).toISOString().slice(0, 10);
  let s = `📆 <b>الحين الأسبوع ${n}</b>\nمن ${fmt(ws)} إلى ${fmt(we)}`;
  if (fin && fin.d > t) s += `\n⏳ باقي <b>${days(t, fin.d)} يوم</b> على الاختبارات النهائية (${fmt(fin.d)})`;
  else if (fin) s += '\n✍️ الحين فترة الاختبارات النهائية، بالتوفيق!';
  return s;
}
async function sendTopic(env, D, chat, t, rt) {
  const back = [btn('📋 قائمة الردود', 'm')];
  const links = (t.btns || []).map(([l, h]) => (h.startsWith('mt:') ? btn(l, h) : url(l, h))); const linkRows = links.length > 2 && links.every((b) => b.text.length < 22) ? rows2(links) : links.map((b) => [b]);
  if (t.type === 'week') return send(env, chat, weekText(D), { ...replyTo(rt), ...kb([[url('التقويم الأكاديمي كامل', D.calendar)], back]) });
  if (t.type === 'parts') return send(env, chat, t.text, { ...replyTo(rt), ...kb([t.parts.map((p, i) => btn(p[0], `mp:${t.id}:${i}`)), back]) });
  const calSrc = `\n\n<i>المصدر: التقويم الأكاديمي الرسمي ${esc(D.cal.year)}هـ.</i>`;
  if (t.type === 'video') return tg(env, 'sendVideo', { chat_id: chat, video: t.video, caption: t.cap, parse_mode: 'HTML', supports_streaming: true, ...replyTo(rt), ...kb([back]) });
  if (t.type === 'photo') return tg(env, 'sendPhoto', { chat_id: chat, photo: t.img, caption: t.cap, parse_mode: 'HTML', ...replyTo(rt), ...kb(linkRows.concat([back])) });
  if (t.type === 'text') return send(env, chat, t.text, { ...replyTo(rt), ...kb(linkRows.concat([back])) });
  if (t.type === 'tool') return send(env, chat, esc(t.msg), { ...replyTo(rt), ...kb([[url(t.label, D.site + t.path)], back]) });
  if (t.type === 'dates') return send(env, chat, datesText(D), { ...replyTo(rt), ...kb([[url('التقويم الأكاديمي كامل', D.calendar)], back]) });
  if (t.type === 'cal') return send(env, chat, `📅 <b>${esc(t.t)}</b>\n${t.note ? esc(t.note) + '\n' : ''}\n${calFor(D, t.cal, t.nx)}${calSrc}`, { ...replyTo(rt), ...kb([[url('التقويم الأكاديمي كامل', D.calendar)], back]) });
  if (t.type === 'guide') {
    const parts = t.g.map(([i, j]) => answerText(D, i, j)); let s = parts.join('\n\n— — —\n\n');
    if (t.cal) s += `\n\n📅 <b>المواعيد:</b>\n${calFor(D, t.cal, t.nx)}`;
    if (s.length > 3900) s = parts[0];
    const [i, j] = t.g[0];
    return send(env, chat, s, { ...replyTo(rt), ...kb([[url('التفاصيل في دليل الطالب', D.sections[i].qa[j].link)]].concat(t.tool ? [[url(t.tool[0], t.tool[1])]] : [], [back])) });
  }
  return send(env, chat, `<b>${esc(t.t)}</b>\n${SOON}`, { ...replyTo(rt), ...kb([back]) });
}
/* قائمة الردود للتثبيت: البوت يرسلها منسقة (عناوين عريضة، وأسماء الردود تنتسخ بضغطة) */
function listText(D) {
  if (!D.menu) return null;
  const parts = D.menu.cats.map((c) => { const l = D.menu.topics.filter((t) => t.cat === c.id && t.type !== 'soon'); return l.length ? `<b>${esc(c.t)}</b>\n` + l.map((t) => `▫️ <code>${esc(t.t)}</code>`).join('\n') : ''; }).filter(Boolean);
  return '<b>📋 قائمة ردود بوت نجد</b>\nاضغط على الرد ينتسخ، وأرسله في القروب، والبوت يجاوبك 🌿\n\n' + parts.join('\n\n') + '\n\n💡 أو اكتب «نجد» وتطلع لك كل الردود أزرار';
}
async function menuOrTopic(env, chat, text, rt) {
  if (!text) return false;
  if (isMenuCall(text)) { const D = await data(env); await send(env, chat, MENU_HI, { ...replyTo(rt), ...replyMenu(D) }); return true; }
  if (norm(text).split(' ').length > 5) return false;
  const D = await data(env); const t = findTopic(D, text); if (!t) return false;
  await sendTopic(env, D, chat, t, rt); return true;
}

async function answerQuestion(env, D, chat, text, rt) {
  const n = norm(text);
  if (GREET.test(n)) return send(env, chat, WELCOME, { ...replyTo(rt), ...HOME(false) });
  if (/(تدريب|التعاوني)/.test(n) && /(نموذج|نماذج|فورم|form|تقرير|تقارير|خطوات|دليل|تسجيل|توقيع|فرص)/.test(n)) return send(env, chat, '<b>التدريب التعاوني</b>\nالدليل خطوة بخطوة مع كل النماذج (التسجيل، والتقارير الدورية، والتقرير النهائي، ونماذج التقييم)، وفرص التدريب، وقروب الأسئلة:', { ...replyTo(rt), ...COOP_KB(D) });
  for (const [re, msg, label, path] of TOOLS) if (re.test(n)) return send(env, chat, msg, { ...replyTo(rt), ...kb([[url(label, D.site + path)]]) });
  const r = search(D, text); const g = r.guide[0], c = r.cal[0];
  const strongG = g && g.qs >= 1 && g.s >= Math.max(3, r.q.length * 1.5);
  const strongC = c && c.s >= Math.max(2, r.q.length * (r.calIntent ? 0.6 : 1));
  if (strongC && (r.calIntent || !strongG)) {
    const t = today(); const list = r.cal.slice(0, 3).map((x) => D.cal.items[x.k]).filter((x) => (x.e || x.d) >= t);
    const all = list.length ? list : r.cal.slice(0, 2).map((x) => D.cal.items[x.k]);
    const head = list.length ? '<b>المواعيد اللي تخص سؤالك:</b>' : '<b>هذا الموعد خلص في التقويم الحالي:</b>';
    return send(env, chat, head + '\n' + all.map((x) => line(x, t)).join('\n') + `\n\n<i>المصدر: التقويم الأكاديمي الرسمي ${esc(D.cal.year)}هـ.</i>`, { ...replyTo(rt), ...kb([[url('التقويم الأكاديمي كامل', D.calendar)]]) });
  }
  if (strongG) return send(env, chat, answerText(D, g.i, g.j), { ...replyTo(rt), ...answerKb(D, g.i, g.j) });
  const sug = r.guide.slice(0, 3); const rows = sug.map((x) => [btn(D.sections[x.i].qa[x.j].q, `q:${x.i}:${x.j}`)]);
  rows.push([btn('دليل الطالب', 'g'), url('افتح الدليل في الموقع', D.guide)]);
  return send(env, chat, 'ما لقيت جواب أكيد لسؤالك في دليل الطالب أو التقويم.' + (sug.length ? '\nيمكن تقصد واحد من هذي:' : '\nجرّب تكتبه بكلمات ثانية، أو تصفح الدليل:'), { ...replyTo(rt), ...kb(rows) });
}

/* ---------- ردودك الخاصة ---------- */
const getReplies = (env) => kvJson(env, 'replies', []);
function matchReply(list, text) {
  const n = norm(text); if (!n) return null; const pad = ' ' + n + ' '; const words = n.split(' ').map((w) => w.replace(PREFIX, ''));
  const sorted = list.slice().sort((a, b) => norm(b.k).length - norm(a.k).length);
  for (const r of sorted) {
    const k = norm(r.k); if (!k) continue;
    if (r.m === 'exact') { if (n === k) return r; continue; }
    if (pad.includes(' ' + k + ' ')) return r;
    if (!k.includes(' ') && words.includes(k.replace(PREFIX, ''))) return r;
  }
  return null;
}
function captureBody(msg) {
  const cap = { caption: msg.caption || undefined, caption_entities: msg.caption_entities || undefined };
  if (msg.photo) return { t: 'photo', f: msg.photo[msg.photo.length - 1].file_id, ...cap };
  for (const t of ['document', 'video', 'animation', 'audio', 'voice', 'sticker']) if (msg[t]) return { t, f: msg[t].file_id, ...(t === 'sticker' ? {} : cap) };
  if (msg.text) return { t: 'text', text: msg.text, entities: msg.entities || undefined };
  return null;
}
function sendBody(env, chat, b, rt) {
  const base = { chat_id: chat, ...replyTo(rt) };
  if (b.t === 'text') return tg(env, 'sendMessage', { ...base, text: b.text, entities: b.entities, link_preview_options: { is_disabled: true } });
  const M = { photo: 'sendPhoto', document: 'sendDocument', video: 'sendVideo', animation: 'sendAnimation', audio: 'sendAudio', voice: 'sendVoice', sticker: 'sendSticker' };
  return tg(env, M[b.t], { ...base, [b.t]: b.f, ...(b.t === 'sticker' ? {} : { caption: b.caption, caption_entities: b.caption_entities }) });
}

/* ---------- الحماية ---------- */
/* القائمة = الأساسية من الموقع (tools/bot-moderation.js) + كلماتك من /admin */
async function modData(env) { try { const D = await data(env); return D.mod || null; } catch (e) { return null; } }
async function baseLists(env) { const m = await modData(env); return m ? m.words : DEFAULT_BANNED; }
const customLists = (env) => kvJson(env, 'banned', {});
async function bannedLists(env) {
  const base = await baseLists(env), extra = await customLists(env), out = {};
  for (const c of new Set(Object.keys(base).concat(Object.keys(extra)))) out[c] = Array.from(new Set((base[c] || []).concat(extra[c] || [])));
  return out;
}
async function catInfo(env) { const m = await modData(env); const o = {}; for (const c of Object.keys(CATS)) o[c] = { t: CATS[c], act: c === 'ads' ? 'del' : 'ban' }; if (m) Object.assign(o, m.cats); return o; }
const domains = async (env) => (await kvJson(env, 'domains', null)) || DEFAULT_DOMAINS.slice();
/* تطبيع للرقابة: الحروف المزخرفة، والمتشابهة من لغات ثانية، والأرقام والرموز بدل الحروف الإنجليزية،
   والحروف المكررة، والحروف المفصولة بمسافات أو نقاط */
const HOMO = { 'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x', 'і': 'i', 'ј': 'j', 'ѕ': 's', 'к': 'k', 'м': 'm', 'т': 't', 'в': 'b', 'н': 'h', 'ԁ': 'd', 'ս': 'u', 'ο': 'o', 'α': 'a', 'ε': 'e', 'ι': 'i', 'κ': 'k', 'ν': 'v', 'τ': 't', 'υ': 'u', 'ρ': 'p', 'χ': 'x', 'ı': 'i' };
const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i', '|': 'l' };
function modForms(text) {
  let s = String(text).normalize('NFKC').replace(/[­​-‏‪-‮⁠-⁯﻿]/g, '').toLowerCase();
  s = s.replace(/./gu, (c) => HOMO[c] || c);
  // داخل الكلمات الإنجليزية بس: الأرقام والرموز بدل الحروف (sh!t، b1tch، a$$)
  s = s.replace(/[a-z0-9@$!|]+/g, (w) => (/[a-z]/.test(w) && /[0-9@$!|]/.test(w) ? w.replace(/[0134557@$!|]/g, (c) => LEET[c] || c) : w));
  const n = norm(s); const out = new Set([n]);
  const col = n.replace(/(.)\1{2,}/g, '$1'); out.add(col);
  for (const f of [n, col]) out.add(f.replace(/(^| )يا(?=[ء-ي]{2})/g, '$1يا ')); // «ياكلب» ← «يا كلب»
  // حروف مفصولة: «ك س» و«f u c k» ← كلمة وحدة
  for (const f of [n, col]) out.add(f.split(' ').reduce((acc, w) => { const last = acc[acc.length - 1]; if (w.length === 1 && last && last.single) { last.w += w; } else acc.push({ w, single: w.length === 1 }); return acc; }, []).map((x) => x.w).join(' '));
  return [...out].filter(Boolean);
}
const MOD_PREFIX = /^(يا|وال|بال|فال|كال|لل|ال|و|ف|ب)(?=..)/;
function findBanned(lists, text) {
  const forms = modForms(text); if (!forms.length) return null;
  const pads = forms.map((f) => ' ' + f + ' ');
  const words = new Set(forms.flatMap((f) => f.split(' ').flatMap((w) => [w, w.replace(MOD_PREFIX, '')])));
  for (const cat of Object.keys(lists)) for (const raw of lists[cat]) {
    const k = norm(raw); if (!k) continue;
    if (k.includes(' ')) { if (pads.some((p) => p.includes(' ' + k + ' '))) return { cat, w: raw }; }
    else if (words.has(k)) return { cat, w: raw };
  }
  return null;
}
function urlsOf(msg) {
  const text = msg.text || msg.caption || ''; const ents = msg.entities || msg.caption_entities || []; const out = [];
  for (const e of ents) {
    if (e.type === 'text_link') out.push(e.url);
    if (e.type === 'url') out.push(text.substr(e.offset, e.length));
  }
  const t = text.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  (t.match(/(?:https?:\/\/|www\.)[^\s]+/gi) || []).forEach((u) => out.push(u));
  (t.match(/\b(?:[a-z0-9-]+\.)+(?:com|net|org|sa|me|io|co|info|xyz|link|ly|gg|app|site|online|store|shop|tk|ml|ru|tv|us|uk|edu|top|click|biz|cc)(?:\/[^\s]*)?/gi) || []).forEach((u) => out.push(u));
  return out;
}
function allowedUrl(u, allow) {
  const s = String(u).toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  return allow.some((d) => { d = d.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''); return d.includes('/') ? s.startsWith(d) : (s === d || s.startsWith(d + '/') || s.split('/')[0].endsWith('.' + d) || s.split('/')[0] === d); });
}
function hasPhone(msg) {
  if ((msg.entities || msg.caption_entities || []).some((e) => e.type === 'phone_number')) return true;
  const t = (msg.text || msg.caption || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const c = t.replace(/(\d)[\s\-.()]+(?=\d)/g, '$1');
  return /(?:\+|00)?9665\d{8}|(?:^|\D)05\d{8}(?:\D|$)/.test(c) || /\d{10,}/.test(c);
}
async function groupAdmins(env, chatId) {
  const key = 'adm:' + chatId; const c = await kvJson(env, key, null); if (c) return c;
  const r = await tg(env, 'getChatAdministrators', { chat_id: chatId }); const ids = r && r.ok ? r.result.map((m) => m.user.id) : [];
  await kvPut(env, key, ids, 3600); return ids;
}
async function notice(env, ctx, chat, text) {
  const r = await send(env, chat, text);
  if (r && r.ok && ctx && ctx.waitUntil) ctx.waitUntil(new Promise((res) => setTimeout(res, NOTICE_MS)).then(() => tg(env, 'deleteMessage', { chat_id: chat, message_id: r.result.message_id })));
}
async function moderate(env, ctx, msg) {
  const chat = msg.chat; const from = msg.sender_chat && msg.sender_chat.id !== chat.id ? { id: msg.sender_chat.id, first_name: msg.sender_chat.title } : (msg.from || {});
  if (msg.sender_chat && (msg.sender_chat.id === chat.id || msg.is_automatic_forward)) return false; // مشرف مخفي أو قناة القروب
  if (isAdmin(env, from.id) || (await groupAdmins(env, chat.id)).includes(from.id)) return false;
  const text = [msg.text, msg.caption, msg.forward_origin && msg.forward_origin.chat && msg.forward_origin.chat.title].filter(Boolean).join(' \n ');
  const bad = findBanned(await bannedLists(env), text);
  const CI = bad ? await catInfo(env) : null;
  if (bad && CI[bad.cat] && CI[bad.cat].act === 'del') {
    const del = await tg(env, 'deleteMessage', { chat_id: chat.id, message_id: msg.message_id });
    if (del && del.ok) await notice(env, ctx, chat.id, `⚠️ ${who(from)}، انحذفت رسالتك: ${CI[bad.cat].t} ممنوعة في القروب.`);
    return true;
  }
  if (bad) {
    await tg(env, 'deleteMessage', { chat_id: chat.id, message_id: msg.message_id });
    const asChannel = msg.sender_chat && msg.sender_chat.id !== chat.id; // كتب باسم قناة
    const ban = asChannel ? await tg(env, 'banChatSenderChat', { chat_id: chat.id, sender_chat_id: msg.sender_chat.id }) : await tg(env, 'banChatMember', { chat_id: chat.id, user_id: from.id, revoke_messages: true });
    await notice(env, ctx, chat.id, ban && ban.ok ? `🚫 انطرد ${who(from)}: ${(CI[bad.cat] || {}).t || 'مخالفة'}.` : `🚫 انحذفت رسالة ${who(from)}: ${(CI[bad.cat] || {}).t || 'مخالفة'}.`);
    const preview = esc(text.slice(0, 300));
    for (const a of admins(env)) await send(env, a, `${ban && ban.ok ? '🚫 طردت' : '⚠️ حذفت رسالة'} ${who(from)}${from.username ? ' (@' + esc(from.username) + ')' : ''} من «${esc(chat.title || '')}»\nالسبب: ${(CI[bad.cat] || {}).t || bad.cat} (الكلمة: «${esc(bad.w)}»)\nالرسالة: «${preview}»` + (ban && ban.ok ? '' : '\n\nما قدرت أطرده. تأكد إن البوت مشرف وعنده صلاحية حظر الأعضاء.'), ban && ban.ok ? kb([[btn('فك الطرد', asChannel ? `uc:${chat.id}:${msg.sender_chat.id}` : `ub:${chat.id}:${from.id}`)]]) : {});
    return true;
  }
  const allow = await domains(env); const links = urlsOf(msg).filter((u) => !allowedUrl(u, allow));
  if (links.length || hasPhone(msg)) {
    const del = await tg(env, 'deleteMessage', { chat_id: chat.id, message_id: msg.message_id });
    if (del && del.ok) await notice(env, ctx, chat.id, `🔗 ${who(from)}، الروابط وأرقام الجوالات ممنوعة في القروب، فانحذفت رسالتك.`);
    return true;
  }
  return false;
}

/* ---------- القروبات والقنوات اللي فيها البوت ---------- */
const chats = (env) => kvJson(env, 'chats', {});
async function trackChat(env, chat, on) {
  if (!chat || chat.type === 'private') return;
  const c = await chats(env); const id = String(chat.id); const old = c[id]; const t = chat.title || chat.username || id;
  if (on) c[id] = { t, type: chat.type }; else delete c[id];
  if (on !== !!old || (on && old && old.t !== t)) await kvPut(env, 'chats', c);
}
const chatList = (c) => Object.entries(c).sort((a, b) => a[1].t.localeCompare(b[1].t, 'ar'));

/* ---------- النشر ---------- */
const draftKey = (admin, id) => `draft:${admin}:${id}`;
function pickerKb(list, d, id) {
  const rows = []; list.forEach(([cid, x], n) => { if (n % 2 === 0) rows.push([]); rows[rows.length - 1].push(btn((d.sel.includes(cid) ? '✓ ' : '') + x.t, `pt:${id}:${cid}`)); });
  rows.push([btn(d.sel.length === list.length && list.length ? 'شيل الكل' : 'الكل', `pa:${id}`)]);
  rows.push([btn('انشر', `pp:${id}`), btn('إلغاء', `px:${id}`)]);
  if (d.text) rows.push([btn('لا، هذا سؤال: جاوبني', `pq:${id}`)]);
  return kb(rows);
}
async function startDraft(env, msg) {
  const list = chatList(await chats(env));
  if (!list.length) return send(env, msg.chat.id, 'البوت مو مضاف في أي قروب أو قناة للحين. أضفه مشرف في القروبات والقنوات، وبعدها أرسل الإعلان مرة ثانية.\n\n(لوحة البوت: /admin)');
  const id = Math.random().toString(36).slice(2, 8);
  const d = { from: msg.chat.id, mid: msg.message_id, sel: [], text: msg.text ? msg.text.slice(0, 500) : '' };
  await kvPut(env, draftKey(msg.from.id, id), d, 86400);
  return send(env, msg.chat.id, 'وين أنشره؟ اختر القروبات والقنوات، وبعدين اضغط «انشر».', { ...replyTo(msg.message_id), ...pickerKb(list, d, id) });
}

/* ---------- لوحة البوت (للمشرفين، في الخاص) ---------- */
const stateKey = (id) => 'st:' + id;
const MENU = () => kb([[btn('أضف رد', 'a:ra'), btn('الردود', 'a:rl')], [btn('أضف كلمة ممنوعة', 'a:wa'), btn('الكلمات الممنوعة', 'a:wl')], [btn('المواقع المسموحة', 'a:dl'), btn('القروبات', 'a:ch')]]);
const MENU_TXT = '<b>لوحة البوت</b>\n• <b>الردود</b>: كلمة يرد عليها البوت بردك، في الخاص والقروبات.\n• <b>الكلمات الممنوعة</b>: اللي يكتبها ينحذف ويطرد من القروب.\n• <b>المواقع المسموحة</b>: روابطها ما تنحذف.\n\nولنشر إعلان: أرسل الإعلان هنا مباشرة.';
const CANCEL = kb([[btn('إلغاء', 'a:x')]]);
async function adminState(env, msg, st) {
  const chat = msg.chat.id, uid = msg.from.id; const text = (msg.text || '').trim();
  if (st.s === 'rk') {
    if (!text) return send(env, chat, 'اكتب الكلمة نص.', CANCEL);
    await kvPut(env, stateKey(uid), { s: 'rb', k: text.slice(0, 60) }, 3600);
    return send(env, chat, `الكلمة: «${esc(text.slice(0, 60))}»\nالحين أرسل الرد: نص، أو صورة، أو ملف، أو فيديو.`, CANCEL);
  }
  if (st.s === 'rb') {
    const b = captureBody(msg); if (!b) return send(env, chat, 'هذا النوع ما أقدر أحفظه. أرسل نص أو صورة أو ملف أو فيديو.', CANCEL);
    await kvPut(env, stateKey(uid), { s: 'rm', k: st.k, b }, 3600);
    return send(env, chat, 'متى يرد البوت؟', kb([[btn('لو الرسالة فيها الكلمة', 'rm:c')], [btn('لو الرسالة هي الكلمة بالضبط', 'rm:e')], [btn('إلغاء', 'a:x')]]));
  }
  if (st.s === 'w') {
    const words = text.split(/[\n،,]+/).map((w) => w.trim()).filter((w) => w && norm(w)).slice(0, 50);
    if (!words.length) return send(env, chat, 'اكتب كلمة أو أكثر، كل كلمة في سطر.', CANCEL);
    const L = await customLists(env); L[st.c] = Array.from(new Set((L[st.c] || []).concat(words))); await kvPut(env, 'banned', L);
    await env.BOT_KV.delete(stateKey(uid)); const CI = await catInfo(env);
    return send(env, chat, `انضافت ${words.length} في «${(CI[st.c] || {}).t || st.c}»: ${words.map((w) => '«' + esc(w) + '»').join('، ')}`, MENU());
  }
  if (st.s === 'd') {
    const d = text.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
    if (!/^[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/.test(d)) return send(env, chat, 'اكتب الموقع مثل: example.com', CANCEL);
    const L = await domains(env); if (!L.includes(d)) L.push(d); await kvPut(env, 'domains', L); await env.BOT_KV.delete(stateKey(uid));
    return send(env, chat, `انضاف «${esc(d)}» للمواقع المسموحة.`, MENU());
  }
}
async function adminCallback(env, cb, p, done) {
  const chat = cb.message.chat.id, mid = cb.message.message_id, uid = cb.from.id;
  const k = p[0], a = p[1];
  if (k === 'a' && a === 'menu') { await done(); return send(env, chat, MENU_TXT, MENU()); }
  if (k === 'a' && a === 'x') { await env.BOT_KV.delete(stateKey(uid)); await done('انلغى'); return edit(env, chat, mid, 'انلغى.', MENU()); }
  if (k === 'a' && a === 'ra') { await kvPut(env, stateKey(uid), { s: 'rk' }, 3600); await done(); return send(env, chat, 'اكتب الكلمة اللي يرد عليها البوت (مثل: الاشتراك).', CANCEL); }
  if (k === 'rm') {
    const st = await kvJson(env, stateKey(uid), null); if (!st || st.s !== 'rm') { await done('انتهت المهلة'); return; }
    const list = await getReplies(env); list.push({ id: Math.random().toString(36).slice(2, 8), k: st.k, m: a === 'e' ? 'exact' : 'contains', b: st.b });
    await kvPut(env, 'replies', list); await env.BOT_KV.delete(stateKey(uid)); await done('انحفظ');
    return edit(env, chat, mid, `انحفظ الرد على «${esc(st.k)}» (${a === 'e' ? 'لو الرسالة هي الكلمة بالضبط' : 'لو الرسالة فيها الكلمة'}).`, MENU());
  }
  if (k === 'a' && a === 'rl') {
    const list = await getReplies(env); await done();
    if (!list.length) return send(env, chat, 'ما فيه ردود للحين.', kb([[btn('أضف رد', 'a:ra')]]));
    return send(env, chat, `<b>الردود (${list.length})</b>\nاضغط على أي رد عشان تحذفه:`, kb(list.map((r) => [btn('🗑 ' + r.k + (r.m === 'exact' ? ' (بالضبط)' : ''), 'rd:' + r.id)]).concat([[btn('أضف رد', 'a:ra')]])));
  }
  if (k === 'rd') {
    const list = (await getReplies(env)).filter((r) => r.id !== a); await kvPut(env, 'replies', list); await done('انحذف');
    return edit(env, chat, mid, `<b>الردود (${list.length})</b>\nاضغط على أي رد عشان تحذفه:`, kb(list.map((r) => [btn('🗑 ' + r.k + (r.m === 'exact' ? ' (بالضبط)' : ''), 'rd:' + r.id)]).concat([[btn('أضف رد', 'a:ra')]])));
  }
  const ACT = { ban: 'حذف وطرد', del: 'حذف بس' };
  if (k === 'a' && a === 'wa') { const CI = await catInfo(env); await done(); return send(env, chat, 'اختر نوعها:', kb(Object.keys(CI).map((c) => [btn(`${CI[c].t} (${ACT[CI[c].act]})`, 'wc:' + c)]).concat([[btn('إلغاء', 'a:x')]]))); }
  if (k === 'wc') { const CI = await catInfo(env); await kvPut(env, stateKey(uid), { s: 'w', c: a }, 3600); await done(); return edit(env, chat, mid, `اكتب الكلمات الممنوعة في «${(CI[a] || {}).t || a}»، كل كلمة أو جملة في سطر.`, CANCEL); }
  if (k === 'a' && a === 'wl') { const L = await bannedLists(env), CI = await catInfo(env); await done(); return send(env, chat, '<b>الكلمات الممنوعة</b>\nاختر القسم:', kb(Object.keys(CI).map((c) => [btn(`${CI[c].t} (${(L[c] || []).length})`, 'wl:' + c)]).concat([[btn('أضف كلمة ممنوعة', 'a:wa')]]))); }
  if (k === 'wl' || k === 'wd') {
    // الأزرار لكلماتك اللي أضفتها من هنا بس؛ الأساسية تتعدل من ملف الموقع (tools/bot-moderation.js)
    const base = await baseLists(env), C = await customLists(env), CI = await catInfo(env);
    const own = (C[a] || []).filter((w) => !(base[a] || []).includes(w));
    if (k === 'wd') { const w = own[+p[2]]; C[a] = (C[a] || []).filter((x) => x !== w); await kvPut(env, 'banned', C); own.splice(+p[2], 1); }
    await done(k === 'wd' ? 'انحذفت' : undefined);
    const nb = (base[a] || []).length;
    return edit(env, chat, mid, `<b>${(CI[a] || {}).t || a}</b> (${ACT[(CI[a] || {}).act] || 'حذف وطرد'})\n${nb} كلمة أساسية، وتعديلها يكون من ملف الموقع.\n${own.length ? 'كلماتك: اضغط على أي كلمة عشان تحذفها:' : 'ما أضفت كلمات هنا.'}`, kb(own.slice(0, 80).map((w, n) => [btn('🗑 ' + w, `wd:${a}:${n}`)]).concat([[btn('رجوع', 'a:wl')]])));
  }
  if (k === 'a' && a === 'dl') { const L = await domains(env); await done(); return send(env, chat, '<b>المواقع المسموحة</b>\nروابطها ما تنحذف من القروبات. اضغط على أي موقع عشان تحذفه:', kb(L.map((d, n) => [btn('🗑 ' + d, 'dd:' + n)]).concat([[btn('أضف موقع', 'a:da')]]))); }
  if (k === 'a' && a === 'da') { await kvPut(env, stateKey(uid), { s: 'd' }, 3600); await done(); return send(env, chat, 'اكتب الموقع المسموح (مثل: youtube.com):', CANCEL); }
  if (k === 'dd') { const L = (await domains(env)).filter((_, n) => n !== +a); await kvPut(env, 'domains', L); await done('انحذف'); return edit(env, chat, mid, '<b>المواقع المسموحة</b>\nاضغط على أي موقع عشان تحذفه:', kb(L.map((d, n) => [btn('🗑 ' + d, 'dd:' + n)]).concat([[btn('أضف موقع', 'a:da')]]))); }
  if (k === 'a' && a === 'ch') { const l = chatList(await chats(env)); await done(); return send(env, chat, l.length ? '<b>القروبات والقنوات اللي فيها البوت:</b>\n' + l.map(([, x]) => '• ' + esc(x.t)).join('\n') : 'البوت مو مضاف في أي قروب أو قناة للحين.'); }
  if (k === 'ub' || k === 'uc') {
    const r = k === 'uc' ? await tg(env, 'unbanChatSenderChat', { chat_id: a, sender_chat_id: +p[2] }) : await tg(env, 'unbanChatMember', { chat_id: a, user_id: +p[2], only_if_banned: true }); await done(r && r.ok ? 'انفك الطرد' : 'ما قدرت');
    return edit(env, chat, mid, cb.message.text + (r && r.ok ? '\n\n✓ انفك الطرد، ويقدر يرجع للقروب.' : '\n\nما قدرت أفك الطرد.'));
  }
  await done();
}

/* ---------- استقبال تحديثات تيليقرام ---------- */
async function onMessage(env, ctx, msg, edited) {
  const chat = msg.chat; const priv = chat.type === 'private';
  if (msg.new_chat_members || msg.left_chat_member) return;
  const text = (msg.text || msg.caption || '').trim();
  if (!priv) await trackChat(env, chat, true);
  if (chat.type === 'channel') return;
  if (!priv && (await moderate(env, ctx, msg))) return;
  if (edited) return;
  const name = botName(env); const cmd = text.match(/^\/([a-z_]+)(?:@(\w+))?/i) || [];
  if (cmd[1] && cmd[2] && cmd[2].toLowerCase() !== name.toLowerCase()) return; // أمر لبوت ثاني
  const c = (cmd[1] || '').toLowerCase(); const admin = priv && isAdmin(env, msg.from.id);
  if (c === 'start' || c === 'help') return send(env, chat.id, WELCOME, HOME(admin));
  if (c === 'myid' && priv) return send(env, chat.id, `رقم حسابك في تيليقرام: <code>${msg.from.id}</code>`);
  if (c === 'admin' && admin) { await env.BOT_KV.delete(stateKey(msg.from.id)); return send(env, chat.id, MENU_TXT, MENU()); }
  if (c === 'guide') return send(env, chat.id, '<b>دليل الطالب</b>\nاختر القسم:', sectionsMenu(await data(env)));
  if (c === 'tools') return send(env, chat.id, TOOLS_TXT, toolsMenu(await data(env)));
  if (c === 'list') {
    // في القروب: للمشرفين بس، والبوت يحاول يثبتها (يحتاج صلاحية تثبيت الرسائل)
    if (!priv && !(isAdmin(env, msg.from.id) || (await groupAdmins(env, chat.id)).includes(msg.from.id))) return;
    const t = listText(await data(env)); if (!t) return;
    const r = await send(env, chat.id, t);
    if (!priv && r && r.ok) { await tg(env, 'deleteMessage', { chat_id: chat.id, message_id: msg.message_id }); await tg(env, 'pinChatMessage', { chat_id: chat.id, message_id: r.result.message_id, disable_notification: true }); }
    return;
  }
  if (c === 'dates') { const D = await data(env); return send(env, chat.id, datesText(D), kb([[url('التقويم الأكاديمي كامل', D.calendar)]])); }
  if (admin && !c) {
    const st = await kvJson(env, stateKey(msg.from.id), null); if (st) return adminState(env, msg, st);
    // shortcut: رسالة قصيرة (٥ كلمات أو أقل) فيها كلمة رد = سؤال مو إعلان؛ الأطول تروح مسودة إعلان
    const r = msg.text && norm(msg.text).split(' ').length <= 5 ? matchReply(await getReplies(env), msg.text) : null;
    if (r) return sendBody(env, chat.id, r.b, null);
    if (msg.text && (await menuOrTopic(env, chat.id, msg.text, null))) return;
    return startDraft(env, msg);
  }
  // ردودك الخاصة: أي رسالة فيها الكلمة (خاص وقروبات)
  const rep = text && !c ? matchReply(await getReplies(env), text.replace(new RegExp('@' + name, 'ig'), '')) : null;
  if (rep) return sendBody(env, chat.id, rep.b, priv ? null : msg.message_id);
  if (!c && (await menuOrTopic(env, chat.id, text.replace(new RegExp('@' + name, 'ig'), '').trim(), priv ? null : msg.message_id))) return;
  if (!priv) {
    const mentioned = new RegExp('@' + name + '\\b', 'i').test(text);
    const r = msg.reply_to_message && msg.reply_to_message.from; const replied = r && r.username && r.username.toLowerCase() === name.toLowerCase();
    if (!c && !mentioned && !replied) return; // في القروب: نرد على الأسئلة بس لما ينادونا
  }
  const q = text.replace(new RegExp('@' + name, 'ig'), '').replace(/^\/[a-z_]+(@\w+)?/i, '').trim();
  if (!q) return send(env, chat.id, WELCOME, { ...HOME(false), ...(priv ? {} : replyTo(msg.message_id)) });
  return answerQuestion(env, await data(env), chat.id, q, priv ? null : msg.message_id);
}

async function onCallback(env, cb) {
  const m = cb.message; if (!m) return; const chat = m.chat.id, mid = m.message_id; const p = (cb.data || '').split(':');
  const done = (text) => tg(env, 'answerCallbackQuery', { callback_query_id: cb.id, ...(text ? { text } : {}) });
  if (['a', 'rm', 'rd', 'wc', 'wl', 'wd', 'dd', 'ub', 'uc'].includes(p[0])) { if (!isAdmin(env, cb.from.id)) return done('هذا للمشرفين بس'); return adminCallback(env, cb, p, done); }
  if (['pt', 'pa', 'pp', 'px', 'pq'].includes(p[0])) {
    if (!isAdmin(env, cb.from.id)) return done('هذا للمشرفين بس');
    const id = p[1]; const d = await kvJson(env, draftKey(cb.from.id, id), null);
    if (!d) { await done('انتهت صلاحية الإعلان'); return edit(env, chat, mid, 'انتهت صلاحية هذا الإعلان. أرسله مرة ثانية.'); }
    const list = chatList(await chats(env));
    if (p[0] === 'pt') { const cid = p.slice(2).join(':'); d.sel = d.sel.includes(cid) ? d.sel.filter((x) => x !== cid) : d.sel.concat(cid); }
    if (p[0] === 'pa') d.sel = d.sel.length === list.length ? [] : list.map(([cid]) => cid);
    if (p[0] === 'px') { await env.BOT_KV.delete(draftKey(cb.from.id, id)); await done('انلغى'); return edit(env, chat, mid, 'انلغى الإعلان، ما انتشر في أي مكان.'); }
    if (p[0] === 'pq') {
      await env.BOT_KV.delete(draftKey(cb.from.id, id)); await done(); await edit(env, chat, mid, 'تمام، هذا الجواب:');
      const rep = matchReply(await getReplies(env), d.text); if (rep) return sendBody(env, chat, rep.b, null);
      return answerQuestion(env, await data(env), chat, d.text, null);
    }
    if (p[0] === 'pp') {
      if (!d.sel.length) return done('اختر قروب أو قناة على الأقل');
      await done('جاري النشر…'); const ok = [], bad = [];
      for (const cid of d.sel) { const r = await tg(env, 'copyMessage', { chat_id: cid, from_chat_id: d.from, message_id: d.mid }); const t = ((list.find(([x]) => x === cid) || [])[1] || { t: cid }).t; (r && r.ok ? ok : bad).push(t); }
      await env.BOT_KV.delete(draftKey(cb.from.id, id));
      let s = ok.length ? 'انتشر في: ' + ok.map(esc).join('، ') + '.' : '';
      if (bad.length) s += (s ? '\n' : '') + 'ما قدرت أنشر في: ' + bad.map(esc).join('، ') + '. تأكد إن البوت مشرف وعنده صلاحية النشر.';
      return edit(env, chat, mid, s);
    }
    await kvPut(env, draftKey(cb.from.id, id), d, 86400); await done();
    return tg(env, 'editMessageReplyMarkup', { chat_id: chat, message_id: mid, ...pickerKb(list, d, id) });
  }
  const D = await data(env); await done();
  if (p[0] === 'g') return edit(env, chat, mid, '<b>دليل الطالب</b>\nاختر القسم:', sectionsMenu(D));
  // «رجوع» من قائمة قسم: نرجع نفس الرسالة للأقسام، وغيرها نرسل القائمة من جديد
  if (p[0] === 'm') return m.reply_markup && JSON.stringify(m.reply_markup).includes('"mt:') ? edit(env, chat, mid, MENU_HI, replyMenu(D)) : send(env, chat, MENU_HI, replyMenu(D));
  if (p[0] === 'mc') { if (!D.menu || !D.menu.cats[+p[1]]) return; const c = catMenu(D, +p[1]); return edit(env, chat, mid, c.text, c.kb); }
  if (p[0] === 'mp') { const t = D.menu && D.menu.topics.find((x) => x.id === p[1]); const part = t && t.parts && t.parts[+p[2]]; if (!part) return; return send(env, chat, part[1], kb([[btn('📋 قائمة الردود', 'm')]])); }
  if (p[0] === 'mt') { const t = D.menu && D.menu.topics.find((x) => x.id === p[1]); if (!t) return; return sendTopic(env, D, chat, t, null); }
  if (p[0] === 't') return send(env, chat, TOOLS_TXT, toolsMenu(D));
  if (p[0] === 'd') return send(env, chat, datesText(D), kb([[url('التقويم الأكاديمي كامل', D.calendar)]]));
  if (p[0] === 's') { const i = +p[1]; const s = D.sections[i]; if (!s) return; return edit(env, chat, mid, `<b>${esc(s.t)}</b>${s.sub ? '\n' + esc(s.sub) : ''}\nاختر سؤالك:`, questionsMenu(D, i)); }
  if (p[0] === 'q') { const i = +p[1], j = +p[2]; if (!D.sections[i] || !D.sections[i].qa[j]) return; return send(env, chat, answerText(D, i, j), answerKb(D, i, j)); }
}

async function onUpdate(env, ctx, u) {
  if (u.my_chat_member) { const s = u.my_chat_member.new_chat_member.status; return trackChat(env, u.my_chat_member.chat, s === 'member' || s === 'administrator'); }
  if (u.message) return onMessage(env, ctx, u.message, false);
  if (u.edited_message) return onMessage(env, ctx, u.edited_message, true);
  if (u.channel_post) return trackChat(env, u.channel_post.chat, true);
  if (u.callback_query) return onCallback(env, u.callback_query);
}

/* ---------- تجهيز البوت مرة وحدة: افتح /setup?key=WEBHOOK_SECRET ---------- */
async function setup(env, origin) {
  const hook = await tg(env, 'setWebhook', { url: origin + '/tg', secret_token: env.WEBHOOK_SECRET, allowed_updates: ['message', 'edited_message', 'callback_query', 'my_chat_member', 'channel_post'], drop_pending_updates: true });
  const cmds = await tg(env, 'setMyCommands', { commands: [{ command: 'start', description: 'البداية' }, { command: 'guide', description: 'دليل الطالب' }, { command: 'dates', description: 'المواعيد الجاية' }, { command: 'tools', description: 'أدوات نجد' }, { command: 'list', description: 'قائمة الردود' }] });
  // قائمة المشرفين فيها «لوحة البوت»، وتظهر بس للمشرف اللي أرسل /start للبوت قبل
  const ADM = [{ command: 'start', description: 'البداية' }, { command: 'guide', description: 'دليل الطالب' }, { command: 'dates', description: 'المواعيد الجاية' }, { command: 'tools', description: 'أدوات نجد' }, { command: 'list', description: 'قائمة الردود (للتثبيت في القروب)' }, { command: 'admin', description: 'لوحة البوت' }, { command: 'myid', description: 'رقم حسابك' }];
  let adminMenus = 0; for (const id of admins(env)) if ((await tg(env, 'setMyCommands', { commands: ADM, scope: { type: 'chat', chat_id: id } })).ok) adminMenus++;
  const desc = await tg(env, 'setMyDescription', { description: 'بوت أكاديمية نجد: اسألني عن لوائح الجامعة ومواعيد التقويم الأكاديمي، والجواب من دليل الطالب والتقويم الرسمي.' });
  const me = await tg(env, 'getMe', {});
  return { webhook: !!hook.ok, commands: !!cmds.ok, description: !!desc.ok, bot: me.ok ? '@' + me.result.username : null, admins: admins(env).length, adminMenus, kv: !!env.BOT_KV };
}

export default {
  async fetch(req, env, ctx) {
    const u = new URL(req.url);
    if (req.method === 'POST' && u.pathname === '/tg') {
      if (!env.WEBHOOK_SECRET || req.headers.get('x-telegram-bot-api-secret-token') !== env.WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
      let upd; try { upd = await req.json(); } catch (e) { return new Response('bad', { status: 400 }); }
      try { await onUpdate(env, ctx, upd); } catch (e) { console.log('update error', (e && e.stack) || e); }
      return new Response('ok');
    }
    if (u.pathname === '/setup') {
      if (!env.WEBHOOK_SECRET || u.searchParams.get('key') !== env.WEBHOOK_SECRET) return new Response('forbidden', { status: 403 });
      if (!env.BOT_TOKEN) return new Response('BOT_TOKEN ناقص', { status: 500 });
      return new Response(JSON.stringify(await setup(env, u.origin), null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' } });
    }
    return new Response('Najd Academy bot ✓');
  }
};
export { norm, toks, search, findBanned, matchReply, findTopic, isMenuCall, urlsOf, allowedUrl, hasPhone, DEFAULT_BANNED, DEFAULT_DOMAINS };
