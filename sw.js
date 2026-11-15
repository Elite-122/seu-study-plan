/* أكاديمية نجد: يخلّي الموقع يتثبت كتطبيق، ويفتح الأدوات حتى لو النت مقطوع.
   أرقام النسخ (?v=) يحدّثها tools/set-version.py، واسم الكاش يتغير معها فينحذف القديم لحاله. */
const CORE = [
  "assets/css/najd.css?v=20261115f",
  "assets/css/auth.css?v=20261115f",
  "assets/js/layout.js?v=20261115f",
  "assets/js/i18n.js?v=20261115f",
  "assets/js/auth.js?v=20261115f",
  "assets/js/plans-data.js?v=20261115f",
  "assets/js/courses-data.js?v=20261115f",
  "assets/js/faculty-data.js?v=20261115f",
  "assets/js/access.js?v=20261115f"
];
const PAGES = ["./", "index.html", "plans.html", "schedule.html", "gpa.html", "calendar.html", "ratings.html", "offline.html",
  "assets/img/logo.svg", "assets/img/logo-light.svg", "assets/img/icon-192.png", "manifest.webmanifest"];
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
