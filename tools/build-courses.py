#!/usr/bin/env python3
"""يبني صفحة ثابتة لكل مقرر في c/<الرمز>.html، وملف sitemap.xml.

الصفحات ثابتة عشان قوقل يقرأ الاسم والوصف والمتطلبات مباشرة. الأجزاء اللي تتغير
(حالة الطالب، والتقييمات، والشروحات، ومين يدرّسه) يعبيها assets/js/course.js.

مصادر البيانات:
  assets/js/courses-data.js   الرموز والأسماء والقسم والمستوى والساعات
  assets/js/plans-data.js     الخطط: في أي تخصص ومستوى، والمتطلبات
  tools/course-desc.json      أوصاف المقررات من ملفات الخطط الرسمية للجامعة (عربي وإنجليزي)
  assets/js/teaching-data.js  مين يدرّس وش (من نظام التسجيل)

الاستخدام:  python3 tools/build-courses.py
شغّله بعد أي تعديل على هذي الملفات، وبعده tools/set-version.py.
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://najdacdemy.com/"


def read(p):
    return open(os.path.join(ROOT, p), encoding="utf-8").read()


src = read("assets/js/courses-data.js")
COURSES = json.loads(re.search(r"NAJD_COURSES=(\[.*?\]);", src, re.S).group(1))
META = json.loads(re.search(r"NAJD_COURSE_META=(\{.*?\});", src, re.S).group(1))
DESC = json.loads(read("tools/course-desc.json"))
TEACH = json.loads(re.search(r"C:(\{.*\})\};", read("assets/js/teaching-data.js"), re.S).group(1))

# الخطط: نقرأ كل سطر مقرر ونعرف تخصصه ومستواه
PLANS, major, lv = {}, None, -1
for line in read("assets/js/plans-data.js").split("\n"):
    m = re.match(r"^  (\w+): \{", line)
    if m:
        major, lv = m.group(1), -1
        PLANS[major] = {"label": "", "en": "", "levels": []}
        continue
    if major is None:
        continue
    m = re.match(r'^\s+label: "([^"]+)"', line)
    if m and not PLANS[major]["label"]:
        PLANS[major]["label"] = m.group(1)
    m = re.match(r'^\s+en: "([^"]+)"', line)
    if m and not PLANS[major]["en"]:
        PLANS[major]["en"] = m.group(1)
    m = re.search(r'\{ label: "([^"]+)", en: "([^"]+)"', line)
    if m:
        lv += 1
        PLANS[major]["levels"].append({"label": m.group(1), "en": m.group(2), "courses": []})
    m = re.match(r'^\s+\["([A-Z]+\d+)", "([^"]*)", "([^"]*)", (\d+), "([^"]*)"\]', line)
    if m and lv >= 0:
        PLANS[major]["levels"][lv]["courses"].append([m.group(1), m.group(2), m.group(3), int(m.group(4)), m.group(5)])
    if line.startswith("};"):
        break

CHAIN = {"ISLM102": ["ISLM101"], "ISLM103": ["ISLM102"], "ISLM104": ["ISLM103"]}
NAME = {c[0]: (c[1], c[2]) for c in COURSES}
SEC = {"common": "المواد المشتركة", "mgt": "إدارة الأعمال", "fin": "المالية", "acct": "المحاسبة", "ecom": "التجارة الإلكترونية"}
LVN = {1: "السنة الأولى", 3: "المستوى الثالث", 4: "المستوى الرابع", 5: "المستوى الخامس", 6: "المستوى السادس", 7: "المستوى السابع", 8: "المستوى الثامن"}
e = html.escape


def prereq_codes(code, text):
    return CHAIN.get(code) or re.findall(r"[A-Z]{2,5}\d{3}", text or "")


def info(code):
    """في أي تخصص، والمتطلب، والمواد اللي تفتحها"""
    majors, pre, unlocks = [], None, {}
    for mk, p in PLANS.items():
        for lv in p["levels"]:
            for c in lv["courses"]:
                if c[0] == code:
                    if mk not in majors:
                        majors.append(mk)
                    if pre is None:
                        pre = c[4]
                elif code in prereq_codes(c[0], c[4]):
                    others = [x for x in prereq_codes(c[0], c[4]) if x != code]
                    unlocks.setdefault(c[0], others)
    if code in CHAIN:
        pre = " + ".join(CHAIN[code])
    return majors, (pre or "—"), unlocks


def node(code, extra=""):
    ar, en = NAME.get(code, ("", ""))
    if code not in NAME:
        return f'<span class="co-node"><b>{e(code)}</b>{extra}</span>'
    return f'<a class="co-node" href="c/{code}.html"><b>{code}</b>{e(ar)}{extra}</a>'


def pre_html(code, pre):
    codes = prereq_codes(code, pre)
    if codes:
        return "".join(node(c) for c in codes)
    if "السنة الأولى" in pre:
        return '<span class="co-node">اجتياز السنة الأولى<em>كل مقررات السنة الأولى</em></span>'
    m = re.search(r"(\d+)", pre)
    if m and "ساعة" in pre:
        return f'<span class="co-node">اجتياز {m.group(1)} ساعة<em>من خطتك</em></span>'
    return '<span class="co-node">ما لها متطلب<em>تقدر تسجلها من أول فصل</em></span>'


TEMPLATE = read("tools/course-template.html")


def page(c):
    code, ar, en = c
    sec, lvl, hrs = META.get(code, ["common", 0, 3])
    majors, pre, unlocks = info(code)
    d = DESC.get(code)
    t = TEACH.get(code, [0, []])
    level = LVN.get(lvl, "")
    mlabels = [PLANS[m]["label"] for m in majors]
    hours_txt = f"{hrs} {'ساعات' if 2 < hrs < 11 else 'ساعة'}"
    if code == "ENG001":
        hours_txt = "8 ساعات في كل فصل (فصلين)"
    desc_ar = d["ar"] if d else ""
    meta_desc = (desc_ar or f"{ar} ({code}): المتطلبات، والصعوبة، وتجارب الطلاب، ومين يدرّسه.")[:155]
    if d:
        about = (f'<p class="co-desc" data-lang="ar">{e(d["ar"])}</p>'
                 f'<p class="co-desc" data-lang="en" dir="ltr" hidden>{e(d["en"])}</p>'
                 f'<p class="co-src">المصدر: {e(d["src"])} (الخطة الرسمية للجامعة)</p>')
    else:
        about = '<p class="co-desc co-nodesc">ما لقينا وصف هذا المقرر في ملفات الخطط الرسمية للجامعة.</p>'
    chips = "".join(f"<span>{e(x)}</span>" for x in mlabels) or "<span>—</span>"
    unl = "".join(node(k, f'<em>مع {" + ".join(v)}</em>' if v else "") for k, v in unlocks.items())
    if not unl:
        unl = '<span class="co-node">ما تفتح مقرر ثاني<em>مقرر نهائي في السلسلة</em></span>'
    same = [x for x in COURSES if x[0] != code and META.get(x[0], [None, -1])[1] == lvl and META.get(x[0], [None])[0] in (sec, "common")][:8]
    rel = "".join(f'<a href="c/{x[0]}.html"><b>{x[0]}</b>{e(x[1])}</a>' for x in same)
    ld = {"@context": "https://schema.org", "@type": "Course", "name": f"{ar} ({code})", "alternateName": en,
          "courseCode": code, "description": (d["ar"] if d else meta_desc), "inLanguage": "ar",
          "url": f"{SITE}c/{code}.html", "numberOfCredits": hrs}
    rep = {
        "{{CODE}}": code, "{{AR}}": e(ar), "{{EN}}": e(en), "{{SEC}}": sec, "{{SEC_NAME}}": e(SEC.get(sec, "")),
        "{{LEVEL}}": e(level), "{{HOURS}}": e(hours_txt), "{{META_DESC}}": e(meta_desc),
        "{{ABOUT}}": about, "{{MAJORS}}": chips, "{{MAJOR_N}}": str(len(majors)),
        "{{PRE}}": pre_html(code, pre), "{{UNLOCKS}}": unl, "{{REL}}": rel,
        "{{SECTIONS}}": str(t[0]), "{{TEACHERS}}": str(len(t[1])),
        "{{LD}}": json.dumps(ld, ensure_ascii=False),
    }
    out = TEMPLATE
    for k, v in rep.items():
        out = out.replace(k, v)
    return out


os.makedirs(os.path.join(ROOT, "c"), exist_ok=True)
for c in COURSES:
    open(os.path.join(ROOT, "c", c[0] + ".html"), "w", encoding="utf-8").write(page(c))

# خريطة الموقع
pages = ["", "plans.html", "schedule.html", "gpa.html", "calendar.html", "ratings.html", "coop.html", "store.html", "lessons.html", "quiz.html", "study.html", "next-term.html", "privacy.html", "terms.html"]
pages = [p for p in pages if p == "" or os.path.exists(os.path.join(ROOT, p))]
urls = [SITE + p for p in pages] + [f"{SITE}c/{c[0]}.html" for c in COURSES]
open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n")
print(len(COURSES), "course pages, sitemap", len(urls), "urls")
