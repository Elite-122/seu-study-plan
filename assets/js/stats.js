/* عدّاد الزوار وملف الحساب للوحة الإدارة.
   - الزيارات: كل جهاز ينحسب مرة وحدة في اليوم (بتوقيت الرياض)، مقسومة: الموقع (web) أو التطبيق المثبّت (app).
     والجهاز اللي يزور أول مرة ينحسب بعد في new_web أو new_app. ما نخزن أي شي يعرّف الزائر.
     stats/{YYYY-MM-DD} = {web, app, new_web, new_app}
   - الحساب: profiles/{uid} = {name, email, provider, created, lastSeen} عشان المشرف يشوف الحسابات المسجلة. */
import { db } from "./auth.js?v=202611231803";
import { doc, setDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const day = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(new Date());
const isApp = () => { try { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; } };

export async function countVisit() {
  const page = document.getElementById("najd")?.getAttribute("data-page") || "";
  if (page === "admin" || navigator.webdriver) return;
  let seen, first;
  try { seen = localStorage.getItem("najd_seen"); first = !localStorage.getItem("najd_vid"); } catch (e) { return; }
  const d = day();
  if (seen === d) return;
  try { localStorage.setItem("najd_seen", d); if (first) localStorage.setItem("najd_vid", "1"); } catch (e) { return; }
  const k = isApp() ? "app" : "web", patch = { [k]: increment(1) };
  if (first) patch["new_" + k] = increment(1);
  try { await setDoc(doc(db, "stats", d), patch, { merge: true }); }
  catch (e) { try { localStorage.removeItem("najd_seen"); } catch (x) {} console.warn("najd stats", e); }
}

export async function saveProfile(user) {
  const flag = "najd_prof_" + user.uid;
  try { if (sessionStorage.getItem(flag)) return; } catch (e) {}
  const google = (user.providerData || []).some((p) => p.providerId === "google.com");
  try {
    await setDoc(doc(db, "profiles", user.uid), {
      name: user.displayName || "", email: user.email || "", provider: google ? "google" : "email",
      created: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : null, lastSeen: serverTimestamp(),
    }, { merge: true });
    try { sessionStorage.setItem(flag, "1"); } catch (e) {}
  } catch (e) { console.warn("najd profile", e); }
}
