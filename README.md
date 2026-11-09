# أكاديمية نجد

موقع ثابت (HTML/CSS/JS) لطلاب جامعة الأمير مساعد بن عبدالرحمن.

| الصفحة | الملف |
|---|---|
| الرئيسية | `home.html` |
| الخطط الدراسية | `plans.html` |
| الجدول الدراسي | `schedule.html` |
| حاسبة المعدل | `gpa.html` |
| الشروحات | `lessons.html` |
| مساعدك الدراسي | `assistant.html` |
| تسجيل الدخول / إنشاء حساب | `login.html` / `register.html` |
| خطط كلية العلوم الإدارية والمالية (الصفحة الأصلية) | `index.html` |

## الملفات المشتركة
- `assets/css/najd.css`: التصميم والألوان المشتركة (الهيدر، الفوتر، البطاقات، الأزرار).
- `assets/js/layout.js`: يبني الهيدر والفوتر في كل صفحة. روابط الصفحات تتعدل من `LINKS` في أول الملف.
- `assets/js/auth.js`: إعدادات Firebase، وتسجيل الدخول، ومزامنة التقدم مع Firestore.
- `assets/js/auth-forms.js`: نماذج الدخول والتسجيل.

## إعداد Firebase (مرة وحدة)
1. **Authentication ← Sign-in method**: فعّل **Email/Password**، و **Google** لو تبي زر قوقل.
2. **Authentication ← Settings ← Authorized domains**: أضف النطاق اللي ينشر عليه الموقع (مثل `elite-122.github.io` أو نطاقك الخاص).
3. **Firestore Database**: أنشئ قاعدة البيانات، وبعدها من تبويب **Rules** الصق محتوى الملف `firestore.rules` واضغط **Publish**.

## وش ينحفظ في الحساب؟
مستند `users/{uid}` فيه: الخطة (`najd_plans_v1`)، والمعدل (`najd_gpa_v1`)، والجدول (`stq_schedule_v1`).
الأدوات تشتغل بدون حساب وتحفظ في المتصفح. ولما يسجل الطالب دخوله، يتزامن تقدمه بين أجهزته تلقائيًا.

## تجربة الموقع على جهازك
```
python3 -m http.server 8000
```
وافتح `http://localhost:8000/home.html`.
