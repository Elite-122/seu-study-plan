/* أكاديمية نجد: يخلّي الموقع يتثبت كتطبيق، ويفتح الأدوات حتى لو النت مقطوع.
   أرقام النسخ (?v=) يحدّثها tools/set-version.py، واسم الكاش يتغير معها فينحذف القديم لحاله. */
const CORE = [
  "assets/css/najd.css?v=202611162300",
  "assets/css/auth.css?v=202611162300",
  "assets/js/layout.js?v=202611162300",
  "assets/js/i18n.js?v=202611162300",
  "assets/js/auth.js?v=202611162300",
  "assets/js/plans-data.js?v=202611162300",
  "assets/js/courses-data.js?v=202611162300",
  "assets/js/faculty-data.js?v=202611162300",
  "assets/js/access.js?v=202611162300",
  "assets/js/study-core.js?v=202611162300",
  "assets/js/focus.js?v=202611162300",
  "assets/js/seu-calendar.js?v=202611162300",
  "assets/js/guide-data.js?v=202611162300",
  "assets/js/course-desc.js?v=202611162300",
  "assets/js/climb.js?v=202611162300",
  "assets/js/mistakes.js?v=202611162300",
  "assets/js/teaching-data.js?v=202611162300"
];
const PAGES = ["./", "index.html", "plans.html", "schedule.html", "study.html", "next-term.html", "gpa.html", "calendar.html", "courses.html", "guide.html", "ratings.html", "offline.html",
  "assets/img/logo.svg?v=202611162300", "assets/img/logo-light.svg?v=202611162300", "assets/img/icon-192.png", "manifest.webmanifest"];
const CACHE = "najd-" + CORE[0].split("v=")[1];
/* مكتبات خارجية ثابتة النسخة: نحفظها عشان الموقع يفتح بدون نت */
const EXTERNAL = /^https:\/\/(www\.gstatic\.com\/firebasejs\/|fonts\.googleapis\.com\/|fonts\.gstatic\.com\/|cdnjs\.cloudflare\.com\/)/;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(CORE.concat(PAGES).map((u) => c.add(u)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("najd-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

function put(req, res) {
  if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (url.pathname.endsWith("/sw.js")) return;
    /* الصفحات: من النت أول عشان تكون أحدث نسخة، وإذا ما فيه نت من المحفوظ */
    if (req.mode === "navigate") {
      e.respondWith(fetch(req).then((r) => put(req, r)).catch(() =>
        caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("offline.html"))));
      return;
    }
    /* الملفات (فيها رقم نسخة): من المحفوظ أول، وإذا ما لقيناها من النت */
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((n) => put(req, n))));
    return;
  }
  if (EXTERNAL.test(req.url)) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((n) => put(req, n))));
  }
});

/* ===== تنبيهات الدراسة: الخادم يرسل عن طريق Firebase Cloud Messaging، وهنا نعرض الإشعار ===== */
self.addEventListener("push", (e) => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (x) { p = { data: { body: e.data ? e.data.text() : "" } }; }
  const d = p.data || {}, n = p.notification || {};
  const title = d.title || n.title || "أكاديمية نجد";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || n.body || "",
    icon: "assets/img/icon-192.png",
    badge: "assets/img/icon-192.png",
    dir: "rtl", lang: "ar",
    tag: d.tag || undefined,
    data: { link: d.link || "./" },
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.link) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => {
    for (const w of ws) { if (w.url === url && "focus" in w) return w.focus(); }
    return self.clients.openWindow(url);
  }));
});
