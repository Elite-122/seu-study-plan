/* يجيب إعلانات التدريب التعاوني من Firestore (قراءة عامة بدون تسجيل دخول) */
const ui = () => window.NajdCoop;
try {
  const { db } = await import("./auth.js?v=20261110h");
  const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js");
  const snap = await getDocs(collection(db, "coop"));
  const list = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
  ui().set(list);
} catch (e) {
  console.warn("najd coop", e);
  ui().fail();
}
