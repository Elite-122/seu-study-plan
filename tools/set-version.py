#!/usr/bin/env python3
"""يحدّث رقم الإصدار (?v=...) لكل ملفات assets في صفحات الموقع، عشان المتصفحات تجيب النسخة الجديدة بعد أي تحديث.

الاستخدام:  python3 tools/set-version.py            (يستخدم تاريخ ووقت الحين)
            python3 tools/set-version.py 20261110a
"""
import glob, re, sys, time, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ver = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d%H%M")
SKIP = {"college-plans.html"}
# روابط الملفات في الصفحات، وكذلك import داخل ملفات JS
PAT = re.compile(r'((?:assets/(?:css|js)/|\./)[\w.-]+\.(?:css|js))(\?v=[\w.-]+)?(["\'])')

files = [f for f in glob.glob(os.path.join(ROOT, "*.html")) if os.path.basename(f) not in SKIP]
files += glob.glob(os.path.join(ROOT, "assets/js/*.js"))
for f in files:
    s = open(f, encoding="utf-8").read()
    n = PAT.sub(lambda m: m.group(1) + "?v=" + ver + m.group(3), s)
    if n != s:
        open(f, "w", encoding="utf-8").write(n)
        print("updated", os.path.relpath(f, ROOT))
print("version =", ver)
