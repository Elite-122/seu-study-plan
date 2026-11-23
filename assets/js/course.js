/* صفحة المقرر (c/<الرمز>.html): الأجزاء اللي تتغير. الجزء الثابت تبنيه tools/build-courses.py */
const root = document.getElementById("najd"), CODE = root && root.getAttribute("data-course");
const N = window.Najd, esc = N.esc, I = N.icon, $ = (id) => document.getElementById(id);
const EN = document.documentElement.lang === "en", L = (a, e) => (EN ? e : a);
const T = (s) => (window.NajdT ? window.NajdT(s) : s);

/* الأيقونات واللغة */
document.querySelectorAll("[data-ic]").forEach((e) => { e.insertAdjacentHTML("afterbegin", I(e.getAttribute("data-ic"))); });
if (EN) {
  const h = $("co-name"); if (h) h.textContent = h.getAttribute("data-en");
  document.querySelectorAll(".co-en").forEach((e) => { e.hidden = true; });
  document.querySelectorAll('#about [data-lang="ar"]').forEach((e) => { e.hidden = true; });
  document.querySelectorAll('#about [data-lang="en"]').forEach((e) => { e.hidden = false; });
}

/* شريط الأقسام يعلّم القسم اللي تقرأه */
const links = [...document.querySelectorAll(".co-nav a")];
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("is-on", a.hash === "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll(".co-sec").forEach((s) => io.observe(s));
}

/* ===== مين يدرّسه: من نظام التسجيل ===== */
(function teachers() {
  const t = (window.NAJD_TEACH || {}).C || {}, X = (window.NAJD_TEACH || {}).X || [], BR = window.NAJD_BRANCHES || {};
  const fac = {}; (window.NAJD_FACULTY || []).forEach((r) => { fac[r[0]] = r; });
  const rows = ((t[CODE] || [0, []])[1]).map(([ref, n]) => {
    const r = typeof ref === "string" ? fac[ref] : null;
    return r ? { id: r[0], name: EN && r[2] ? r[2] : r[1], rank: r[4] || "", br: r[5] || "", n } : { id: "", name: X[ref] || "", rank: L("من قسم آخر", "Other department"), br: "", n };
  }).sort((a, b) => b.n - a.n);
  const box = $("co-ins"), chips = $("co-brs"), more = $("co-more");
  if (!rows.length) { box.innerHTML = `<p class="co-wait">${L("ما لقينا شعب لهذا المقرر في الفصل الحالي.", "No sections for this course this semester.")}</p>`; chips.hidden = true; return; }
  const cnt = {}; rows.forEach((x) => { if (x.br) cnt[x.br] = (cnt[x.br] || 0) + 1; });
  const order = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
  let cur = "all", all = false;
  chips.innerHTML = order.length > 1 ? `<button type="button" class="nj-chip" data-b="all" aria-pressed="true">${L("كل الفروع", "All branches")} <small>${rows.length}</small></button>` + order.map((k) => `<button type="button" class="nj-chip" data-b="${k}" aria-pressed="false">${esc(T(BR[k] || k))} <small>${cnt[k]}</small></button>`).join("") : "";
  const ini = (n) => String(n).replace(/^(د|أ|Dr)\.?\s*/i, "").trim().charAt(0);
  const sec = (n) => (EN ? n + (n === 1 ? " section" : " sections") : n === 1 ? "شعبة" : n === 2 ? "شعبتين" : n + " شعب");
  function draw() {
    const l = rows.filter((x) => cur === "all" || x.br === cur), show = all ? l : l.slice(0, 6);
    box.innerHTML = show.map((x) => {
      const meta = [x.rank, x.br ? T(BR[x.br] || "") : ""].filter(Boolean).join(" · ");
      const inner = `<span class="nj-av" aria-hidden="true">${esc(ini(x.name))}</span><div><b data-no-i18n>${esc(x.name)}</b><small>${esc(meta)}</small></div><em>${sec(x.n)}</em>`;
      return x.id ? `<a class="co-in" href="ratings.html?tab=inst&i=${encodeURIComponent(x.id)}">${inner}</a>` : `<div class="co-in">${inner}</div>`;
    }).join("");
    more.hidden = l.length <= 6; more.textContent = all ? L("أقل", "Show less") : L(`عرض الكل (${l.length})`, `Show all (${l.length})`);
  }
  chips.addEventListener("click", (e) => { const b = e.target.closest("[data-b]"); if (!b) return; cur = b.getAttribute("data-b"); all = false; [...chips.children].forEach((c) => c.setAttribute("aria-pressed", c === b ? "true" : "false")); draw(); });
  more.addEventListener("click", () => { all = !all; draw(); });
  draw();
})();

/* ===== حالتها في خطة الطالب ===== */
const P = window.NAJD_PLANS || {}, NP = window.NajdPlan;
function planState() {
  let s = null; try { s = JSON.parse(localStorage.getItem("najd_plans_v1") || "null"); } catch (e) {}
  return s && P[s.major] ? s : null;
}
function where(m) { const r = []; P[m].levels.forEach((lv, li) => lv.courses.forEach((c, ci) => { if (c[0] === CODE) r.push([li, ci]); })); return r; }
function needText(ms) {
  return ms.map((x) => x.t === "year1" ? L("اجتياز السنة الأولى", "Passing the first year") : x.t === "hours" ? L(`اجتياز ${x.need} ساعة (عندك ${x.have})`, `${x.need} hours passed (you have ${x.have})`) : x.code).join(L("، ", ", "));
}
function status() {
  const box = $("co-status"), btn = $("co-done"), s = planState();
  const card = (cls, ic, b, small) => { box.innerHTML = `<div class="co-status ${cls}">${I(ic)}<div><b>${b}</b><small>${small}</small></div></div>`; };
  if (!s) { card("is-info", "plans", L("وين المقرر من خطتك؟", "Where is it in your plan?"), L("اختر تخصصك في الخطط وعلّم اللي خلصته، ونقولك إذا المقرر مفتوح لك.", "Pick your major in Plans and tick what you finished.") + ` <a href="plans.html">${L("افتح الخطط", "Open plans")}</a>`); btn.hidden = true; return; }
  const pos = where(s.major);
  if (!pos.length) { card("is-info", "plans", L("مو في خطة تخصصك", "Not in your major's plan"), L(`هذا المقرر مو ضمن خطة ${P[s.major].label}.`, `This course isn't in the ${P[s.major].en || s.major} plan.`)); btn.hidden = true; return; }
  const done = pos.filter(([li, ci]) => s.done && s.done[NP.key(s.major, li, ci)]);
  btn.hidden = false;
  if (done.length === pos.length) {
    card("", "check", L("خلصتها", "Completed"), L("معلّمة كمنجزة في خطتك.", "Marked as done in your plan.")); btn.textContent = L("شيل العلامة", "Unmark"); btn.className = "nj-btn nj-btn-line"; btn.dataset.act = "undo"; btn.disabled = false; return;
  }
  const next = pos.find(([li, ci]) => !(s.done && s.done[NP.key(s.major, li, ci)]));
  const ms = NP.missing(s.major, s.done || {}, next[0], next[1]);
  if (ms.length) { card("is-lock", "lock", L("مقفلة", "Locked"), L("باقي عليك: ", "Still needed: ") + esc(needText(ms))); btn.textContent = L("علّمها في خطتي", "Mark as done"); btn.className = "nj-btn nj-btn-fill"; btn.disabled = true; return; }
  card("", "check", L("مفتوحة لك", "Open for you"), done.length ? L("خلصت الجزء الأول، وتقدر تسجل اللي بعده.", "You finished the first part.") : L("خلصت متطلبها، وتقدر تسجلها.", "You meet the prerequisites."));
  btn.textContent = L("علّمها في خطتي", "Mark as done"); btn.className = "nj-btn nj-btn-fill"; btn.disabled = false; btn.dataset.act = "do";
}
$("co-done").addEventListener("click", () => {
  const s = planState(); if (!s) return; s.done = s.done || {};
  const pos = where(s.major);
  if ($("co-done").dataset.act === "undo") { pos.forEach(([li, ci]) => { delete s.done[NP.key(s.major, li, ci)]; }); NP.clean(s.major, s.done); N.toast(L("شلنا العلامة", "Unmarked")); }
  else { const p = pos.find(([li, ci]) => !s.done[NP.key(s.major, li, ci)]); if (p) s.done[NP.key(s.major, p[0], p[1])] = 1; N.toast(L("علّمناها في خطتك", "Marked in your plan")); }
  s.h = NP.hours(s.major, s.done);
  try { localStorage.setItem("najd_plans_v1", JSON.stringify(s)); } catch (e) {}
  status();
});
status();
["najd:auth", "najd:auth-ready", "storage", "pageshow"].forEach((ev) => window.addEventListener(ev, () => setTimeout(status, 60)));

/* ===== التقييمات والشروحات (من Firebase) ===== */
const label = (v) => (v < 2.5 ? L("سهلة", "Easy") : v < 3.5 ? L("متوسطة", "Medium") : L("صعبة", "Hard"));
function reviewsHtml(l) {
  if (!l.length) {
    $("co-r").textContent = "—"; $("co-rn").textContent = L("ما فيه تقييمات بعد", "No ratings yet"); $("co-d").textContent = "—";
    return `<div class="co-empty"><p>${L("ما أحد قيّم هذا المقرر للحين. كن أول واحد، وساعد اللي بعدك.", "No one has rated this course yet. Be the first.")}</p><a class="nj-btn nj-btn-fill nj-btn-sm" href="ratings.html?c=${CODE}">${L("قيّم المقرر", "Rate the course")}</a></div>`;
  }
  const avg = (f) => l.reduce((a, r) => a + (+r[f] || 0), 0) / l.length, ra = avg("rating"), lv = avg("level");
  $("co-r").innerHTML = `${ra.toFixed(1)} <small>/ 5</small>`; $("co-rn").textContent = L(`تقييم الطلاب (${l.length})`, `Student rating (${l.length})`);
  $("co-d").innerHTML = `${lv.toFixed(1)} <small>/ 5</small>`; $("co-dn").textContent = L("الصعوبة: ", "Difficulty: ") + label(lv);
  $("co-revn").textContent = L(`${l.length} تقييم`, `${l.length} ratings`);
  const dist = [5, 4, 3, 2, 1].map((s) => { const n = l.filter((r) => Math.round(+r.rating) === s).length; return `<div><span>${s}</span><i><u style="width:${Math.round(n / l.length * 100)}%"></u></i><span>${n}</span></div>`; }).join("");
  const dots = [1, 2, 3, 4, 5].map((i) => `<i class="${i <= Math.round(lv) ? "on" : ""}"></i>`).join("");
  const tips = l.filter((r) => r.tip).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 3);
  return `<div class="co-rate"><div class="co-big"><b>${ra.toFixed(1)}</b><small>${L("من 5", "of 5")}</small></div><div class="co-dist">${dist}</div></div>
    <div class="co-diff"><span>${L("الصعوبة", "Difficulty")}: <b>${label(lv)}</b> (${lv.toFixed(1)} ${L("من 5", "of 5")})</span><span class="co-dots" aria-hidden="true">${dots}</span></div>
    ${tips.map((r) => `<div class="co-tip"><p data-no-i18n>${esc(r.tip)}</p><small>${L("التقييم", "Rating")} ${+r.rating}/5 · ${L("الصعوبة", "Difficulty")} ${+r.level}/5</small></div>`).join("")}
    <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap;margin-top:var(--sp-5)"><a class="nj-btn nj-btn-line nj-btn-sm" href="ratings.html?c=${CODE}">${L(`كل التجارب (${l.length})`, `All experiences (${l.length})`)}</a><a class="nj-btn nj-btn-fill nj-btn-sm" href="ratings.html?c=${CODE}">${L("قيّم المقرر", "Rate the course")}</a></div>`;
}
function contentHtml(user, lessons, quizzes, grants, verified) {
  if (!user) return `<div class="co-empty"><p>${L("سجّل دخولك عشان تشوف شروحات المقرر وملخصاته واختباراته. المجاني منها يفتح لك على طول.", "Sign in to see this course's lessons, summaries and quizzes.")}</p><a class="nj-btn nj-btn-fill nj-btn-sm" href="login.html?next=${encodeURIComponent("c/" + CODE + ".html")}">${L("تسجيل الدخول", "Sign in")}</a></div>`;
  const NA = window.NajdAccess;
  const can = (x, k) => x.free || (verified && NA && NA.has(grants, x.code, k));
  const items = lessons.map((x) => ({ t: x.title, k: x.type === "pdf" ? "pdf" : "video", ic: x.type === "pdf" ? "file" : "play", sub: x.type === "pdf" ? L("ملخص PDF", "PDF summary") : L("شرح فيديو", "Video lesson"), href: `lessons.html?c=${CODE}`, x }))
    .concat(quizzes.map((x) => ({ t: x.title, k: x.need === "video" ? "video" : "pdf", ic: "quiz", sub: L(`اختبار · ${(x.questions || []).length} سؤال`, `Quiz · ${(x.questions || []).length} questions`), href: `quiz.html?c=${CODE}`, x })));
  $("co-cn").textContent = items.length ? L(`${items.length} عنصر`, `${items.length} items`) : "";
  if (!items.length) return `<div class="co-empty"><p>${L("ما نزلت شروحات لهذا المقرر للحين. نضيف أول بأول، وتلقى اللي ينزل هنا.", "Nothing published for this course yet.")}</p><a class="nj-btn nj-btn-line nj-btn-sm" href="store.html">${L("شوف المتجر", "Visit the store")}</a></div>`;
  const locked = items.some((i) => !can(i.x, i.k));
  const M = window.NajdMist, mc = M ? M.count(CODE) : { total: 0, due: 0 };
  const mist = mc.total ? `<div class="co-mist"><p><b>${L((mc.total === 1 ? "سؤال واحد" : mc.total === 2 ? "سؤالين" : mc.total <= 10 ? mc.total + " أسئلة" : mc.total + " سؤال") + " غلطت فيها", `${mc.total} questions you got wrong`)}</b>${mc.due ? L(`جا وقت مراجعة ${mc.due === 1 ? "واحد منها" : mc.due === 2 ? "اثنين منها" : mc.due + " منها"}.`, `${mc.due} due today.`) : L("ترجع لك في وقتها.", "They come back on schedule.")}</p><a class="nj-btn nj-btn-fill nj-btn-sm" href="quiz.html?review=${CODE}">${L("راجع أخطائك", "Review mistakes")}</a></div>` : "";
  return mist + `<div class="co-items">${items.map((i) => { const ok = can(i.x, i.k); return `<a class="co-item${ok ? "" : " is-lock"}" href="${i.href}"><i>${I(i.ic)}</i><div><b data-no-i18n>${esc(i.t)}</b><small>${i.sub}</small></div><span class="nj-tag ${i.x.free ? "is-ok" : ok ? "is-ok" : "is-paid"}">${i.x.free ? L("مجاني", "Free") : ok ? L("مشترك", "Subscribed") : L("للمشتركين", "Subscribers")}</span></a>`; }).join("")}</div>`
    + (locked ? `<div class="co-buy"><p><b>${L("اشترك في شروحات المقرر", "Subscribe to this course")}</b>${L("فيديو، أو ملخصات، أو الاثنين.", "Videos, summaries, or both.")}</p><a class="nj-btn nj-btn-white nj-btn-sm" href="store.html">${L("من المتجر", "From the store")}</a></div>` : "");
}

try {
  const A = await import("./auth.js?v=202611231026");
  const fs = await import("https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js");
  const fa = await import("https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js");
  /* التقييمات: للكل */
  try {
    const sn = await fs.getDocs(fs.query(fs.collection(A.db, "courseReviews"), fs.where("target", "==", CODE), fs.where("status", "==", "approved")));
    const l = []; sn.forEach((d) => l.push(d.data()));
    $("co-reviews").innerHTML = reviewsHtml(l);
  } catch (e) { console.warn("najd course reviews", e); $("co-reviews").innerHTML = `<p class="co-wait">${L("ما قدرنا نجيب التقييمات الحين.", "Couldn't load ratings.")}</p>`; }
  /* الشروحات والاختبارات: للمسجّل */
  fa.onAuthStateChanged(A.auth, async (u) => {
    if (!u) { $("co-content").innerHTML = contentHtml(null); return; }
    try {
      let grants = [];
      if (u.email && window.NajdAccess) { const a = await fs.getDoc(fs.doc(A.db, "access", u.email.toLowerCase())); grants = a.exists() ? window.NajdAccess.list(a.data()) : []; }
      const get = async (col) => { const sn = await fs.getDocs(fs.query(fs.collection(A.db, col), fs.where("code", "==", CODE))); const r = []; sn.forEach((d) => r.push({ id: d.id, ...d.data() })); return r.sort((a, b) => (+a.order || 0) - (+b.order || 0)); };
      const [ls, qs] = await Promise.all([get("lessons"), get("quizzes")]);
      $("co-content").innerHTML = contentHtml(u, ls, qs, grants, !!u.emailVerified);
      window.dispatchEvent(new CustomEvent("najd:course-content"));
    } catch (e) { console.warn("najd course content", e); $("co-content").innerHTML = `<p class="co-wait">${L("ما قدرنا نجيب الشروحات الحين.", "Couldn't load lessons.")}</p>`; }
  });
} catch (e) {
  console.warn("najd course", e);
  $("co-reviews").innerHTML = $("co-content").innerHTML = `<p class="co-wait">${L("تحتاج اتصال بالإنترنت عشان نجيب هذا الجزء.", "You need a connection for this part.")}</p>`;
}
