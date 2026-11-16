#!/usr/bin/env python3
"""يسحب التقويم الأكاديمي الرسمي لمرحلة البكالوريوس من موقع الجامعة ويحفظه JSON.

الاستخدام:  python3 tools/seu-calendar.py 1448
يطلع:      tools/seu-calendar-1448.json  (الفصل الأول، والثاني، والصيفي)

كل موعد: t العنوان كما في الموقع، c التصنيف، d تاريخ البداية (ميلادي)، e تاريخ النهاية (لو فيه)،
h و he التاريخ الهجري للبداية والنهاية كنص.
التصنيف: exam اختبارات، off إجازات، reg تسجيل ورسوم، req طلبات وخدمات، key بداية ونهاية الفصل.
"""
import html, json, os, re, sys, urllib.request

YEAR = sys.argv[1] if len(sys.argv) > 1 else "1448"
URL = "https://seu.edu.sa/ar/academic-calendar/%s/" % YEAR
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seu-calendar-%s.json" % YEAR)

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


if __name__ == "__main__":
    main()
