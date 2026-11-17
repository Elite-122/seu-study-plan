#!/usr/bin/env node
/* يبني assets/data/bot.json لبوت تيليقرام من نفس مصادر الموقع:
   دليل الطالب (assets/js/guide-data.js) والتقويم الأكاديمي (assets/js/seu-calendar.js).
   البوت يقرأ الملف من الموقع، فأي تعديل على الدليل أو التقويم يوصل للبوت بعد ما يتنشر.
   الاستخدام: node tools/build-bot-data.js   (ويشتغل لحاله مع tools/set-version.py) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://najdacdemy.com';

function load(file, key) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx);
  return ctx.window[key];
}

/* HTML الدليل ← HTML اللي يقبله تيليقرام (b و a بس) */
const ENT = { '&nbsp;': ' ', '&quot;': '"', '&#39;': "'" };
function tgHtml(h) {
  let s = String(h).replace(/\r?\n\s*/g, ' ');
  s = s.replace(/<span class="gd-num">([\s\S]*?)<\/span>/g, '<b>$1</b>');
  s = s.replace(/<li>/g, '\n• ').replace(/<\/li>/g, '');
  s = s.replace(/<\/p>\s*<p>/g, '\n\n').replace(/<\/?p>/g, '\n').replace(/<\/?ul>/g, '\n');
  s = s.replace(/<(?!\/?b>)[^>]+>/g, '');
  for (const k in ENT) s = s.split(k).join(ENT[k]);
  return s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
const plain = h => tgHtml(h).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const G = load('assets/js/guide-data.js', 'NAJD_GUIDE');
const C = load('assets/js/seu-calendar.js', 'NAJD_SEU_CAL');

const src = {}; for (const k in G.SRC) src[k] = { u: G.SRC[k].u, t: G.SRC[k].ar };
const sections = G.S.map(s => ({
  id: s.id, t: s.ar.t, sub: s.ar.sub || '',
  qa: s.ar.qa.map((q, j) => ({ q: q[0], a: tgHtml(q[1]), p: plain(q[1]), s: q[2] || '', link: SITE + '/guide.html#' + s.id + '-' + (j + 1) }))
}));
const items = [];
for (const k of Object.keys(C.sem)) for (const x of C.sem[k].items || []) {
  const it = { id: x.id, sem: k, t: x.t, c: x.c, d: x.d };
  if (x.e) it.e = x.e; if (x.z) it.z = 1; if (x.a) it.a = { k: x.a.k, u: x.a.u };
  items.push(it);
}
items.sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0);

const out = { updated: G.updated, site: SITE, guide: SITE + '/guide.html', calendar: SITE + '/calendar.html', src, sections, cal: { year: C.year, src: C.src, ann: C.ann || '', items } };
const file = path.join(ROOT, 'assets/data/bot.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
const json = JSON.stringify(out);
const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
if (old !== json) { fs.writeFileSync(file, json); console.log('updated assets/data/bot.json', sections.reduce((n, s) => n + s.qa.length, 0), 'answers,', items.length, 'dates'); }
else console.log('assets/data/bot.json up to date');
