/* دليل الطالب: محتوى الأقسام الثمانية بالعربي والإنجليزي، وكل جواب مع مصدره.
   المصادر الرسمية في SRC. live = عناوين مواعيد من التقويم الرسمي (seu-calendar.js) تطلع حالتها فوق القسم.
   tool = أداة خاصة بالقسم ترسمها الصفحة (systems, absence, compare, meter). */
(function(){
var U='https://seu.edu.sa';
window.NAJD_GUIDE={
updated:'2026-11-16',
SRC:{
  rules:{u:U+'/media/1118128/%D8%A7%D9%84%D9%82%D9%88%D8%A7%D8%B9%D8%AF-%D8%A7%D9%84%D8%AA%D9%86%D9%81%D9%8A%D8%B0%D9%8A%D8%A9-%D9%84%D9%84%D8%A7%D8%A6%D8%AD%D8%A9-%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%B3%D8%A9-%D9%88%D8%A7%D9%84%D8%A7%D8%AE%D8%AA%D8%A8%D8%A7%D8%B1%D8%A7%D8%AA-%D9%84%D9%84%D9%85%D8%B1%D8%AD%D9%84%D8%A9-%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D9%8A%D8%A9-%D9%85%D8%B9%D8%AA%D9%85%D8%AF%D9%87-%D9%8A%D9%86%D8%A7%D9%8A%D8%B1-2026.pdf',ar:'القواعد التنفيذية للائحة الدراسة والاختبارات (يناير 2026)',en:'Executive rules for study and exams (January 2026)'},
  esrv:{u:U+'/media/1118127/%D8%AF%D9%84%D9%8A%D9%84-%D8%B4%D8%A7%D9%85%D9%84-%D8%A2%D9%84%D9%8A%D8%A9-%D8%AF%D8%AE%D9%88%D9%84-%D9%85%D9%88%D9%82%D8%B9-%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A9-%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9-%D9%85%D8%B1%D8%AD%D9%84%D8%A9-%D8%A7%D9%84%D8%A8%D9%83%D8%A7%D9%84%D9%88%D8%B1%D9%8A%D9%88%D8%B3.pdf',ar:'الدليل الشامل للخدمات الإلكترونية',en:'E-services guide'},
  faq:{u:U+'/ar/about/faqs/',ar:'الأسئلة الشائعة في موقع الجامعة',en:'University FAQ'},
  abs:{u:U+'/media/1112060/exam-absence-rules.pdf',ar:'ضوابط أعذار الغياب (2023)',en:'Absence excuse rules (2023)'},
  proc:{u:U+'/media/1116054/academic-procedures-2025.pdf',ar:'دليل الإجراءات الأكاديمية (2025)',en:'Academic procedures guide (2025)'},
  conduct:{u:U+'/media/1117784/%D9%82%D9%88%D8%A7%D8%B9%D8%AF-%D8%A7%D9%84%D8%B3%D9%84%D9%88%D9%83-%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D8%A8%D8%A7%D8%B7-%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A8%D9%8A-%D9%85%D8%B9%D8%AA%D9%85%D8%AF-%D9%81%D9%8A-%D8%A7%D9%84%D8%AC%D9%84%D8%B3%D8%A9-%D8%A7%D9%84%D8%B3%D8%A7%D8%A8%D8%B9%D8%A9-%D9%84%D9%85%D8%AC%D9%84%D8%B3-%D8%A7%D9%84%D8%AC%D8%A7%D9%85%D8%B9%D8%A91447.pdf',ar:'قواعد السلوك والانضباط الطلابي',en:'Student conduct and discipline rules'},
  sso:{u:U+'/ar/blackboard-system/blackboard-instructions/blackboard-support-contact-us/',ar:'دعم الدخول الموحد',en:'Single sign-on support'},
  regs:{u:U+'/ar/deanships/admission-and-registration-deanship/rules-and-regulations/',ar:'صفحة اللوائح والأنظمة',en:'Rules and regulations page'}
},
S:[
/* ١ الأنظمة */
{id:'s1',icon:'phone',src:['esrv','sso'],tool:'systems',
 ar:{t:'الأنظمة اللي بتستخدمها',sub:'حساب الطالب، الخدمات الطلابية، البلاك بورد',
  sum:['كل أنظمتك تدخلها من <b>حساب الطالب</b> في موقع الجامعة.','اسم المستخدم حرف <b>s</b> ثم رقمك الجامعي، وكلمة المرور توصلك على جوالك.','طلباتك (اعتذار، انسحاب، أعذار) من <b>الخدمات الطلابية</b>، وتتابعها من «طلباتي».'],
  qa:[
   ['كيف أدخل حسابي الجامعي؟','<p>من موقع الجامعة اضغط «الدخول»، واكتب:</p><ul><li><b>اسم المستخدم:</b> حرف s متبوع برقمك الجامعي، مثل s2600…</li><li><b>كلمة المرور:</b> اللي توصلك برسالة على جوالك.</li></ul>','esrv'],
   ['نسيت كلمة المرور أو ما قدرت أدخل','<p>من شاشة الدخول اضغط «نسيت كلمة المرور». ولو المشكلة في الدخول الموحد نفسه، راسل <span dir="ltr">iamsupport@seu.edu.sa</span> واكتب في الرسالة رقمك الجامعي ورقم هويتك. أي مشكلة ثانية تفتح لها تذكرة.</p>','sso'],
   ['وين أشوف معدلي وساعاتي وإنذاراتي؟','<p>في حسابك: «الشؤون الأكاديمية» ثم «ملف الطالب». تلقى فيه حالتك الأكاديمية، والساعات المنجزة والمتبقية، والتأجيل والانسحاب وتغيير التخصص، والإنذارات، والمعدل الفصلي والتراكمي.</p>','esrv'],
   ['وين أقدّم طلب اعتذار أو انسحاب أو عذر غياب؟','<p>من «الخدمات الطلابية» في حسابك، وفي الفترة المعلنة في التقويم الأكاديمي بس. بعدها تتابع ردهم من «طلباتي».</p>','esrv'],
   ['عندي مشكلة أو استفسار، لمين أرفعه؟','<p>من أيقونة «الشكاوى والمقترحات والاستفسارات» ترفع تذكرة توصل للجهة المختصة، وتتابعها من «طلباتي».</p>','esrv'],
   ['وش البلاك بورد؟','<p>المنصة التعليمية: محتوى مقرراتك، والمحاضرات الافتراضية، والواجبات والاختبارات والدرجات. تدخله من حسابك أو من <span dir="ltr">lms.seu.edu.sa</span>، وله تطبيق للجوال. دليله المفصل بالخطوات ينزل هنا قريب.</p>','esrv']
  ]},
 en:{t:'The systems you\'ll use',sub:'Student account, student services, Blackboard',
  sum:['Every system opens from your <b>student account</b> on the university website.','Your username is the letter <b>s</b> followed by your university number; the password is sent to your phone.','Requests (apology, withdrawal, absence excuses) go through <b>student services</b>, and you track them in «My requests».'],
  qa:[
   ['How do I sign in to my university account?','<p>On the university website tap «Sign in» and enter:</p><ul><li><b>Username:</b> the letter s followed by your university number, e.g. s2600…</li><li><b>Password:</b> the one sent to your phone by text.</li></ul>','esrv'],
   ['I forgot my password or can\'t sign in','<p>Tap «Forgot password» on the sign-in screen. If the problem is with single sign-on itself, email <span dir="ltr">iamsupport@seu.edu.sa</span> with your university number and ID number. For anything else, open a ticket.</p>','sso'],
   ['Where do I see my GPA, hours and warnings?','<p>In your account: «Academic affairs» → «Student file». It shows your academic status, completed and remaining hours, postponements, withdrawals and major changes, warnings, and your semester and cumulative GPA.</p>','esrv'],
   ['Where do I submit an apology, withdrawal or absence excuse?','<p>Through «Student services» in your account, only during the window in the academic calendar. Then follow the reply in «My requests».</p>','esrv'],
   ['I have a problem or a question. Who do I contact?','<p>The «Complaints, suggestions and enquiries» icon opens a ticket that goes to the right office, and you track it in «My requests».</p>','esrv'],
   ['What is Blackboard?','<p>The learning platform: course content, virtual lectures, assignments, tests and grades. Open it from your account or at <span dir="ltr">lms.seu.edu.sa</span>; there is also a phone app. A step-by-step guide is coming here soon.</p>','esrv']
  ]}},
/* ٢ التسجيل */
{id:'s2',icon:'schedule',src:['rules','proc','faq'],live:['تسجيل المقررات','سداد الرسوم'],tool:'register',
 ar:{t:'التسجيل وجدولك',sub:'العبء الدراسي، الحذف والإضافة، الرسوم',
  sum:['الحد الأدنى <b>11 ساعة</b> والأعلى <b>18</b> في الفصل (الخريج حتى 21).','ما تسجل مقرر قبل ما تنجح في متطلبه السابق.','إذا ما سجلت أي مقرر في فترة التسجيل، تنحسب <b>منقطع</b>.'],
  qa:[
   ['كم ساعة أقدر أسجل؟','<ul><li><b>الفصل العادي:</b> من 11 إلى 18 ساعة.</li><li><b>إذا كنت خريج</b> (آخر فصل لك): حتى 21 ساعة بموافقة العمادة.</li><li><b>الصيفي:</b> حتى 9 ساعات، والخريج حتى 12.</li></ul><p>وبعض التخصصات لها استثناء.</p>','rules:13'],
   ['أقدر أسجل مقرر قبل ما أنجح في متطلبه؟','<p>لا، إلا باستثناء من عميد الكلية أو من يفوضه.</p>','rules:13'],
   ['وش شروط إضافة مقرر؟','<ul><li>ما يتعارض مع محاضراتك أو اختباراتك.</li><li>يكون من خطتك الدراسية.</li><li>فيه مقاعد في الشعبة.</li><li>ما تتجاوز فيه مجموع ساعات خطتك.</li></ul>','rules:13'],
   ['وش شروط حذف مقرر؟','<p>في الفترة المحددة بالتقويم، وما ينزل عبئك عن 11 ساعة. ولو المقرر متطلب لمقرر ثاني مسجل معه، تحذفهم الاثنين. ولعميد الكلية الاستثناء.</p>','rules:13'],
   ['أقدر أحذف أو أضيف بعد ما تخلص الفترة؟','<p>لا. لازم تلتزم بالفترة في التقويم، والكلية تقدر تستثني في الحالات الخاصة. وقبل أي تعديل كبير استشر مرشدك الأكاديمي.</p>','proc'],
   ['كم الرسوم الدراسية؟','<p><span class="gd-num">265 ريال</span> للساعة في الفصل العادي، للمقبولين من العام 1443 وبعده. ضريبة القيمة المضافة 0% للسعوديين، و15% لغير السعوديين.</p>','faq'],
   ['وش يصير لو ما سجلت ولا مقرر؟','<p>تنحسب منقطع عن الدراسة (إلا لو عندك مقرر «غير مكتمل» تكمله). والانقطاع فصل كامل بدون اعتذار أو تأجيل يطوي قيدك. شوف «الانسحاب والاعتذار والتأجيل».</p>','rules:13']
  ]},
 en:{t:'Registration and your schedule',sub:'Course load, add and drop, fees',
  sum:['Minimum <b>11 hours</b> and maximum <b>18</b> per semester (up to 21 in your graduating semester).','You can\'t register a course before passing its prerequisite.','If you register nothing during registration, you are counted as <b>discontinued</b>.'],
  qa:[
   ['How many hours can I register?','<ul><li><b>Regular semester:</b> 11 to 18 hours.</li><li><b>Graduating semester:</b> up to 21 with the deanship\'s approval.</li><li><b>Summer:</b> up to 9 hours, or 12 if you are graduating.</li></ul><p>Some majors have exceptions.</p>','rules:13'],
   ['Can I register a course before passing its prerequisite?','<p>No, unless the college dean (or a delegate) makes an exception.</p>','rules:13'],
   ['What are the conditions to add a course?','<ul><li>No clash with your lectures or exams.</li><li>It is in your study plan.</li><li>The section has seats.</li><li>It doesn\'t take you over your plan\'s total hours.</li></ul>','rules:13'],
   ['What are the conditions to drop a course?','<p>Within the calendar window, without going below 11 hours. If the course is a prerequisite for another course you registered, you drop both. The college dean can make exceptions.</p>','rules:13'],
   ['Can I add or drop after the window closes?','<p>No. Stick to the calendar window; the college may make exceptions in special cases. Talk to your academic advisor before big changes.</p>','proc'],
   ['How much are the fees?','<p><span class="gd-num">SAR 265</span> per credit hour in a regular semester, for students admitted from 1443 onward. VAT is 0% for Saudis and 15% for non-Saudis.</p>','faq'],
   ['What if I don\'t register any course?','<p>You are counted as discontinued (unless you are completing an «incomplete» course). A full semester away without an apology or postponement closes your record. See «Withdrawal, apology and postponement».</p>','rules:13']
  ]}},
/* ٣ الحضور */
{id:'s3',icon:'clock',src:['rules','faq'],live:['أعذار التغيب عن المحاضرات'],tool:'absence',
 ar:{t:'الحضور والغياب',sub:'الحرمان ورفعه، والأعذار',
  sum:['إذا زاد غيابك عن <b>25%</b> من ساعات المقرر، تنحرم من الاختبار النهائي وينرصد لك <b>محروم (DN)</b>، ويُحسب راسب.','الحضور الافتراضي يُحسب مثل الحضوري، حسب نمط المقرر.','عندك عذر؟ يقدر مجلس الكلية يرفع الحرمان إذا حضورك ما قل عن <b>50%</b>.'],
  qa:[
   ['وش يعني «محروم»؟','<p>يعني ما يحق لك تدخل الاختبار النهائي للمقرر، وتنرصد لك درجة <b>محروم (ح) أو (DN)</b>، وتُعامل معاملة الراسب في المقرر.</p>','rules:14'],
   ['مين يرصد غيابي؟ ومتى أعرف إني محروم؟','<p>أستاذ المقرر يرصد الغياب <b>إلكترونيًا</b> من أول يوم في الفصل لين آخر أسبوع فيه. وقوائم الحرمان تنعلن <b>قبل بداية الاختبارات النهائية</b>.</p>','rules:14'],
   ['أقدر أرفع الحرمان؟','<p>إيه، بشرطين:</p><ul><li>تقدّم عذر مقبول حسب الضوابط المعلنة.</li><li>حضورك ما يقل عن <span class="gd-num">50%</span> من ساعات المقرر.</li></ul><p>اللي يقرر مجلس الكلية اللي تقدم المقرر (أو من يفوضه)، ولرئيس الجامعة الاستثناء.</p>','rules:15'],
   ['كيف أقدّم عذر غياب عن المحاضرات؟','<p>من الخدمات الطلابية عبر خدمة «التغيب عن المحاضرات بعذر»، في الفترة المعلنة بالتقويم بس، ولا تنقبل أي طريقة ثانية. الأعذار المقبولة نفس أعذار الاختبارات، شوف قسم «الاختبارات».</p>','abs'],
   ['شفت في الأسئلة الشائعة إن النسبة 66%، أيهم الصح؟','<p>المعتمد الحين <b>القواعد التنفيذية الصادرة يناير 2026</b>: الحرمان إذا تجاوز غيابك 25%. يعني لازم تحضر 75% على الأقل. لو شفت رقم ثاني في صفحة أقدم، المرجع هو اللائحة الأحدث.</p>','rules:14']
  ]},
 en:{t:'Attendance and absence',sub:'Being barred, lifting it, and excuses',
  sum:['If your absence goes over <b>25%</b> of the course hours, you are barred from the final exam and get <b>DN</b>, which counts as a fail.','Virtual attendance counts the same as in person, depending on how the course is taught.','Have an excuse? The college council can lift the bar if you attended at least <b>50%</b>.'],
  qa:[
   ['What does «barred» (DN) mean?','<p>You may not sit the course\'s final exam. You get <b>DN</b> and are treated as having failed the course.</p>','rules:14'],
   ['Who records my absence, and when will I know?','<p>Your instructor records attendance <b>electronically</b> from the first day to the last week of the semester. Bar lists are announced <b>before the final exams start</b>.</p>','rules:14'],
   ['Can the bar be lifted?','<p>Yes, if both are true:</p><ul><li>You submit an accepted excuse under the published rules.</li><li>You attended at least <span class="gd-num">50%</span> of the course hours.</li></ul><p>The council of the college teaching the course (or a delegate) decides; the university president can make exceptions.</p>','rules:15'],
   ['How do I submit a lecture absence excuse?','<p>Through student services, using «Absence from lectures with an excuse», only during the calendar window; no other channel is accepted. Accepted excuses are the same as for exams; see «Exams».</p>','abs'],
   ['The FAQ says 66%. Which is right?','<p>The <b>executive rules issued January 2026</b> are the current reference: you are barred if absence exceeds 25%, so you need at least 75% attendance. If an older page says otherwise, the newer rules apply.</p>','rules:14']
  ]}},
/* ٤ الاختبارات */
{id:'s4',icon:'quiz',src:['rules','abs','conduct'],live:['أعذار التغيب عن الاختبارات النهائية','الاعتراض','البديلة'],
 ar:{t:'الاختبارات',sub:'الأعذار، الاختبار البديل، الاعتراض',
  sum:['الأعمال الفصلية بين <b>40%</b> و<b>60%</b> من درجة المقرر، والباقي للنهائي.','غبت عن النهائي <b>بعذر مقبول</b>؟ تختبر بديل مرة وحدة. بدون عذر تاخذ صفر في النهائي.','تقدر تعترض على درجتك النهائية خلال <b>15 يوم</b> من اعتماد النتيجة.'],
  qa:[
   ['كيف تنقسم درجة المقرر؟','<p>الأعمال الفصلية ما تقل عن <span class="gd-num">40%</span> ولا تزيد عن <span class="gd-num">60%</span> من الدرجة، والباقي للاختبار النهائي، وبعض المقررات لها توزيع مختلف. النهائي ينعقد مرة وحدة، ودرجته تنرصد خلال <span class="gd-num">48 ساعة</span> من نهاية الاختبار.</p>','rules:29-30'],
   ['غبت عن الاختبار النهائي، وش يصير؟','<ul><li><b>بدون عذر:</b> درجتك صفر في النهائي، وتقديرك يتحسب من أعمالك الفصلية.</li><li><b>بعذر مقبول:</b> تاخذ <b>اختبار بديل</b> مرة وحدة قبل نهاية الفصل اللي بعده. وإذا ما اختبرته، ترجع لنفس حكم الغائب بدون عذر.</li></ul>','rules:31-32'],
   ['كيف أقدّم عذر غياب عن اختبار؟','<p>من الخدمات الطلابية عبر خدمة «التغيب عن الاختبارات بعذر»، مع كل المستندات، في الفترة المعلنة بالتقويم. ولو الخدمة ما اشتغلت، ارفع تذكرة عن طريق «المساعد الأكاديمي» وأرفق صورة المشكلة وعذرك.</p>','abs'],
   ['وش الأعذار المقبولة؟','<ul><li><b>إجازة مرضية</b> من أي مستشفى أو مستوصف، تقدر الجامعة تتحقق منها عن طريق منصة صحة.</li><li><b>مرافقة مريض</b> من الدرجة الأولى: تنويم، أو موعد في مستشفى حكومي بنفس وقت الاختبار.</li><li><b>وفاة</b> قريب من الدرجة الأولى: 3 أيام بحد أقصى من تاريخ الوفاة.</li><li><b>الولادة</b> للطالبات: أسبوع من تاريخ الولادة.</li><li><b>حادث سير</b> بنفس وقت الاختبار، مع تقرير المرور أو نجم.</li><li><b>حالات قهرية ثانية:</b> بخطاب رسمي لعميد الكلية مع المستندات.</li></ul><p>الدرجة الأولى: الوالدين، والأبناء، والزوج أو الزوجة، والإخوان والأخوات.</p>','abs'],
   ['انقبل عذري عن الاختبار الفصلي، وش يصير؟','<p>حسب ضوابط الأعذار، درجة الفصلي تنضاف لدرجة النهائي. مثلًا لو الفصلي 20 والنهائي 40، يصير نهائيك من 60.</p>','abs'],
   ['وش يعني «غير مكتمل (IC)»؟','<p>مجلس القسم يقدر، بتوصية من أستاذ المقرر، يسمح لك تكمل متطلبات المقرر في الفصل اللي بعده. ما يدخل في معدلك لين تكمله، وإذا خلصت المدة وما كملت يتحول <b>راسب (F)</b>.</p>','rules:33'],
   ['أقدر أعترض على درجتي النهائية؟','<p>إيه، إلكترونيًا خلال <span class="gd-num">15 يوم</span> من اعتماد النتيجة، في الفترة المعلنة بالتقويم. لجنة من القسم (مو منها أستاذ المقرر) تراجع أعمالك الفصلية أو النهائي أو الاثنين، ولو لقت اختلاف تتعدل درجتك.</p>','rules:36'],
   ['وش يصير لو أحد غش؟','<p>الغش والمخالفات لها لائحة خاصة: <b>قواعد السلوك والانضباط الطلابي</b>، وفيها العقوبات وطريقة التظلم. ارجع لها من الرابط تحت.</p>','conduct']
  ]},
 en:{t:'Exams',sub:'Excuses, alternative exams, appeals',
  sum:['Coursework is <b>40%</b> to <b>60%</b> of the course grade; the rest is the final.','Missed the final <b>with an accepted excuse</b>? You sit one alternative exam. Without one, you score zero on the final.','You can appeal your final grade within <b>15 days</b> of the result being approved.'],
  qa:[
   ['How is the course grade split?','<p>Coursework is at least <span class="gd-num">40%</span> and at most <span class="gd-num">60%</span>; the final exam is the rest, and some courses differ. The final is held once, and its grade is entered within <span class="gd-num">48 hours</span> of the exam ending.</p>','rules:29-30'],
   ['I missed the final exam. What happens?','<ul><li><b>Without an excuse:</b> zero on the final; your grade comes from coursework.</li><li><b>With an accepted excuse:</b> one <b>alternative exam</b> before the end of the next semester. If you don\'t sit it, you are treated as absent without an excuse.</li></ul>','rules:31-32'],
   ['How do I submit an exam absence excuse?','<p>Through student services, using «Absence from exams with an excuse», with all documents, during the calendar window. If the service fails, open a ticket through the «Academic assistant» with a screenshot of the problem and your excuse.</p>','abs'],
   ['Which excuses are accepted?','<ul><li><b>Sick leave</b> from any hospital or clinic, verifiable through the Seha platform.</li><li><b>Accompanying a first-degree relative</b>: admission, or an appointment at a government hospital at the exam time.</li><li><b>Death</b> of a first-degree relative: up to 3 days from the date of death.</li><li><b>Childbirth</b> (female students): one week from the birth.</li><li><b>Traffic accident</b> at the exam time, with a traffic or Najm report.</li><li><b>Other emergencies:</b> an official letter to the college dean with documents.</li></ul><p>First degree: parents, children, spouse, brothers and sisters.</p>','abs'],
   ['My midterm excuse was accepted. What happens?','<p>Under the excuse rules, the midterm\'s weight moves to the final. For example, a 20-mark midterm and a 40-mark final become a 60-mark final.</p>','abs'],
   ['What does «Incomplete» (IC) mean?','<p>The department council, on the instructor\'s recommendation, can let you finish the course requirements next semester. It isn\'t counted in your GPA until you finish; if time runs out, it becomes <b>F</b>.</p>','rules:33'],
   ['Can I appeal my final grade?','<p>Yes, online within <span class="gd-num">15 days</span> of the result being approved, during the calendar window. A department committee (without your instructor) reviews your coursework, final or both, and corrects the grade if it finds a difference.</p>','rules:36'],
   ['What about cheating?','<p>Cheating and misconduct fall under the <b>student conduct and discipline rules</b>, which set the penalties and how to appeal. See the link below.</p>','conduct']
  ]}},
/* ٥ الانسحاب والاعتذار والتأجيل */
{id:'s5',icon:'pause',src:['rules','faq','proc'],live:['الانسحاب من مقرر','الاعتذار عن الدراسة','تأجيل الدراسة'],tool:'compare',
 ar:{t:'الانسحاب والاعتذار والتأجيل',sub:'الفرق بينهم ومتى',
  sum:['<b>الانسحاب</b> من مقرر أو أكثر، و<b>الاعتذار</b> عن الفصل كامل، و<b>التأجيل</b> للفصل كامل في بدايته.','الاعتذار ينحسب من مدة دراستك، والتأجيل ما ينحسب.','ما فيه اعتذار ولا تأجيل في <b>السنة الأولى المشتركة</b>.'],
  qa:[
   ['شروط الانسحاب من مقرر','<ul><li>تقدّم طلب إلكتروني في الفترة المعلنة في التقويم.</li><li>ما يقل اللي يبقى لك بعد الانسحاب عن <span class="gd-num">11 ساعة</span>، ولعميد الكلية النظر في الحالات اللي تقل.</li><li>ما عليك رسوم متأخرة.</li><li>ما ينقبل إذا كنت <b>محروم</b> في المقرر.</li></ul>','rules:17'],
   ['كم مرة أقدر أعتذر أو أأجل؟','<ul><li><b>الاعتذار:</b> فصلين دراسيين متتاليين بحد أقصى، وما يتجاوز سنة دراسية. والاعتذار عن الصيفي ما ينحسب من المرات.</li><li><b>التأجيل:</b> فصلين دراسيين متتاليين بحد أقصى.</li></ul><p>وفي الحالتين لازم تسجل بعد ما تخلص المدة، وإلا تنحسب <b>منقطع</b>.</p>','rules:16,18'],
   ['متى ما ينفع أعتذر عن الفصل؟','<ul><li>بعد ما تحضر الاختبار النهائي لأي مقرر في الفصل.</li><li>إذا عليك رسوم متأخرة.</li><li>إذا ما عندك مقررات مسجلة في الفصل.</li></ul>','rules:16'],
   ['ترجع لي الرسوم إذا اعتذرت؟','<p>لا، إذا اعتذرت بعد ما يبدأ الفصل. أما طلب التأجيل في فترته فما تنحسب عليه رسوم دراسية.</p>','proc'],
   ['وش يصير لو ما سجلت ولا اعتذرت ولا أجلت؟','<p>إذا انقطعت <b>فصل دراسي</b> بدون اعتذار أو تأجيل، <b>ينطوي قيدك</b>. وتقدر تطلب إعادة القيد، شوف قسم «تغيير التخصص وإعادة القيد».</p>','rules:19']
  ]},
 en:{t:'Withdrawal, apology and postponement',sub:'How they differ and when',
  sum:['<b>Withdraw</b> from one or more courses, <b>apologise</b> for a whole semester, or <b>postpone</b> a whole semester at its start.','An apology counts toward your study period; a postponement doesn\'t.','There is no apology or postponement in the <b>common first year</b>.'],
  qa:[
   ['Conditions to withdraw from a course','<ul><li>Submit an online request within the calendar window.</li><li>At least <span class="gd-num">11 hours</span> must remain after withdrawing; the college dean can review cases below that.</li><li>No overdue fees.</li><li>Not accepted if you are <b>barred</b> in that course.</li></ul>','rules:17'],
   ['How many times can I apologise or postpone?','<ul><li><b>Apology:</b> at most two consecutive semesters, not exceeding one academic year. A summer apology doesn\'t count.</li><li><b>Postponement:</b> at most two consecutive semesters.</li></ul><p>Either way, register when it ends, or you are counted as <b>discontinued</b>.</p>','rules:16,18'],
   ['When can\'t I apologise for a semester?','<ul><li>After sitting the final exam of any course that semester.</li><li>If you have overdue fees.</li><li>If you have no registered courses that semester.</li></ul>','rules:16'],
   ['Do I get my fees back if I apologise?','<p>No, not after the semester starts. A postponement requested in its window carries no tuition.</p>','proc'],
   ['What if I don\'t register, apologise or postpone?','<p>One <b>semester</b> away without an apology or postponement <b>closes your record</b>. You can ask to be re-enrolled; see «Change of major and re-enrollment».</p>','rules:19']
  ]}},
/* ٦ تغيير التخصص وإعادة القيد */
{id:'s6',icon:'compass',src:['rules','proc'],live:['تغيير التخصص'],
 ar:{t:'تغيير التخصص وإعادة القيد',sub:'الشروط والمواعيد',
  sum:['تغيير التخصص <b>مرة وحدة</b>، بمعدل <b>2 من 4</b> على الأقل، ومقاعد متوفرة.','الطلب إلكتروني في الفترة المعلنة، والتحويل ينفذ في الفصل اللي بعده.','انطوى قيدك؟ تقدر تطلب إعادته <b>مرة وحدة خلال 4 فصول</b>.'],
  qa:[
   ['وش شروط تغيير التخصص؟','<ul><li>حالتك الأكاديمية منتظمة.</li><li>فيه مقاعد في التخصص.</li><li>معدلك التراكمي ما يقل عن <span class="gd-num">2 من 4</span>، وللكلية الجديدة الاستثناء.</li><li>المدة الباقية لك تكفي تخلص متطلبات التخرج.</li><li>ما تتحول من تخصص يدرس بالعربي لتخصص يدرس بالإنجليزي.</li></ul><p>تقدم الطلب إلكترونيًا في الفترة المعلنة، وينفذ في الفصل اللي بعده، وتكمل مقرراتك الحالية لين ذاك الوقت.</p>','rules:25'],
   ['كم مرة أقدر أغير تخصصي؟','<p>مرة وحدة خلال دراستك. واستشر مرشدك الأكاديمي قبلها عشان تعرف وش يأثر على مدة دراستك.</p>','proc'],
   ['وش يصير لمقرراتي القديمة؟','<p>تتعادل لك إذا كانت مطابقة أو مشابهة لمقرر في خطتك الجديدة بنسبة <span class="gd-num">75%</span> على الأقل، وساعاتها ما تقل عنه. وتنحسب في معدلك التراكمي.</p>','rules:26'],
   ['أقدر أغير الفرع؟','<p>إيه، إذا تخصصك متوفر في الفرع الجديد بنفس مستواك. تقدم الطلب إلكترونيًا، ومرة وحدة خلال دراستك.</p>','proc'],
   ['انطوى قيدي، كيف أرجع؟','<p>تطلب إعادة القيد إلكترونيًا في الفترة المعلنة، مرة وحدة، بهذي الشروط:</p><ul><li>خلال <span class="gd-num">4 فصول</span> من طي القيد.</li><li>انقطاعك بعذر يقبله مجلس الكلية.</li><li>ما تكون مفصول أكاديميًا.</li><li>معدلك التراكمي ما يقل عن <span class="gd-num">1 من 4</span>.</li><li>تقدر تخلص قبل الحد الأقصى للتخرج.</li></ul><p>مدة الانقطاع ما تنحسب من مدة دراستك. وبعد 4 فصول تقدر تتقدم كطالب مستجد.</p>','rules:19'],
   ['انسحبت من الجامعة وأبي أرجع','<p>تقدر تطلب إعادة قيدك برقمك وسجلك السابق بعد سنة دراسية على الأقل من انسحابك، وقبل ما تتجاوز سنتين، بموافقة مجلس الكلية. ترجع بعد فصل من تقديم الطلب، ومرة وحدة بس. وبعد 4 فصول تتقدم كمستجد مع معادلة مقرراتك.</p>','rules:21']
  ]},
 en:{t:'Change of major and re-enrollment',sub:'Conditions and windows',
  sum:['You can change major <b>once</b>, with a GPA of at least <b>2 out of 4</b> and available seats.','Apply online in the calendar window; the change takes effect the following semester.','Record closed? You can ask to be re-enrolled <b>once within 4 semesters</b>.'],
  qa:[
   ['What are the conditions to change major?','<ul><li>Your academic status is regular.</li><li>The major has seats.</li><li>Your cumulative GPA is at least <span class="gd-num">2 out of 4</span>; the new college can make exceptions.</li><li>The time you have left is enough to graduate.</li><li>No moving from an Arabic-taught major to an English-taught one.</li></ul><p>Apply online in the window; it takes effect the next semester, and you keep your current courses until then.</p>','rules:25'],
   ['How many times can I change major?','<p>Once during your studies. Talk to your academic advisor first about the effect on your study time.</p>','proc'],
   ['What happens to my previous courses?','<p>They are credited if they match a course in your new plan by at least <span class="gd-num">75%</span> and carry no fewer hours. They count in your cumulative GPA.</p>','rules:26'],
   ['Can I change branch?','<p>Yes, if your major is offered at the new branch at your level. Apply online; once during your studies.</p>','proc'],
   ['My record was closed. How do I come back?','<p>Request re-enrollment online in the window, once, if:</p><ul><li>it is within <span class="gd-num">4 semesters</span> of the closure,</li><li>the college council accepts your reason,</li><li>you were not academically dismissed,</li><li>your cumulative GPA is at least <span class="gd-num">1 out of 4</span>,</li><li>you can still graduate before the maximum period.</li></ul><p>The time away doesn\'t count toward your study period. After 4 semesters you can apply as a new student.</p>','rules:19'],
   ['I withdrew from the university and want to return','<p>You can ask to be re-enrolled with your old number and record at least one academic year after withdrawing and within two, with the college council\'s approval. You return a semester after applying, and only once. After 4 semesters you apply as a new student with course equivalency.</p>','rules:21']
  ]}},
/* ٧ المعدل والإنذار */
{id:'s7',icon:'gpa',src:['rules'],tool:'meter',
 ar:{t:'المعدل والإنذار',sub:'الإنذار، الفصل، التقدير، مرتبة الشرف',
  sum:['ينعطى الطالب <b>إنذار أكاديمي</b> إذا نزل معدله التراكمي عن <b>1.00 من 4</b> (<b>2.00 من 5</b>).','<b>ثلاث إنذارات متتالية</b> = فصل من الجامعة، ولمجلس الجامعة يعطي فرصة إضافية.','مرتبة الشرف الأولى من <b>3.75</b>، والثانية من <b>3.25</b> (من 4)، بشرط ما ترسب في أي مقرر.'],
  qa:[
   ['متى ينعطى الإنذار بالضبط؟','<p>الإنذار إشعار ينعطى للطالب إذا نزل معدله التراكمي عن الحد الأدنى المطلوب للتخرج. والحد الأدنى للتخرج تقدير <b>مقبول</b>: <span class="gd-num">1.00 من 4</span> (<span class="gd-num">2.00 من 5</span>). وبعض التخصصات يجوز تشترط معدل أعلى للتخرج بموافقة مجلس الجامعة.</p>','rules:1,41'],
   ['متى أنفصل من الجامعة؟','<ul><li>إذا جاك <b>ثلاث إنذارات متتالية</b>.</li><li>إذا ما خلصت متطلبات التخرج خلال <b>مدة البرنامج + نصفها</b>. مثلًا برنامج 4 سنوات حده الأقصى 6 سنوات.</li></ul><p>ويجوز لمجلس الجامعة يعطي فرصة استثنائية لا تتجاوز سنة دراسية، إذا كان ممكن حسابيًا ترفع معدلك وتخلص باقي مقرراتك.</p>','rules:22'],
   ['نجحت في كل المواد بس معدلي تحت حد التخرج، وش أسوي؟','<p>مجلس الكلية يحدد لك مقررات تدرسها عشان ترفع معدلك:</p><ul><li>بحد أقصى <span class="gd-num">20%</span> من ساعات خطتك، وخلال فصلين بحد أقصى.</li><li>ينحسب لك التقدير الأعلى، والأقل يتحول (NP) وما يدخل في المعدل.</li><li>أعلى معدل توصله بهالطريقة هو الحد الأدنى للتخرج.</li></ul>','rules:42'],
   ['وش تقديري عند التخرج؟','<ul><li><b>ممتاز:</b> 3.50 فأعلى.</li><li><b>جيد جدًا:</b> من 2.75 إلى أقل من 3.50.</li><li><b>جيد:</b> من 1.75 إلى أقل من 2.75.</li><li><b>مقبول:</b> من 1.00 إلى أقل من 1.75.</li></ul><p>كلها من 4.</p>','rules:37'],
   ['شروط مرتبة الشرف','<ul><li><b>الأولى:</b> من 3.75 إلى 4.00. <b>الثانية:</b> من 3.25 إلى أقل من 3.75 (من 4).</li><li>ما رسبت في أي مقرر، في الجامعة أو في جامعة ثانية.</li><li>خلصت خلال متوسط المدة بين الحد الأدنى والحد الأقصى للبقاء في كليتك.</li><li>درست في الجامعة 60% على الأقل من متطلبات التخرج.</li></ul>','rules:39']
  ]},
 en:{t:'GPA and warnings',sub:'Warnings, dismissal, graduation grade, honours',
  sum:['A student gets an <b>academic warning</b> if the cumulative GPA drops below <b>1.00 out of 4</b> (<b>2.00 out of 5</b>).','<b>Three consecutive warnings</b> mean dismissal, though the university council may grant an extra chance.','First-class honours from <b>3.75</b>, second-class from <b>3.25</b> (out of 4), provided you never failed a course.'],
  qa:[
   ['When exactly is a warning issued?','<p>A warning is a notice issued when your cumulative GPA falls below the minimum required to graduate. That minimum is a <b>Pass</b>: <span class="gd-num">1.00 out of 4</span> (<span class="gd-num">2.00 out of 5</span>). Some majors may require a higher graduation GPA with the university council\'s approval.</p>','rules:1,41'],
   ['When am I dismissed?','<ul><li>After <b>three consecutive warnings</b>.</li><li>If you don\'t finish within <b>the program length plus half</b>. A 4-year program has a 6-year maximum.</li></ul><p>The university council may grant an exceptional chance of up to one academic year if you can still mathematically raise your GPA and finish your remaining courses.</p>','rules:22'],
   ['I passed every course but my GPA is below the graduation minimum','<p>The college council sets courses for you to raise your GPA:</p><ul><li>Up to <span class="gd-num">20%</span> of your plan\'s hours, over at most two semesters.</li><li>The higher grade counts; the lower becomes NP and leaves the GPA.</li><li>The most you can reach this way is the graduation minimum.</li></ul>','rules:42'],
   ['What is my graduation grade?','<ul><li><b>Excellent:</b> 3.50 and above.</li><li><b>Very good:</b> 2.75 to under 3.50.</li><li><b>Good:</b> 1.75 to under 2.75.</li><li><b>Pass:</b> 1.00 to under 1.75.</li></ul><p>All out of 4.</p>','rules:37'],
   ['Honours conditions','<ul><li><b>First class:</b> 3.75 to 4.00. <b>Second class:</b> 3.25 to under 3.75 (out of 4).</li><li>You never failed a course, here or at another university.</li><li>You finished within the midpoint between your college\'s minimum and maximum study periods.</li><li>At least 60% of your graduation requirements were studied here.</li></ul>','rules:39']
  ]}},
/* ٨ أسئلة شائعة */
{id:'s8',icon:'bulb',src:['faq','rules'],
 ar:{t:'أسئلة شائعة',sub:'لغة الدراسة، المعادلة، التحويل',
  sum:['الدراسة <b>تعلم مدمج</b>: حضوري وإلكتروني.','لغة الدراسة <b>الإنجليزي</b>، إلا القانون والإعلام الرقمي بالعربي.','ما فيه تحويل من جامعة ثانية، تتقدم كمستجد وتعادل مواد محددة.'],
  qa:[
   ['وش نظام الدراسة في الجامعة؟','<p>التعلم المدمج: يجمع بين الحضور التقليدي في الفرع والحضور الإلكتروني على البلاك بورد.</p>','faq'],
   ['بأي لغة ندرس؟','<p>الإنجليزي لكل التخصصات، ما عدا القانون والإعلام الرقمي يدرسون بالعربي.</p>','faq'],
   ['الإنجليزي شرط؟','<p>مو شرط للقبول، لكنه شرط لاجتياز السنة الأولى المشتركة. ويندرّس فيها تدريس فعلي مع برنامج Oxford.</p>','faq'],
   ['أقدر أعتذر أو أأجل في السنة الأولى المشتركة؟','<p>لا، ما فيه اعتذار ولا تأجيل في السنة الأولى المشتركة.</p>','faq'],
   ['أقدر أتحول من جامعة ثانية وأعادل موادي؟','<p>ما فيه تحويل. تقدر تتقدم كطالب مستجد، وتعادل مواد السنة الأولى المشتركة ومقررات الثقافة الإسلامية بس، حسب شروط المعادلة، وتدرس الباقي في الجامعة.</p>','faq'],
   ['أقدر أعادل الدبلوم؟','<p>لا، ما فيه نظام تجسير لشهادة الدبلوم.</p>','faq'],
   ['أقدر أدرس مقرر في جامعة ثانية كطالب زائر؟','<p>إيه بموافقة الكلية والعمادة، بطلب إلكتروني في الفترة المعلنة:</p><ul><li>بحد أقصى <span class="gd-num">25%</span> من ساعات التخرج.</li><li>المقرر يتشابه مع مقرر خطتك بنسبة 75% على الأقل.</li><li>يتعادل إذا جبت <b>C</b> فأعلى، وينرصد (NP) وما يدخل في المعدل.</li></ul>','rules:28']
  ]},
 en:{t:'Frequently asked',sub:'Language of study, equivalency, transfer',
  sum:['Study is <b>blended</b>: in person and online.','Courses are taught in <b>English</b>, except Law and Digital Media, which are in Arabic.','There is no transfer from another university; you apply as a new student and get specific courses credited.'],
  qa:[
   ['How is study organised?','<p>Blended learning: in-person attendance at your branch plus online attendance on Blackboard.</p>','faq'],
   ['What language are courses taught in?','<p>English for all majors, except Law and Digital Media, which are taught in Arabic.</p>','faq'],
   ['Is English required?','<p>Not for admission, but you must pass it to complete the common first year. It is taught in class alongside the Oxford programme.</p>','faq'],
   ['Can I apologise or postpone in the common first year?','<p>No. There is no apology or postponement in the common first year.</p>','faq'],
   ['Can I transfer from another university and have my courses credited?','<p>There is no transfer. You can apply as a new student and have only common-first-year and Islamic culture courses credited under the equivalency rules; you study the rest here.</p>','faq'],
   ['Can my diploma be credited?','<p>No. There is no bridging programme for diplomas.</p>','faq'],
   ['Can I take a course at another university as a visiting student?','<p>Yes, with the college\'s and deanship\'s approval, applying online in the window:</p><ul><li>Up to <span class="gd-num">25%</span> of your graduation hours.</li><li>The course must match one in your plan by at least 75%.</li><li>It is credited with a <b>C</b> or higher, recorded as NP and not counted in your GPA.</li></ul>','rules:28']
  ]}}
]};
})();
