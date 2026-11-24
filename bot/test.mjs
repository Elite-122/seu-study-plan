// اختبار البوت بتيليقرام وهمي (بدون نت ولا توكن): node bot/test.mjs
import fs from 'fs';
const W = (await import(new URL('./worker.js', import.meta.url))).default;
const BOTJSON = fs.readFileSync(new URL('../assets/data/bot.json', import.meta.url), 'utf8');
const ADMIN = 111, STUDENT = 222, GADMIN = 333, G1 = -1001, G2 = -1002;
let calls = [], mid = 1000;
globalThis.fetch = async (u, o = {}) => {
  u = String(u);
  if (u.includes('bot.json')) return new Response(BOTJSON, { status: 200 });
  const m = u.match(/api\.telegram\.org\/bot[^/]+\/(\w+)/); const body = o.body ? JSON.parse(o.body) : {};
  if (m) { calls.push({ m: m[1], b: body });
    if (m[1] === 'getChatAdministrators') return Response.json({ ok: true, result: [{ user: { id: GADMIN } }] });
    if (m[1] === 'getMe') return Response.json({ ok: true, result: { username: 'NajdAcademyBot' } });
    return Response.json({ ok: true, result: { message_id: ++mid } }); }
  throw new Error('unexpected fetch ' + u);
};
const store = new Map();
const env = { BOT_TOKEN: 'x', WEBHOOK_SECRET: 'sec', ADMIN_IDS: String(ADMIN), BOT_USERNAME: 'NajdAcademyBot', DATA_URL: 'https://x/bot.json',
  BOT_KV: { get: async (k) => store.get(k) ?? null, put: async (k, v) => { store.set(k, v); }, delete: async (k) => { store.delete(k); } } };
const ctx = { waitUntil: () => {} };
const post = async (upd, secret = 'sec') => { calls = []; const r = await W.fetch(new Request('https://bot.example/tg', { method: 'POST', headers: { 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify(upd) }), env, ctx); return r.status; };
let uid = 1; const priv = (from, text, extra = {}) => ({ update_id: uid++, message: { message_id: ++mid, from: { id: from, first_name: 'سارة' }, chat: { id: from, type: 'private' }, text, ...extra } });
const grp = (from, text, chat = G1, extra = {}) => ({ update_id: uid++, message: { message_id: ++mid, from: { id: from, first_name: 'خالد', username: 'khaled' }, chat: { id: chat, type: 'supergroup', title: chat === G1 ? 'القروب العام' : 'المحاسبة' }, text, ...extra } });
const cb = (from, data, msg = { message_id: 5, chat: { id: from, type: 'private' }, text: 'x' }) => ({ update_id: uid++, callback_query: { id: 'c' + uid, from: { id: from }, data, message: msg } });
const sent = () => calls.filter((c) => /^send|copyMessage|editMessage/.test(c.m));
const txt = () => sent().map((c) => c.b.text || c.b.caption || '').join('\n');
const has = (m) => calls.some((c) => c.m === m);
const res = {}; const ok = (n, c, x) => { res[n] = c ? 'PASS' : 'FAIL'; if (!c) console.log('FAIL', n, JSON.stringify(x ?? calls.map((c) => [c.m, (c.b.text || '').slice(0, 80)])).slice(0, 600)); };

// الأمان
ok('webhook rejects wrong secret', (await post(priv(STUDENT, '/start'), 'bad')) === 403);
ok('setup needs key', (await W.fetch(new Request('https://bot.example/setup?key=no'), env, ctx)).status === 403);
const su = await W.fetch(new Request('https://bot.example/setup?key=sec'), env, ctx); const sj = await su.json();
ok('setup sets webhook + commands', sj.webhook && sj.commands && sj.bot === '@NajdAcademyBot' && calls.find((c) => c.m === 'setWebhook').b.url === 'https://bot.example/tg');
{ const cm = calls.filter((c) => c.m === 'setMyCommands'); ok('public menu hides admin+myid; admin menu scoped', cm.length === 2 && !/admin|myid/.test(JSON.stringify(cm[0].b.commands)) && cm[1].b.scope.chat_id === ADMIN && /admin/.test(JSON.stringify(cm[1].b.commands)) && sj.adminMenus === 1); }

// الطالب في الخاص
await post(priv(STUDENT, '/start')); ok('start: welcome + guide/dates/tools, no admin button', /أكاديمية نجد/.test(txt()) && sent()[0].b.reply_markup.inline_keyboard.length === 2 && !/a:menu/.test(JSON.stringify(sent()[0].b.reply_markup)));
await post(priv(STUDENT, 'وش شروط حذف مقرر؟')); ok('guide answer', /11 ساعة/.test(txt()) && /المصدر/.test(txt()), txt());
await post(priv(STUDENT, 'متى يقفل الانسحاب من مقرر')); ok('calendar answer', /الانسحاب من مقرر/.test(txt()) && /التقويم الأكاديمي الرسمي/.test(txt()), txt());
await post(priv(STUDENT, 'كم مرة اقدر اغيب؟')); ok('absence question answered', /<b>/.test(txt()) && !/ما لقيت/.test(txt()), txt().slice(0, 200));
await post(priv(STUDENT, 'وش رايكم بالطقس اليوم')); ok('unknown → honest no-answer', /ما لقيت جواب أكيد/.test(txt()), txt());
await post(priv(STUDENT, 'السلام عليكم')); ok('greeting → welcome', /أنا بوت/.test(txt()));
await post(priv(STUDENT, '/tools')); ok('/tools → 14 site links', (JSON.stringify(sent()[0].b.reply_markup).match(/najdacdemy\.com\//g) || []).length === 14 && /coop\.html#guide/.test(JSON.stringify(sent()[0].b.reply_markup)));
await post(cb(STUDENT, 't')); ok('tools button', /أدوات أكاديمية نجد/.test(txt()));
await post(priv(STUDENT, 'وين نماذج التدريب التعاوني؟')); ok('coop forms → guide + SEUintern', /coop\.html#guide/.test(JSON.stringify(sent()[0].b.reply_markup)) && /t\.me\/SEUintern/.test(JSON.stringify(sent()[0].b.reply_markup)));
await post(priv(STUDENT, 'ابي اختبار تجريبي')); ok('quiz → quiz link', JSON.stringify(sent()[0].b.reply_markup).includes('/quiz.html'));
await post(priv(STUDENT, 'كم سعر الاشتراك')); ok('no tool on «اشتراك»', !JSON.stringify(sent().map((c) => c.b.reply_markup)).includes('/store.html'));
await post(priv(STUDENT, 'كيف احسب معدلي')); ok('GPA → calculator link', JSON.stringify(sent()[0].b.reply_markup).includes('najdacdemy.com/gpa.html'));
await post(priv(STUDENT, 'كم سعر الساعة')); ok('price per hour → fees answer', /265/.test(txt()), txt().slice(0, 200));
await post(priv(STUDENT, 'متى تبدا الدراسه')); ok('study start → upcoming start date', /بداية الدراسة/.test(txt()) && !/الصيفي/.test(txt().split('المصدر')[0]), txt());
await post(priv(STUDENT, 'ابي احذف ماده')); ok('مادة → مقرر synonym', /شروط حذف مقرر/.test(txt()), txt().slice(0, 120));
await post(priv(STUDENT, '/dates')); ok('/dates lists open + upcoming', /مفتوح أو جاري الحين|الجاي/.test(txt()), txt());
await post(cb(STUDENT, 's:2')); ok('section menu edits message', has('editMessageText') && /الحضور والغياب/.test(txt()));
await post(cb(STUDENT, 'q:2:0')); ok('question button → answer + guide link', /محروم/.test(txt()) && JSON.stringify(sent()[0].b.reply_markup).includes('guide.html#s3-1'));
await post(priv(STUDENT, '/myid')); ok('/myid', new RegExp(String(STUDENT)).test(txt()));
await post(priv(STUDENT, '/admin')); ok('student /admin does not open panel', !/لوحة البوت/.test(txt()));
await post(cb(STUDENT, 'a:menu')); ok('student cannot use admin buttons', calls.some((c) => c.m === 'answerCallbackQuery' && /للمشرفين/.test(c.b.text || '')));

// القروب: الردود
await post(grp(STUDENT, 'وش شروط حذف مقرر؟')); ok('group: no mention → silent', sent().length === 0);
await post(grp(STUDENT, '@NajdAcademyBot وش شروط حذف مقرر؟')); ok('group: mention → reply to message', /11 ساعة/.test(txt()) && sent()[0].b.reply_parameters);
await post(grp(STUDENT, '/start@OtherBot')); ok('group: other bot command ignored', sent().length === 0);
await post(grp(STUDENT, 'متى الاختبارات النهائية؟', G1, { reply_to_message: { from: { username: 'NajdAcademyBot' } } })); ok('group: reply to bot → answers', sent().length === 1, txt());

// القروب: الحماية
const banFlow = async (text, n) => { await post(grp(STUDENT, text)); ok(n, has('deleteMessage') && has('banChatMember') && calls.find((c) => c.m === 'banChatMember').b.revoke_messages && calls.some((c) => c.m === 'sendMessage' && c.b.chat_id === ADMIN && /فك الطرد/.test(JSON.stringify(c.b.reply_markup))), calls.map((c) => c.m)); };
await banFlow('عندنا سكليف معتمد بسعر حلو', 'ban: sick leave');
await banFlow('س ك ل ي ف متوفر', 'ban: spaced evasion');
await banFlow('استثمر في البيتكوين واربح', 'ban: bitcoin with ال');
await banFlow('نحل واجبات وكويزات', 'ban: homework service');
await banFlow('اسكت يا كلب', 'ban: insult');
await banFlow('شو رايكم في ترامب', 'ban: politics');
for (const [t, n] of [['السياسة النقدية والتداول في السوق مهمة في المالية', 'finance terms'], ['عندي حماس للمادة', 'حماس=enthusiasm'], ['ACCT321 المحاسبة الحكومية صعبة؟', 'government accounting'], ['الكلب حقنا ضاع هههه', 'plain word كلب'], ['متى الاختبار 2026-12-13 الساعة 9', 'date + time'], ['الحين وقت الحذف والاضافة؟', 'add/drop']]) {
  await post(grp(STUDENT, t)); ok('no false positive: ' + n, !has('deleteMessage') && !has('banChatMember'), calls.map((c) => [c.m, c.b.text]));
}
await post(grp(STUDENT, 'شوفوا هذا https://spam.example.com/x')); ok('link: deleted, not banned', has('deleteMessage') && !has('banChatMember') && /الروابط/.test(txt()));
await post(grp(STUDENT, 'الدليل هنا https://najdacdemy.com/guide.html')); ok('allowed link kept', !has('deleteMessage'));
await post(grp(STUDENT, 'من موقع الجامعة seu.edu.sa/ar/academic-calendar')); ok('university link kept', !has('deleteMessage'));
await post(grp(STUDENT, 'اضغط هنا', G1, { entities: [{ type: 'text_link', offset: 0, length: 4, url: 'https://evil.example' }] })); ok('hidden text_link deleted', has('deleteMessage'));
await post(grp(STUDENT, 'كلموني 0551234567')); ok('phone deleted', has('deleteMessage') && !has('banChatMember'));
await post(grp(STUDENT, 'واتس ٠٥٥ ١٢٣ ٤٥٦٧')); ok('arabic-digit spaced phone deleted', has('deleteMessage'));
await post(grp(STUDENT, 'wa.me/966551234567')); ok('wa.me deleted', has('deleteMessage'));
await post(grp(GADMIN, 'رابط مهم https://forms.example.com')); ok('group admin exempt', !has('deleteMessage'));
await post(grp(ADMIN, 'سكليف (تجربة)')); ok('bot admin exempt', !has('banChatMember'));
await post({ update_id: uid++, edited_message: { message_id: 77, from: { id: STUDENT, first_name: 'x' }, chat: { id: G1, type: 'supergroup', title: 'القروب العام' }, text: 'عدلتها: بيتكوين مجاني' } }); ok('edited message moderated', has('banChatMember'));
await post(cb(ADMIN, `ub:${G1}:${STUDENT}`, { message_id: 9, chat: { id: ADMIN, type: 'private' }, text: 'طردت' })); ok('unban button', calls.some((c) => c.m === 'unbanChatMember' && c.b.user_id === STUDENT && c.b.chat_id === String(G1)));

await post(grp(136817688, 'بيتكوين مجاني', G1, { sender_chat: { id: -100777, type: 'channel', title: 'قناة سبام' } })); ok('posting as a channel: channel banned', calls.some((c) => c.m === 'banChatSenderChat' && c.b.sender_chat_id === -100777) && !has('banChatMember') && calls.some((c) => c.m === 'sendMessage' && c.b.chat_id === ADMIN && JSON.stringify(c.b.reply_markup).includes('uc:')));
await post(cb(ADMIN, `uc:${G1}:-100777`, { message_id: 9, chat: { id: ADMIN, type: 'private' }, text: 'طردت' })); ok('unban channel button', has('unbanChatSenderChat'));
await post(grp(136817688, 'سكليف', G1, { sender_chat: { id: G1, type: 'supergroup', title: 'القروب العام' } })); ok('anonymous group admin exempt', !has('deleteMessage'));
// المشرف: إضافة رد
await post(priv(ADMIN, '/admin')); ok('admin panel', /لوحة البوت/.test(txt()));
await post(cb(ADMIN, 'a:ra')); await post(priv(ADMIN, 'الاشتراك')); ok('reply step 2 asks body', /أرسل الرد/.test(txt()));
await post(priv(ADMIN, 'الاشتراك من المتجر: najd.zid.store', { entities: [{ type: 'bold', offset: 0, length: 8 }] })); ok('reply step 3 asks mode', /متى يرد/.test(txt()));
await post(cb(ADMIN, 'rm:c')); ok('reply saved', /انحفظ/.test(txt()) && JSON.parse(store.get('replies')).length === 1);
await post(priv(ADMIN, 'وين الاشتراك؟')); ok('admin short question gets custom reply, not a draft', /najd.zid.store/.test(txt()) && !/انشر/.test(JSON.stringify(sent())));
await post(priv(ADMIN, 'إعلان: الاشتراك متاح الحين في المتجر للجميع بخصم')); ok('admin long message still a draft', /انشر|القروبات/.test(JSON.stringify(sent())));
await post(grp(STUDENT, 'كيف الاشتراك يا شباب؟')); ok('custom reply in group without mention', calls.some((c) => c.m === 'sendMessage' && /najd\.zid\.store/.test(c.b.text) && c.b.entities && c.b.reply_parameters));
await post(priv(STUDENT, 'ابي الاشتراك')); ok('custom reply in private', /najd\.zid\.store/.test(txt()));
await post(cb(ADMIN, 'a:ra')); await post(priv(ADMIN, 'السعر')); await post(priv(ADMIN, 'x', { text: undefined, photo: [{ file_id: 'small' }, { file_id: 'BIG' }], caption: 'الأسعار' })); await post(cb(ADMIN, 'rm:e'));
await post(grp(STUDENT, 'كم السعر')); ok('exact reply not triggered by longer text', !calls.some((c) => c.m === 'sendPhoto'));
await post(grp(STUDENT, 'السعر؟')); ok('exact photo reply', calls.some((c) => c.m === 'sendPhoto' && c.b.photo === 'BIG' && c.b.caption === 'الأسعار'));
await post(cb(ADMIN, 'a:rl')); const rid = JSON.parse(store.get('replies'))[0].id; await post(cb(ADMIN, 'rd:' + rid)); ok('delete reply', JSON.parse(store.get('replies')).length === 1);

// المشرف: كلمات ممنوعة ومواقع مسموحة
await post(cb(ADMIN, 'a:wa')); await post(cb(ADMIN, 'wc:crypto')); await post(priv(ADMIN, 'ايردروب\nهدية مجانية')); ok('words added', JSON.parse(store.get('banned')).crypto.includes('ايردروب'));
await post(grp(STUDENT, 'ايردروب للكل')); ok('new banned word works', has('banChatMember'));
await post(cb(ADMIN, 'wl:crypto')); const L = JSON.parse(store.get('banned')).crypto; await post(cb(ADMIN, 'wd:crypto:' + L.indexOf('ايردروب'))); ok('word removed', !JSON.parse(store.get('banned')).crypto.includes('ايردروب'));
await post(cb(ADMIN, 'a:da')); await post(priv(ADMIN, 'https://www.youtube.com/')); ok('domain added', JSON.parse(store.get('domains')).includes('youtube.com'));
await post(grp(STUDENT, 'شرح ممتاز https://www.youtube.com/watch?v=abc')); ok('allowed domain kept', !has('deleteMessage'));

// النشر
await post({ update_id: uid++, my_chat_member: { chat: { id: G1, type: 'supergroup', title: 'القروب العام' }, new_chat_member: { status: 'administrator' } } });
await post({ update_id: uid++, my_chat_member: { chat: { id: G2, type: 'supergroup', title: 'المحاسبة' }, new_chat_member: { status: 'administrator' } } });
await post({ update_id: uid++, my_chat_member: { chat: { id: -1009, type: 'channel', title: 'قناة نجد' }, new_chat_member: { status: 'administrator' } } });
ok('3 chats tracked', Object.keys(JSON.parse(store.get('chats'))).length === 3);
await post(priv(ADMIN, 'تذكير: آخر يوم لتقديم الأعذار الجمعة')); const picker = sent()[0]; const did = JSON.stringify(picker.b.reply_markup).match(/pt:(\w+):/)[1];
ok('admin message → picker with 3 chats', /وين أنشره/.test(picker.b.text) && JSON.stringify(picker.b.reply_markup).includes('قناة نجد'));
await post(cb(ADMIN, `pp:${did}`)); ok('publish with none selected warns', calls.some((c) => c.m === 'answerCallbackQuery' && /اختر/.test(c.b.text || '')));
await post(cb(ADMIN, `pt:${did}:${G2}`)); await post(cb(ADMIN, `pt:${did}:-1009`)); await post(cb(ADMIN, `pp:${did}`));
const cps = calls.filter((c) => c.m === 'copyMessage'); ok('published to 2 selected', cps.length === 2 && cps.map((c) => c.b.chat_id).sort().join() === ['-1002', '-1009'].sort().join() && /انتشر في/.test(txt()), cps);
await post(priv(ADMIN, 'متى الاختبارات النهائية؟')); const d2 = JSON.stringify(sent()[0].b.reply_markup).match(/pt:(\w+):/)[1]; await post(cb(ADMIN, `pq:${d2}`)); ok('admin "this is a question" → answered', /الاختبارات النهائية/.test(txt()) && !has('copyMessage'), txt());
await post({ update_id: uid++, my_chat_member: { chat: { id: G2, type: 'supergroup', title: 'المحاسبة' }, new_chat_member: { status: 'left' } } }); ok('removed chat untracked', Object.keys(JSON.parse(store.get('chats'))).length === 2);

// تطبيع الرقابة: أشكال مموهة تنمسك، وكلام دراسي عادي ما ينمسك
{ const M = (await import(new URL('./worker.js', import.meta.url))); const L = JSON.parse(BOTJSON).mod.words;
  const caught = ['ك.س امك', 'كـــس', 'ك س', 'F U C K', 'f.u.c.k', 'fuuuuuck', 'sh!t', 'b1tch', 'a$$', '𝐟𝐮𝐜𝐤', 'ＦＵＣＫ', 'fսck', 'ياكلب', 'يا كلللب', 'س ك ل ي ف', 'شـرمـوطـة', 'sick leave', 'نبيع حشيش', 'سكليف للبيع'];
  const clean = ['السياسات المحاسبية في الشركة', 'سؤال عن الاستثمار والتداول والأرباح', 'التسويق الإلكتروني والترويج', 'جامعة الأمير مساعد', 'الجامعة السعودية الإلكترونية', 'السلام عليكم', 'كم نسبة الغياب؟', 'وين قروب المادة؟', 'نسيت كلمة المرور', 'النسب المالية', 'عندي حماس للمادة', 'المرشد خول لي التسجيل', 'قواد الفرق', 'class pass assessment', 'therapist', 'Marketing course'];
  const miss = caught.filter((x) => !M.findBanned(L, x)); const fp = clean.map((x) => [x, M.findBanned(L, x)]).filter((x) => x[1]);
  ok('obfuscated words caught', !miss.length, miss); ok('normal study talk not caught', !fp.length, fp); }
await post(grp(STUDENT, 'للبيع شقة مفروشة')); ok('ads = delete only, no ban', has('deleteMessage') && !has('banChatMember') && /انحذفت رسالتك/.test(txt()));

await post(grp(GADMIN, '/list')); ok('/list in group by admin → formatted list + pin', /<b>📅 المواعيد<\/b>/.test(txt()) && /start=t_47">حذف مقرر<\/a>/.test(txt()) && has('pinChatMessage') && !/قريبًا/.test(txt()));
await post(grp(STUDENT, '/list')); ok('/list in group by student ignored', !sent().length && !has('pinChatMessage'));
await post(priv(STUDENT, '/list')); ok('/list in private', /start=t_18">التقويم<\/a>/.test(txt()) && !has('pinChatMessage'));

// الترحيب
{ const jm = (members) => ({ update_id: uid++, message: { message_id: ++mid, from: members[0], chat: { id: G1, type: 'supergroup', title: 'القروب العام' }, new_chat_members: members } });
  await post(jm([{ id: 901, first_name: 'نورة' }, { id: 902, first_name: 'فهد' }]));
  const w = sent().find((c) => c.m === 'sendMessage');
  ok('welcome: one message, both names, join notice deleted', w && /هلا والله/.test(w.b.text) && /نورة/.test(w.b.text) && /فهد/.test(w.b.text) && has('deleteMessage') && !has('banChatMember'));
  ok('welcome buttons: archive, groups, rules, bot, site', /NajdArchive/.test(JSON.stringify(w.b.reply_markup)) && /start=groups/.test(JSON.stringify(w.b.reply_markup)) && /start=rules/.test(JSON.stringify(w.b.reply_markup)) && /start=menu/.test(JSON.stringify(w.b.reply_markup)) && /najdacdemy\.com/.test(JSON.stringify(w.b.reply_markup)));
  ok('welcome queued for deletion', JSON.parse(store.get('del_q') || '[]').some((x) => x.at - Date.now() > 25000));
  await post(jm([{ id: 903, first_name: 'SpamBot', is_bot: true, username: 'spam_bot' }])); ok('other bot joins → banned, no welcome', calls.some((c) => c.m === 'banChatMember' && c.b.user_id === 903) && !sent().some((c) => c.m === 'sendMessage'));
  await post(jm([{ id: 904, first_name: 'Najd', is_bot: true, username: 'NajdAcademyBot' }])); ok('our own bot not banned', !has('banChatMember'));
  const q = JSON.parse(store.get('del_q')); q.forEach((x) => { x.at = Date.now() - 1; }); store.set('del_q', JSON.stringify(q)); await post(priv(STUDENT, 'هلا'));
  await new Promise((r) => setTimeout(r, 50)); ok('expired welcome swept', JSON.parse(store.get('del_q')).length === 0); }
{ const sv = (extra, from = { id: 777000, first_name: 'Najd', is_bot: false }) => ({ update_id: uid++, message: { message_id: ++mid, from, chat: { id: G1, type: 'supergroup', title: 'القروب العام' }, ...extra } });
  for (const [n, e, f] of [['pin by bot', { pinned_message: { message_id: 5 } }, { id: 999, first_name: 'Najd Bot', is_bot: true, username: 'NajdAcademyBot' }], ['left', { left_chat_member: { id: 5, first_name: 'x' } }], ['removed by admin', { left_chat_member: { id: 6, first_name: 'PATRIOT' } }, { id: GADMIN, first_name: 'Najd' }], ['title', { new_chat_title: 'جديد' }]]) {
    await post(sv(e, f)); ok('service message deleted, no reply: ' + n, has('deleteMessage') && !sent().length); } }
await post(priv(STUDENT, '/start groups')); ok('deep link groups', /najdacadmey/.test(txt()));
await post(priv(STUDENT, '/start rules')); ok('deep link rules', /قوانين القروب/.test(txt()));
await post(priv(STUDENT, '/start t_47')); ok('deep link to a topic', /شروط حذف مقرر/.test(txt()));
await post(priv(STUDENT, '/start menu')); ok('deep link menu', /سمّ لبيه/.test(txt()));

// عدد المستخدمين
{ await new Promise((r) => setTimeout(r, 50)); store.delete('stats'); for (const k of [...store.keys()]) if (k.startsWith('u:')) store.delete(k);
  const nap = () => new Promise((r) => setTimeout(r, 20));
  await post(priv(5001, 'نجد')); await nap(); await post(priv(5001, 'التقويم')); await nap(); await post(priv(5002, 'هلا')); await nap(); await post(cb(5003, 'm'));
  await new Promise((r) => setTimeout(r, 30));
  const st = JSON.parse(store.get('stats')); const vals = [...store.entries()].filter(([k]) => k.startsWith('u:'));
  ok('stats count unique users once per day', st.total === 3 && Object.values(st.days)[0] === 3, st);
  ok('stats store no names or ids', !JSON.stringify(vals).includes('5001') && !JSON.stringify([...store.values()]).includes('سارة'));
  await post(cb(ADMIN, 'a:st')); ok('admin stats panel', /الكلي: <b>\d+/.test(txt()) && /اليوم/.test(txt())); }

// قائمة الردود
const BJ = JSON.parse(BOTJSON); const kbOf = () => JSON.stringify(sent().map((c) => c.b.reply_markup || {}));
await post(priv(STUDENT, 'نجد')); ok('«نجد» → سمّ لبيه + 8 sections', /سمّ لبيه/.test(txt()) && (kbOf().match(/"mc:/g) || []).length === 8);
await post(grp(STUDENT, 'يا نجد')); ok('group «يا نجد» → menu as reply', /سمّ لبيه/.test(txt()) && sent()[0].b.reply_parameters);
await post(priv(ADMIN, 'نجد')); ok('admin «نجد» → menu, not a draft', /سمّ لبيه/.test(txt()) && !/انشر/.test(kbOf()));
await post(cb(STUDENT, 'mc:0')); ok('section → topics + back', calls.some((c) => c.m === 'editMessageText') && /"mt:18"/.test(kbOf()) && /"m"/.test(kbOf()));
await post(cb(STUDENT, 'm', { message_id: 5, chat: { id: STUDENT, type: 'private' }, text: 'x', reply_markup: { inline_keyboard: [[{ text: 'a', callback_data: 'mt:18' }]] } })); ok('back → sections (edit)', calls.some((c) => c.m === 'editMessageText') && /"mc:7"/.test(kbOf()));
await post(priv(STUDENT, 'تواصل')); ok('typed «تواصل» → two parts', /"mp:44:0"/.test(kbOf()) && /"mp:44:1"/.test(kbOf()));
await post(cb(STUDENT, 'mp:44:0')); ok('college part', /n\.farhah@seu\.edu\.sa/.test(txt()) && /caf\.activities\.clubs/.test(txt()));
await post(cb(STUDENT, 'mp:44:1')); ok('university part', /lamsupport@seu\.edu\.sa/.test(txt()));
await post(grp(STUDENT, 'تاريخ الفاينل')); ok('group typed «تاريخ الفاينل» → exams dates, no first-year rows', /مواعيد الاختبارات/.test(txt()) && /المصدر: التقويم/.test(txt()) && !/السنة الأولى/.test(txt()));
await post(priv(STUDENT, 'حذف مقرر')); ok('guide topic + dates', /شروط حذف مقرر/.test(txt()) && /المواعيد/.test(txt()));
await post(cb(STUDENT, 'mt:01')); ok('photo topic', calls.some((c) => c.m === 'sendPhoto' && /graduation\.jpg$/.test(c.b.photo) && /130|التخرج/.test(c.b.caption)));
await post(cb(STUDENT, 'mt:05')); ok('week topic', /الأسبوع \d+|ما بدأ/.test(txt()));
await post(cb(STUDENT, 'mt:41')); ok('soon topic', /قريبًا/.test(txt()));
for (const w of ['يانجد', 'ي نجد', 'الردود']) { await post(priv(STUDENT, w)); ok('menu call: ' + w, /سمّ لبيه/.test(txt())); }
await post(priv(STUDENT, 'خطة محاسبة')); ok('merged plans topic → major buttons', /plans\.html\?m=acct/.test(kbOf()));
await post(priv(STUDENT, 'برامج مهمة')); ok('apps topic: correct outlook android link', /com\.microsoft\.office\.outlook/.test(kbOf()));
ok('apps topic links to office video', /"mt:74"/.test(kbOf()));
await post(cb(STUDENT, 'mt:74')); ok('office video topic', calls.some((c) => c.m === 'sendVideo' && /office-activation\.mp4$/.test(c.b.video)));
await post(grp(STUDENT, 'وش رايكم نروح نجد بكره نذاكر مع بعض')); ok('long group chatter not hijacked', !sent().length);
{ let bad = []; for (const t of BJ.menu.topics) { await post(cb(STUDENT, 'mt:' + t.id)); const m = calls.find((c) => /^send/.test(c.m)); const body = m && (m.b.text || m.b.caption || ''); if (!m || !body || body.length > (/Photo|Video/.test(m.m) ? 1024 : 4096)) bad.push(t.id); } ok('all topics render within Telegram limits', !bad.length, bad); }

const f = Object.values(res).filter((v) => v === 'FAIL').length; console.log('RESULT', Object.keys(res).length - f, '/', Object.keys(res).length);
