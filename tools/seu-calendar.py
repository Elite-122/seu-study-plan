#!/usr/bin/env python3
"""يسحب التقويم الأكاديمي الرسمي لمرحلة البكالوريوس من موقع الجامعة ويحفظه JSON.

الاستخدام:  python3 tools/seu-calendar.py 1448           يسحب من الموقع ثم يبني ملف الموقع
            python3 tools/seu-calendar.py 1448 --build   يبني ملف الموقع من JSON المحفوظ بدون سحب
يطلع:      tools/seu-calendar-1448.json  (الفصل الأول، والثاني، والصيفي كما في موقع الجامعة)
            assets/js/seu-calendar.js     (اللي تقراه صفحة التقويم ولوحتي)

ملف الموقع = التقويم الرسمي + تعديلات إعلانات العمادة (tools/seu-calendar-overrides.json)
+ الترجمة الإنجليزية للعناوين (tools/seu-calendar-en.json). بعد البناء شغّل tools/set-version.py.

كل موعد: t العنوان كما في الموقع، c التصنيف، d تاريخ البداية (ميلادي)، e تاريخ النهاية (لو فيه)،
h و he التاريخ الهجري للبداية والنهاية كنص.
التصنيف: exam اختبارات، off إجازات، reg تسجيل ورسوم، req طلبات وخدمات، key بداية ونهاية الفصل.
"""
import hashlib, html, json, os, re, sys, urllib.parse, urllib.request

YEAR = next((a for a in sys.argv[1:] if a.isdigit()), "1448")
URL = "https://seu.edu.sa/ar/academic-calendar/%s/" % YEAR
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "seu-calendar-%s.json" % YEAR)
SITE = os.path.join(HERE, "..", "assets", "js", "seu-calendar.js")

MON = {"يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "إبريل": 4, "مايو": 5, "يونيو": 6, "يوليو": 7,
       "أغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "نوفمبر": 11, "ديسمبر": 12}
HM = ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
      "رمضان", "شوال", "ذو القعدة", "ذو الحجة"]
SECTIONS = [("first", "bachelor-semester-0-collapse", "الفصل الأول"),
            ("second", "bachelor-semester-1-collapse", "الفصل الثاني"),
            ("summer", "summer-semester-0-collapse", "الفصل الصيفي")]
ALL_IDS = ["bachelor-semester-0-collapse", "bachelor-semester-1-collapse", "graduate-semester-0-collapse",
           "graduate-semester-1-collapse", "summer-semester-0-collapse", "summer-semester-1-collapse"]


def greg(t):
    m = re.match(r"(\d{1,2})\s+(\S+)\s+(\d{4})", t.strip())
    return "%s-%02d-%02d" % (m.group(3), MON[m.group(2)], int(m.group(1))) if m else None


def hij(t):
    t = re.sub(r"\s+", " ", t.strip()).replace("محرّم", "محرم")
    m = re.match(r"(\d{1,2})/(\d{1,2})/(\d{4})", t)
    if m:
        return "%d %s %s" % (int(m.group(1)), HM[int(m.group(2)) - 1], m.group(3))
    m = re.match(r"(\d{1,2}) (.+?) (\d{4})", t)
    return "%d %s %s" % (int(m.group(1)), m.group(2), m.group(3)) if m else None


def tidy(t):
    t = re.sub(r'\s*"\s*([^"]+?)\s*"\s*', lambda m: " «" + m.group(1).strip() + "» ", t)
    t = re.sub(r"\s+،\s*", "، ", t)
    return re.sub(r"\s+", " ", t).strip().replace("( ", "(").replace(" )", ")")


def cat(t):
    if "فترة إغلاق خدمة" in t:
        return "req"
    if "البديلة" in t:
        return "exam"
    if re.search(r"إجازة|اليوم الوطني|يوم التأسيس|عيد", t) and not re.search(r"إغلاق الفصل", t):
        return "off"
    if re.search(r"اختبار|الاختبارات", t) and not re.search(r"أعذار|اعتراض", t):
        return "exam"
    if re.search(r"تسجيل|سداد", t) and not re.search(r"اعتذار|انسحاب", t):
        return "reg"
    if re.search(r"بداية|إغلاق|نهاية", t):
        return "key"
    return "req"


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    s = urllib.request.urlopen(req, timeout=60).read().decode("utf-8")
    pos = {k: s.find('id="%s"' % k) for k in ALL_IDS}
    out = {"year": YEAR, "src": URL, "sem": {}}
    for key, cid, name in SECTIONS:
        a = pos[cid]
        if a < 0:
            continue
        later = sorted(v for v in pos.values() if v > a)
        seg = s[a:(later[0] if later else len(s))]
        items = []
        for c in seg.split('<div class="nds-card onWhite entry-card')[1:]:
            m = re.search(r'nds-card-title">(.*?)</h3>', c, flags=re.S)
            if not m:
                continue
            hs = re.findall(r'date-hijri">\s*(.*?)\s*</div>', c)
            gs = re.findall(r'date-gregorian">\s*(.*?)\s*</div>', c)
            title = tidy(html.unescape(m.group(1)))
            f, to = (greg(gs[0]) if gs else None), (greg(gs[1]) if len(gs) > 1 else None)
            hf, ht = (hij(hs[0]) if hs else None), (hij(hs[1]) if len(hs) > 1 else None)
            if not f and to:
                f, to, hf, ht = to, None, ht, None
            if not f:
                continue
            if to == f:
                to, ht = None, None
            it = {"t": title, "c": cat(title), "d": f}
            if to:
                it["e"] = to
            if hf:
                it["h"] = hf
            if ht:
                it["he"] = ht
            items.append(it)
        items.sort(key=lambda x: (x["d"], x.get("e") or x["d"]))
        out["sem"][key] = {"name": name, "items": items}
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
    print("saved", OUT, {k: len(v["items"]) for k, v in out["sem"].items()})


def iri(u):
    return urllib.parse.quote(u, safe=":/?=&#%")


def build():
    """يدمج التقويم الرسمي مع إعلانات العمادة والترجمة ويكتب assets/js/seu-calendar.js.

    كل موعد في الملف: id ثابت، t العنوان الرسمي، en ترجمته، c التصنيف، d و e و h و he،
    z=1 لو الموعد فترة إغلاق (ما ينحسب «مفتوح»)،
    a = {u رابط الإعلان، k: ext مدّدته العمادة | chg عدّلته العمادة | ok أعلنته العمادة، w مواعيد التقويم قبل الإعلان}.
    """
    with open(OUT, encoding="utf-8") as fh:
        data = json.load(fh)
    with open(os.path.join(HERE, "seu-calendar-overrides.json"), encoding="utf-8") as fh:
        ov = json.load(fh).get(YEAR, {})
    with open(os.path.join(HERE, "seu-calendar-en.json"), encoding="utf-8") as fh:
        en = json.load(fh)
    missing, used = [], set()
    for key, sem in data["sem"].items():
        for it in sem["items"]:
            it["id"] = key[:2] + hashlib.md5(it["t"].encode("utf-8")).hexdigest()[:6]
            if it["t"] in en:
                it["en"] = en[it["t"]]
            else:
                missing.append(it["t"])
            if "إغلاق خدمة" in it["t"]:
                it["z"] = 1
            for i, o in enumerate(ov.get("items", [])):
                if o["sem"] != key or o["t"] != it["t"]:
                    continue
                used.add(i)
                a = {"u": iri(o["url"]), "on": o.get("on", "")}
                if o.get("d") or o.get("e"):
                    was = {"d": it["d"]}
                    if it.get("e"):
                        was["e"] = it["e"]
                    nd, ne = o.get("d", it["d"]), o.get("e", it.get("e"))
                    a["k"] = "ext" if (ne or nd) > (it.get("e") or it["d"]) else "chg"
                    a["w"] = was
                    it["d"] = nd
                    if ne:
                        it["e"] = ne
                    for hk in ("h", "he"):
                        if o.get(hk):
                            it[hk] = o[hk]
                else:
                    a["k"] = "ok"
                it["a"] = a
        sem["items"].sort(key=lambda x: (x["d"], x.get("e") or x["d"]))
    for i, o in enumerate(ov.get("items", [])):
        if i not in used:
            print("تنبيه: إعلان ما لقينا موعده في التقويم:", o["sem"], o["t"])
    for t in missing:
        print("تنبيه: عنوان بدون ترجمة إنجليزية:", t)
    data["ann"] = ov.get("ann", "")
    out = ("/* التقويم الأكاديمي الرسمي لمرحلة البكالوريوس (%s هـ) مع تعديلات إعلانات العمادة.\n"
           "   لا تعدّله يدويًا: يتولد من tools/seu-calendar.py */\n"
           "window.NAJD_SEU_CAL=%s;\n") % (YEAR, json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    with open(SITE, "w", encoding="utf-8") as fh:
        fh.write(out)
    print("built", os.path.normpath(SITE), {k: len(v["items"]) for k, v in data["sem"].items()})


if __name__ == "__main__":
    if "--build" not in sys.argv:
        main()
    build()
