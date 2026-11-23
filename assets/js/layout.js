/* أكاديمية نجد — الهيدر والفوتر المشتركين، وتتبع التغييرات للمزامنة.
   هذا الملف لازم ينحمّل قبل سكربتات الأدوات (الخطط، الجدول، المعدل). */
(function(){
  var root=document.getElementById('najd');if(!root)return;

  /* روابط الصفحات — عدّلها هنا لو غيّرت أسماء الملفات */
  var LINKS={home:'index.html',study:'study.html',nextterm:'next-term.html',plans:'plans.html',schedule:'schedule.html',gpa:'gpa.html',lessons:'lessons.html',login:'login.html',register:'register.html',coop:'coop.html',store:'store.html',admin:'admin.html',privacy:'privacy.html',terms:'terms.html',quiz:'quiz.html',calendar:'calendar.html',ratings:'ratings.html',account:'account.html',courses:'courses.html',guide:'guide.html',adminhome:'admin-home.html'};
  /* بريد التواصل (يظهر في سياسة الخصوصية والشروط) — اكتبه هنا */
  /* حساب تيليقرام */
  var TELEGRAM_URL='https://t.me/najdacdemy';
  var CONTACT_EMAIL='info@najdacdemy.com';
  /* حسابات التواصل (أسفل الموقع، من اليسار لليمين). رابط فاضي = يطلع «قريبًا» بدون رابط */
  var SOCIAL=[
    ['البريد','mailto:'+CONTACT_EMAIL,'M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zm2.2-.3 6.8 5.1 6.8-5.1z'],
    ['تيليقرام أكاديمية نجد',TELEGRAM_URL,'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'],
    ['قروب تيليقرام العام','https://t.me/najdacadmey','M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'],
    ['واتساب','https://wa.me/966570776056','M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'],
    ['سناب شات','','M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z'],
    ['تيك توك','','M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z']
  ];
  function socialRow(){return '<div class="nj-social" dir="ltr">'+SOCIAL.map(function(s){var svg='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="'+s[2]+'"/></svg>';
    return s[1]?'<a href="'+s[1]+'"'+(s[1].indexOf('mailto:')?' target="_blank" rel="noopener"':'')+' aria-label="'+s[0]+'" title="'+s[0]+'">'+svg+'</a>':'<span class="is-soon" role="img" aria-label="'+s[0]+' (قريبًا)" title="'+s[0]+' (قريبًا)">'+svg+'</span>';}).join('')+'</div>';}
  /* مفتاح إشعارات الجوال العام (Firebase ← إعدادات المشروع ← Cloud Messaging ← Web Push certificates). فاضي = الإشعارات «قريبًا» */
  window.NAJD_PUSH_KEY=window.NAJD_PUSH_KEY||'BE1TWTT5EJEucGnhnQje0Ksxr4pDSqFKroOI7-wOdPo6u-TGLNQdnH-6cFGPNPoKpQwrV-xZGtpl8We-lsFllFE';
  /* القائمة العلوية: مجموعتين منسدلتين + رابطين مباشرين */
  /* أيقونات مرسومة بألوان الهوية (بدل الإيموجي). الاستخدام: Najd.icon('lock') */
  var IC={home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-5h2v5h4a1 1 0 0 0 1-1v-9"/>',more:'<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',plans:'<path d="M8 4h8a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
    schedule:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2"/>',
    gpa:'<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7.5h7M8.5 12h1M12 12h1M15.5 12h.01M8.5 16h1M12 16h1M15.5 16h.01"/>',
    calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/>',
    lessons:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 9.5v5l4.5-2.5z"/>',
    quiz:'<path d="M9 4h6l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8.5 12.5l2 2 4.5-4.5"/>',
    ratings:'<path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4 7.2 18.9l.9-5.4L4.2 9.7l5.4-.8z"/>',
    coop:'<rect x="3.5" y="8" width="17" height="11" rx="2.5"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3.5 13h17"/>',
    store:'<path d="M5 8h14l-1 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>',
    bell:'<g transform="translate(0 -1.500)"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    lock:'<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    pin:'<g transform="translate(0 -.750)"><path d="M12 21s6-5.6 6-10.5a6 6 0 0 0-12 0C6 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/></g>',
    search:'<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
    offline:'<path d="M4 9.5a12 12 0 0 1 16 0M7 13a7.5 7.5 0 0 1 10 0M10 16.5a3 3 0 0 1 4 0"/><path d="M4 4l16 16"/>',
    book:'<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z"/><path d="M12 6.5v13"/>',
    file:'<path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4M9 13h6M9 17h4"/>',
    play:'<circle cx="12" cy="12" r="8.5"/><path d="M10.5 8.8v6.4l5-3.2z"/>',
    mail:'<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7.5l8 6 8-6"/>',
    check:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.5 2.5 4.5-5"/>',
    bulb:'<path d="M9 17h6M10 20h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-.6.5-.9 1.2-.9 2.500H9.400c0-1.3-.3-2-.9-2.500z"/>',
    target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    bolt:'<path d="M13 3L5 13.5h6L10 21l8-10.500h-6z"/>',
    cloud:'<g transform="translate(.300 -.750)"><path d="M7.5 18.500a4 4 0 0 1-.6-7.95 5.5 5.5 0 0 1 10.6 1.200A3.5 3.5 0 0 1 17 18.500z"/></g>',
    user:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    compass:'<circle cx="12" cy="12" r="8.5"/><path d="M15 9l-1.8 4.200L9 15l1.8-4.200z"/>',
    coins:'<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.65 3.1 3 7 3s7-1.35 7-3V7M5 12v5c0 1.65 3.1 3 7 3s7-1.35 7-3v-5"/>',
    cart:'<g transform="translate(.500 -.650)"><path d="M3.5 5H6l2 10h9.500l2-7H7.2"/><circle cx="9.5" cy="19" r="1.3"/><circle cx="16.5" cy="19" r="1.3"/></g>',
    share:'<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/>',
    addbox:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
    phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>',
    peak:'<g transform="translate(0 -1.750)"><path d="M3 19l6.5-10.500 4 6 2.500-3.500L21 19z"/></g>',
    focus:'<circle cx="12" cy="13" r="7.500"/><path d="M12 9.500V13l2.500 1.500M10 3h4"/>',
    pause:'<path d="M9 6.500v11M15 6.500v11"/>',
    /* سهم «كمّل» (يأشر لليسار بالعربي، وينقلب بالإنجليزي)، وصح، ورابط خارجي: كلها في نص المربع */
    shield:'<path d="M12 3.500l7 3v5c0 4.300-2.900 7.700-7 9.500-4.100-1.800-7-5.200-7-9.500v-5z"/><path d="M9 12.200l2.100 2.100L15.200 10"/>',
    guide:'<path d="M12 3v18M9 21h6"/><path d="M5 6h10.5l2.5 2.5-2.5 2.5H5z"/><path d="M19 13H9.5L7 15.5 9.5 18H19z"/>',
    arrow:'<path d="M19 12H5M11 6l-6 6 6 6"/>',tick:'<path d="M5.500 12.500l4.200 4.200L18.500 8"/>',ext:'<path d="M8 16L16 8M9.500 8H16v6.500"/>',
    ledger:'<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 9.500h16M9.5 9.500V20M13 13.500h4M13 16.500h4"/>'};
  /* الأيقونات اللي رسمتها مو في نص المربع (الجرس، الدبوس، السحابة، السلة، الجبل) مزحوحة بـ<g> عشان تتوسط */
  function icon(n,cls){return IC[n]?'<svg class="nj-icon'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>':'';}
  var ITEMS={plans:['plans','الخطط الدراسية','مقررات كل مستوى وتقدمك'],schedule:['schedule','الجدول الدراسي','صمّم جدولك واختباراتك'],gpa:['gpa','حاسبة المعدل','الفصلي والتراكمي'],calendar:['calendar','التقويم الأكاديمي','مواعيد التسجيل والاختبارات'],study:['target','خطة المذاكرة','جلسات يومية تتسوى لحالها'],nextterm:['compass','وش أسجل الفصل الجاي؟','المواد المفتوحة لك'],
    lessons:['lessons','الشروحات','فيديو وملفات PDF'],quiz:['quiz','اختبر نفسك','اختبارات تتصحح على طول'],courses:['book','المقررات','وصف كل مقرر وتجارب الطلاب'],guide:['guide','دليل الطالب','الأنظمة واللوائح بكلام واضح'],ratings:['ratings','تقييم الدكاترة','تجارب الطلاب مع أعضاء هيئة التدريس'],coop:['coop','التدريب التعاوني'],store:['store','المتجر']};
  var NAV=[{t:'أدواتك',items:['plans','schedule','study','gpa','nextterm','calendar']},{t:'التعلّم',items:['lessons','quiz','courses','guide']},'coop','store'];
  var PAGE=root.getAttribute('data-page')||'';

  /* المفاتيح اللي تنحفظ في حسابك وتتزامن بين أجهزتك */
  var SYNC_KEYS=['najd_plans_v1','najd_gpa_v1','stq_schedule_v1','najd_quiz_v1','najd_study_v1','najd_mist_v1','najd_next_v1','najd_act_v1'];
  var META='najd_sync_meta';
  function readMeta(){try{return JSON.parse(localStorage.getItem(META)||'{}')||{};}catch(e){return {};}}
  try{
    var orig=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){
      orig.call(this,k,v);
      if(this===window.localStorage&&SYNC_KEYS.indexOf(k)>-1&&!window.__najdSilent){
        var m=readMeta();m[k]=Date.now();orig.call(this,META,JSON.stringify(m));
        try{window.dispatchEvent(new CustomEvent('najd:dirty',{detail:{key:k}}));}catch(e){}
      }
    };
  }catch(e){}

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var CHEV='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
  function cur(k){return PAGE===k?' aria-current="page"':'';}
  function navLinks(){return NAV.map(function(n,i){
    if(typeof n==='string')return '<a href="'+LINKS[n]+'"'+cur(n)+'>'+ITEMS[n][1]+'</a>';
    var on=n.items.indexOf(PAGE)>-1;
    return '<div class="nj-dd"><button type="button" class="nj-dd-btn'+(on?' is-cur':'')+'" aria-expanded="false" aria-haspopup="true" aria-controls="nj-dd-'+i+'">'+n.t+CHEV+'</button><div class="nj-dd-menu" id="nj-dd-'+i+'">'
      +n.items.map(function(k){return '<a href="'+LINKS[k]+'"'+cur(k)+'><i aria-hidden="true">'+icon(ITEMS[k][0])+'</i><span><b>'+ITEMS[k][1]+'</b><small>'+ITEMS[k][2]+'</small></span></a>';}).join('')+'</div></div>';
  }).join('');}
  function drawerLinks(){return NAV.map(function(n){
    if(typeof n==='string')return '<a href="'+LINKS[n]+'"'+cur(n)+'>'+icon(ITEMS[n][0])+ITEMS[n][1]+'</a>';
    return '<p class="nj-dr-h">'+n.t+'</p>'+n.items.map(function(k){return '<a href="'+LINKS[k]+'"'+cur(k)+'>'+icon(ITEMS[k][0])+ITEMS[k][1]+'</a>';}).join('');
  }).join('');}
  var userBox='<div class="nj-user nj-member"><a class="nj-av" href="account.html" data-u="init" aria-label="حسابي">ن</a><span><span class="nj-uname" data-u="name"></span><span class="nj-sync" data-u="sync">تقدمك محفوظ في حسابك</span></span><button type="button" class="nj-out" data-logout>خروج</button></div>';

  /* الوضع الداكن/الفاتح واللغة */
  var SUN='<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var MOON='<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  var PREFS='<button type="button" class="nj-ic" data-theme-toggle aria-label="تبديل الوضع الداكن" title="الوضع الداكن / الفاتح">'+MOON+SUN+'</button>';
  var PREFS_LBL='<button type="button" class="nj-ic" data-theme-toggle>'+MOON+SUN+'<span>الوضع الداكن / الفاتح</span></button>';
  function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('najd_theme',t);}catch(e){}var mc=document.querySelector('meta[name=theme-color]');if(mc)mc.setAttribute('content',t==='dark'?'#0F1817':'#2F4F4E');try{window.dispatchEvent(new CustomEvent('najd:theme',{detail:t}));}catch(e){}}
  if(!document.documentElement.getAttribute('data-theme')){var t0='light';try{if(localStorage.getItem('najd_theme')==='dark')t0='dark';}catch(e){}document.documentElement.setAttribute('data-theme',t0);}
  root.addEventListener('click',function(e){if(e.target.closest('[data-theme-toggle]'))setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');});

  /* لوحة الإدارة: تطلع للمشرفين بس (auth.js يتأكد من admins/{uid} ويستدعي setAdmin). الحماية الحقيقية في قواعد Firestore */
  var ADM_BTN='<a class="nj-ic nj-adm-btn" href="'+LINKS.adminhome+'" data-adm hidden aria-label="لوحة الإدارة" title="لوحة الإدارة">'+icon('shield')+'<span class="nj-adm-n" data-adm-n hidden></span></a>';
  var ADM_CARD='<a class="nj-adm-card" href="'+LINKS.adminhome+'" data-adm hidden>'+icon('shield')+'<span><b>لوحة الإدارة</b><small data-adm-sub>الموافقات وأرقام اليوم</small></span><span class="nj-adm-n" data-adm-n hidden></span></a>';
  var head=document.getElementById('nj-header');
  if(head){
    head.outerHTML='<header class="nj-head" id="nj-head"><div class="nj-in nj-bar">'
      +'<a class="nj-logo" href="'+LINKS.home+'"><img class="lg-day" src="assets/img/logo.svg?v=202611232030" alt="أكاديمية نجد" width="212" height="50"><img class="lg-night" src="assets/img/logo-light.svg?v=202611232030" alt="أكاديمية نجد" width="212" height="50"></a>'
      +'<nav class="nj-nav" aria-label="القائمة الرئيسية">'+navLinks()+'</nav>'
      +'<div class="nj-acts"><a class="nj-streak" id="nj-streak" href="'+LINKS.study+'" hidden>'+icon('peak')+'<b></b></a><button type="button" class="nj-ic" data-search aria-label="بحث وأوامر" title="بحث وأوامر">'+icon('search')+'</button>'+ADM_BTN+PREFS
      +'<a class="nj-btn nj-btn-line nj-btn-sm nj-guest" href="'+LINKS.login+'">تسجيل الدخول</a>'
      +'<a class="nj-btn nj-btn-fill nj-btn-sm nj-guest" href="'+LINKS.register+'">أنشئ حسابك</a>'
      +userBox
      +'<button type="button" class="nj-menu" id="nj-menu" aria-expanded="false" aria-controls="nj-drawer" aria-label="فتح القائمة"><i></i><i></i><i></i></button>'
      +'</div></div>'
      +'<div class="nj-drawer" id="nj-drawer">'+ADM_CARD+drawerLinks()+'<div class="nj-prefs">'+PREFS_LBL+'</div>'
      +userBox
      +'<a class="nj-btn nj-btn-fill nj-guest" href="'+LINKS.register+'">أنشئ حسابك</a>'
      +'<a class="nj-btn nj-btn-line nj-guest" href="'+LINKS.login+'">تسجيل الدخول</a>'
      +'</div></header><div class="nj-scrim" id="nj-scrim" aria-hidden="true"></div>';
  }
  function footCol(t,L){return '<div><h4>'+t+'</h4><nav class="nj-foot-links" aria-label="'+t+'">'+L.map(function(x){return '<a href="'+x[0]+'">'+x[1]+'</a>'}).join('')+'</nav></div>'}
  var foot=document.getElementById('nj-footer');
  if(foot){
    foot.outerHTML='<footer class="nj-foot"><div class="nj-in">'
      +'<div class="nj-foot-g">'
      +'<div><a class="nj-logo" href="'+LINKS.home+'"><img src="assets/img/logo-light.svg?v=202611232030" alt="أكاديمية نجد" width="242" height="57" loading="lazy"></a>'
      +'<p class="nj-foot-about">مبادرة تعليمية من طلاب لطلاب، تجمع لك في مكان واحد خطتك وجدولك ومعدلك وشروحات تساعدك تتقدم.</p></div>'
      +footCol('خطّط',[[LINKS.plans,'الخطط الدراسية'],[LINKS.schedule,'الجدول الدراسي'],[LINKS.nextterm,'وش أسجل الفصل الجاي؟'],[LINKS.calendar,'التقويم الأكاديمي']])
      +footCol('ذاكر',[[LINKS.study,'خطة المذاكرة'],[LINKS.quiz,'اختبر نفسك'],[LINKS.lessons,'الشروحات'],[LINKS.courses,'المقررات'],[LINKS.gpa,'حاسبة المعدل']])
      +footCol('اعرف',[[LINKS.guide,'دليل الطالب'],[LINKS.ratings,'تقييم الدكاترة'],[LINKS.coop,'التدريب التعاوني'],[LINKS.store,'المتجر']])
      +'<div><h4>حسابك</h4><nav class="nj-foot-links" aria-label="الحساب"><a class="nj-member" href="'+LINKS.account+'">حسابي</a><a class="nj-guest" href="'+LINKS.login+'">تسجيل الدخول</a><a class="nj-guest" href="'+LINKS.register+'">أنشئ حسابك</a><a class="nj-member" href="#" data-logout>تسجيل الخروج</a><a href="#" data-install>ثبّت التطبيق على جوالك</a></nav>'
      +'</div>'
      +'</div>'
      +'<div class="nj-foot-soc"><h4>تواصل معنا</h4>'+socialRow()+'</div>'+'<div class="nj-foot-bot"><div><p class="nj-love">صُنع بحب من طلاب جامعة الأمير مساعد بن عبدالرحمن.</p><p class="nj-disc">هذا الموقع جهد طلابي مستقل، ولا يتبع للجامعة بأي صلة.</p></div>'
      +'<p class="nj-copy"><a href="'+LINKS.privacy+'">سياسة الخصوصية</a> · <a href="'+LINKS.terms+'">الشروط والأحكام</a><br>© <span>'+new Date().getFullYear()+'</span> أكاديمية نجد. جميع الحقوق محفوظة.</p></div>'
      +'</div></footer>';
  }
  /* الشريط السفلي: يظهر بس داخل التطبيق المثبّت على الجوال (التنسيق في najd.css) */
  if(head!==null&&PAGE!=='admin'){
    /* «ذاكر» في النص يفتح جلسة تركيز، و«المعدل» صار داخل «المزيد» */
    var tab=function(k,t){return '<a href="'+LINKS[k]+'"'+cur(k)+'><i>'+icon(k)+'</i>'+t+'</a>';};
    var tb=document.createElement('nav');tb.className='nj-tabbar';tb.setAttribute('aria-label','التنقل السريع');
    tb.innerHTML=tab('home','الرئيسية')+tab('plans','خطتي')
      +'<a class="nj-tab-go" href="'+LINKS.study+'#focus"'+cur('study')+'><i>'+icon('focus')+'</i>ذاكر</a>'
      +tab('schedule','جدولي')
      +'<button type="button" data-tab-more aria-expanded="false" aria-controls="nj-drawer"><i>'+icon('more')+'</i>المزيد</button>';
    root.appendChild(tb);
  }
  /* الأسهم الفاضية في الصفحات (<span class="nj-arrow"></span>) نعبيها بأيقونة: أدق من رمز ← اللي يختلف مكانه من جهاز لجهاز */
  [].forEach.call(root.querySelectorAll('.nj-arrow:empty'),function(e){e.innerHTML=icon('arrow');e.setAttribute('aria-hidden','true');});
  var t=document.createElement('div');t.className='nj-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');root.appendChild(t);

  /* حقول التاريخ والوقت والأرقام: نخليها بالإنجليزي */
  function enInputs(scope){var ins=(scope||root).querySelectorAll('input[type=date],input[type=time],input[type=datetime-local],input[type=month],input[type=number]');for(var q=0;q<ins.length;q++){ins[q].setAttribute('lang','en');ins[q].setAttribute('dir','ltr');}}
  enInputs();

  /* منتقي تاريخ ووقت حديث (flatpickr) بدل أداة المتصفح، بالإنجليزي وبنفس ألوان الموقع */
  var FP_BASE='assets/vendor/flatpickr/',fpLoad=null;
  function loadFP(){
    if(window.flatpickr)return Promise.resolve();
    if(fpLoad)return fpLoad;
    fpLoad=new Promise(function(res,rej){
      var l=document.createElement('link');l.rel='stylesheet';l.href=FP_BASE+'flatpickr.min.css?v=4.6.13';document.head.appendChild(l);
      var sc=document.createElement('script');sc.src=FP_BASE+'flatpickr.min.js?v=4.6.13';sc.onload=function(){res();};sc.onerror=function(){fpLoad=null;rej();};document.head.appendChild(sc);
    });
    return fpLoad;
  }
  function fpOne(inp){
    if(inp.getAttribute('data-fp'))return;inp.setAttribute('data-fp','1');
    var isT=inp.type==='time';
    if(!inp.placeholder)inp.placeholder=isT?'اختر الوقت':'اختر التاريخ';
    window.flatpickr(inp,{altInput:true,disableMobile:true,dateFormat:isT?'H:i':'Y-m-d',altFormat:isT?'h:i K':'D, j M Y',enableTime:isT,noCalendar:isT,time_24hr:false,minuteIncrement:5,monthSelectorType:'static',locale:{firstDayOfWeek:0},
      onReady:function(_d,_s,fp){fp.calendarContainer.classList.add('nj-fp');var al=fp.altInput;al.setAttribute('dir','ltr');al.setAttribute('lang','en');al.classList.add('nj-fp-in');al.classList.add(isT?'is-time':'is-date');var lb=inp.getAttribute('aria-label');if(lb)al.setAttribute('aria-label',lb);var id=inp.id;if(id){var lab=document.querySelector('label[for="'+id+'"]');if(lab){al.id=id+'-alt';lab.setAttribute('for',al.id);}}}});
  }
  function fpScan(scope){
    var ins=(scope||root).querySelectorAll('input[type=date]:not([data-fp]),input[type=time]:not([data-fp])');
    if(!ins.length)return;
    loadFP().then(function(){for(var q=0;q<ins.length;q++)if(ins[q].isConnected)fpOne(ins[q]);}).catch(function(){});
  }
  /* لو تغيّرت القيمة من الكود (تعديل/مسح)، نحدّث المنتقي */
  window.NajdFP={sync:function(el){if(el&&el._flatpickr)el._flatpickr.setDate(el.value||null,false);}};
  root.addEventListener('reset',function(e){setTimeout(function(){var fs=e.target.querySelectorAll('[data-fp]');for(var q=0;q<fs.length;q++)window.NajdFP.sync(fs[q]);},0);},true);
  fpScan();
  try{new MutationObserver(function(ms){for(var q=0;q<ms.length;q++)for(var z=0;z<ms[q].addedNodes.length;z++){var nd=ms[q].addedNodes[z];if(nd.nodeType===1){enInputs(nd.parentNode||nd);fpScan(nd.parentNode||nd);}}}).observe(root,{childList:true,subtree:true});}catch(e){}

  /* القوائم المنسدلة: تفتح بالضغط أو بالمرور، وتقفل بالضغط برّا أو Esc */
  var dds=root.querySelectorAll('.nj-dd');
  function ddClose(ex){for(var d=0;d<dds.length;d++)if(dds[d]!==ex){if(dds[d]._unpin)dds[d]._unpin();dds[d].classList.remove('is-open');dds[d].querySelector('.nj-dd-btn').setAttribute('aria-expanded','false');}}
  function ddOpen(el,o){ddClose(el);el.classList.toggle('is-open',o);el.querySelector('.nj-dd-btn').setAttribute('aria-expanded',o?'true':'false');}
  for(var di=0;di<dds.length;di++)(function(el){var tm;
    var pinned=false;el._unpin=function(){pinned=false;};
    el.querySelector('.nj-dd-btn').addEventListener('click',function(){var o=el.classList.contains('is-open');if(o&&pinned){pinned=false;ddOpen(el,false);}else{pinned=true;ddOpen(el,true);}});
    el.addEventListener('mouseenter',function(){clearTimeout(tm);if(matchMedia('(hover:hover)').matches)ddOpen(el,true);});
    el.addEventListener('mouseleave',function(){if(pinned)return;tm=setTimeout(function(){el.classList.remove('is-open');el.querySelector('.nj-dd-btn').setAttribute('aria-expanded','false');},180);});
  })(dds[di]);
  document.addEventListener('click',function(e){if(!e.target.closest('.nj-dd'))ddClose();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=root.querySelector('.nj-dd.is-open');if(o){ddClose();o.querySelector('.nj-dd-btn').focus();}}});

  /* روابط بريد التواصل */
  var cs=root.querySelectorAll('[data-contact]');
  for(var ci=0;ci<cs.length;ci++){if(CONTACT_EMAIL){cs[ci].href='mailto:'+CONTACT_EMAIL;cs[ci].textContent=CONTACT_EMAIL;cs[ci].setAttribute('dir','ltr');}else{cs[ci].removeAttribute('href');cs[ci].textContent=(document.documentElement.lang==='en'?'(contact email coming soon)':'(بريد التواصل بيُضاف قريبًا)');}}

  /* القائمة في الجوال */
  var hd=document.getElementById('nj-head'),btn=document.getElementById('nj-menu');
  if(hd&&btn){
    var more=root.querySelector('[data-tab-more]');
    /* طول القائمة = المساحة الفعلية من تحت الهيدر لين فوق الشريط السفلي (تختلف بين الجوالات: النوتش وشريط الآيفون) */
    var drw=document.getElementById('nj-drawer');
    function fitDrawer(){if(!drw||!hd.classList.contains('is-open'))return;var tb=root.querySelector('.nj-tabbar'),vh=window.visualViewport?window.visualViewport.height:window.innerHeight,
      ts=tb&&getComputedStyle(tb),lim=ts&&ts.display!=='none'&&ts.position==='fixed'?tb.getBoundingClientRect().top:vh;
      drw.style.maxHeight=Math.max(160,Math.floor(lim-drw.getBoundingClientRect().top))+'px';}
    function menuSet(o){hd.classList.toggle('is-open',o);btn.setAttribute('aria-expanded',o?'true':'false');btn.setAttribute('aria-label',o?'إغلاق القائمة':'فتح القائمة');if(more)more.setAttribute('aria-expanded',o?'true':'false');
      if(o){fitDrawer();requestAnimationFrame(fitDrawer);}else if(drw)drw.style.maxHeight='';}
    window.addEventListener('resize',fitDrawer);if(window.visualViewport)window.visualViewport.addEventListener('resize',fitDrawer);
    btn.addEventListener('click',function(){menuSet(!hd.classList.contains('is-open'));});
    if(more)more.addEventListener('click',function(){menuSet(!hd.classList.contains('is-open'));});
    document.getElementById('nj-drawer').addEventListener('click',function(e){if(e.target.closest('a'))menuSet(false);});
    var scrim=document.getElementById('nj-scrim');if(scrim)scrim.addEventListener('click',function(){menuSet(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&hd.classList.contains('is-open')){menuSet(false);(more&&more.offsetParent&&document.activeElement===more?more:btn).focus();}});
  }

  /* روابط data-link داخل محتوى الصفحات */
  var as=root.querySelectorAll('[data-link]');
  for(var i=0;i<as.length;i++){var k=as[i].getAttribute('data-link');if(LINKS[k])as[i].setAttribute('href',LINKS[k]);}

  function phoneLocal(p){return p?String(p).replace(/^\+966/,'0'):'';}

  /* صفحات تحتاج تسجيل دخول: نعرض بطاقة دخول بدل المحتوى */
  var REQUIRED=root.getAttribute('data-auth')==='required';
  var PAGE_NAMES={plans:'الخطط الدراسية',schedule:'الجدول الدراسي',gpa:'حاسبة المعدل',lessons:'الشروحات',quiz:'الاختبارات',ratings:'تقييم الدكاترة',courses:'المقررات',guide:'دليل الطالب',calendar:'التقويم الأكاديمي',account:'حسابك',admin:'لوحة الإدارة',study:'خطة المذاكرة',nextterm:'وش أسجل الفصل الجاي؟'};
  if(REQUIRED){
    var main=root.querySelector('main');
    if(main){
      var nx=encodeURIComponent(location.pathname.split('/').pop()||'index.html');
      var g=document.createElement('section');g.className='nj-gate';
      g.innerHTML='<div class="nj-in"><div class="nj-gate-card">'
        +'<span class="nj-gate-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><rect x="4" y="10" width="16" height="11" rx="3" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></span>'
        +'<h2>سجّل دخولك عشان تفتح '+(PAGE_NAMES[PAGE]||'هذي الصفحة')+'</h2>'
        +'<p>هذي الصفحة تحتاج حساب. سجّل بحساب قوقل أو بإيميلك خلال دقيقة، ويتحفظ تقدمك في حسابك وترجع له من أي جهاز.</p>'
        +'<div class="nj-gate-ctas"><a class="nj-btn nj-btn-fill" href="'+LINKS.login+'?next='+nx+'">تسجيل الدخول</a><a class="nj-btn nj-btn-line" href="'+LINKS.coop+'#opp">تصفح فرص التدريب التعاوني</a></div>'
        +'<p class="nj-gate-note">التسجيل مجاني.</p>'
        +'</div></div>';
      main.parentNode.insertBefore(g,main);
    }
  }
  function lock(){if(REQUIRED)root.classList.toggle('nj-locked',!root.classList.contains('is-in'));}
  lock();

  /* المشرف: نعرض الدخول السريع للوحة الإدارة، ومعه عدد اللي ينتظر الموافقة */
  function setAdmin(on,n){
    on=!!on;root.classList.toggle('is-admin',on);
    var k=on&&n>0?n:0,el=root.querySelectorAll('[data-adm]'),ns=root.querySelectorAll('[data-adm-n]'),sb=root.querySelectorAll('[data-adm-sub]');
    for(var i=0;i<el.length;i++){el[i].hidden=!on;if(el[i].tagName==='A'&&el[i].classList.contains('nj-adm-btn'))el[i].setAttribute('aria-label',k?'لوحة الإدارة، '+k+' تنتظر موافقتك':'لوحة الإدارة');}
    for(var j=0;j<ns.length;j++){ns[j].hidden=!k;ns[j].textContent=k>99?'99+':String(k);}
    for(var m=0;m<sb.length;m++)sb[m].textContent=k?(k===1?'شي واحد ينتظر موافقتك':k===2?'شيئين ينتظرون موافقتك':k+(k<=10?' أشياء تنتظر موافقتك':' شي ينتظر موافقتك')):'الموافقات وأرقام اليوم';
    try{on?localStorage.setItem('najd_admin',JSON.stringify({n:k})):localStorage.removeItem('najd_admin');}catch(e){}
  }
  /* حالة الدخول: نعرضها فورًا من آخر حالة محفوظة، وبعدين Firebase يأكدها */
  function setUser(u){
    if(!u)setAdmin(false);
    root.classList.toggle('is-in',!!u);
    document.body.classList.toggle('logged-in',!!u);
    var name=u?(u.name||(u.email||'').split('@')[0]||phoneLocal(u.phone)||'طالب نجد'):'';
    var els=root.querySelectorAll('[data-u]');
    for(var j=0;j<els.length;j++){var f=els[j].getAttribute('data-u');if(f==='name')els[j].textContent=name;if(f==='init'){els[j].textContent=(name.trim().charAt(0)||'ن').toUpperCase();els[j].title=name;}}
    try{u?localStorage.setItem('najd_user',JSON.stringify({name:u.name||'',email:u.email||'',phone:u.phone||''})):localStorage.removeItem('najd_user');}catch(e){}
    lock();
    try{window.dispatchEvent(new CustomEvent('najd:auth',{detail:u||null}));}catch(e){}
  }
  try{var cached=JSON.parse(localStorage.getItem('najd_user')||'null');if(cached){setUser(cached);var ca=JSON.parse(localStorage.getItem('najd_admin')||'null');if(ca)setAdmin(true,+ca.n||0);}}catch(e){}
  root.addEventListener('click',function(e){var b=e.target.closest('[data-logout]');if(!b)return;e.preventDefault();if(window.NajdAuth)window.NajdAuth.logout();});

  /* رسالة قصيرة تحت. o.undo = زر «تراجع» بدل نافذة «متأكد؟» */
  var tt;function toast(m,o){
    t.textContent='';var sp=document.createElement('span');sp.textContent=m;t.appendChild(sp);
    var undo=o&&typeof o.undo==='function';t.classList.toggle('has-act',undo);
    if(undo){var b=document.createElement('button');b.type='button';b.className='nj-toast-act';b.textContent=(window.NajdT?window.NajdT('تراجع'):'تراجع');
      b.addEventListener('click',function(){clearTimeout(tt);t.classList.remove('is-on');o.undo();});t.appendChild(b);}
    t.classList.add('is-on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('is-on');},undo?5000:3200);}
  try{var fl=sessionStorage.getItem('najd_flash');if(fl){sessionStorage.removeItem('najd_flash');setTimeout(function(){toast(fl);},300);}}catch(e){}
  function setSync(txt){var els=root.querySelectorAll('[data-u="sync"]');for(var j=0;j<els.length;j++)els[j].textContent=txt;}

  /* شريط الإعلان أعلى الموقع (يجي من Firestore عن طريق auth.js) */
  function announce(a){
    if(!a||!a.active||!a.text)return;
    var key='najd_ann_'+(a.v||'0');
    try{if(localStorage.getItem('najd_ann_closed')===key)return;}catch(e){}
    var old=root.querySelector('.nj-ann');if(old)old.remove();
    var url=String(a.link||'').trim(),safe=/^https?:\/\//i.test(url)||/^[a-z0-9_-]+\.html(#[\w-]*)?$/i.test(url);
    var bar=document.createElement('div');bar.className='nj-ann nj-ann-'+(a.tone==='gold'?'gold':'teal');bar.setAttribute('role','region');bar.setAttribute('aria-label','إعلان');
    bar.innerHTML='<div class="nj-in"><p>'+esc(a.text)+(url&&safe?' <a href="'+esc(url)+'"'+(/^https?:/i.test(url)?' target="_blank" rel="noopener"':'')+'>'+esc(a.linkText||'التفاصيل')+' <span class="nj-arrow">'+icon('arrow')+'</span></a>':'')+'</p><button type="button" aria-label="إغلاق الإعلان">'+icon('close')+'</button></div>';
    bar.querySelector('button').addEventListener('click',function(){bar.remove();try{localStorage.setItem('najd_ann_closed',key);}catch(e){}});
    root.insertBefore(bar,root.firstChild);
  }

  /* ===== التطبيق: تثبيت الموقع في الجوال ويفتح بدون نت ===== */
  var ASSET_V=((document.currentScript&&document.currentScript.src)||'').split('v=')[1]||'';
  var UA=navigator.userAgent||'';
  var STANDALONE=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
  var IOS=/iPad|iPhone|iPod/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var MOBILE=IOS||/Android/i.test(UA);
  if(STANDALONE)document.documentElement.classList.add('is-app');
  if(!MOBILE){var fl=root.querySelectorAll('a[data-install]');for(var fi=0;fi<fl.length;fi++)fl[fi].textContent='ثبّت التطبيق على جهازك';}
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
  }
  var bip=null,offered=false;
  /* عرض «ثبّت التطبيق»: نحفظ آخر رد (dismissed/asked/installed) ووقته وكم مرة رد.
     لو قفله نرجع نعرضه بعد ٣٠ يوم، وبحد أقصى ٣ مرات. ولو ثبّته ما نعرضه أبد. */
  var PWA_WAIT=30*864e5,PWA_MAX=3;
  function pwaSave(o){try{localStorage.setItem('najd_pwa',JSON.stringify(o));}catch(e){}}
  function pwaState(){var v;try{v=localStorage.getItem('najd_pwa');}catch(e){return {s:'installed'};}
    if(!v)return null;
    if(v.charAt(0)!=='{'){var o={s:v,t:Date.now(),n:1};pwaSave(o);return o;}/* صيغة قديمة: نبدأ مدة الـ٣٠ يوم من الحين */
    try{return JSON.parse(v)||null;}catch(e){return null;}}
  function pwaMark(v){var o=pwaState()||{n:0};if(o.s==='installed')return;/* اللي ثبّته ما نرجع نسأله */pwaSave({s:v,t:Date.now(),n:v==='installed'?(o.n||0):(o.n||0)+1});}
  function pwaDue(){var o=pwaState();if(!o)return true;if(o.s==='installed')return false;return (o.n||1)<PWA_MAX&&Date.now()-(+o.t||0)>=PWA_WAIT;}
  function closeBanner(){var b=document.getElementById('nj-pwa');if(b)b.remove();}
  function howTo(){
    closeBanner();
    var old=document.getElementById('nj-sheet');if(old)old.remove();
    var steps=IOS
      ?[[icon('share'),'اضغط زر المشاركة','أسفل الشاشة في سفاري (أو أعلاها في الآيباد).'],[icon('addbox'),'اختر «إضافة إلى الشاشة الرئيسية»','انزل شوي في القائمة إذا ما شفته.'],[icon('check'),'اضغط «إضافة»','وتطلع أيقونة «نجد» في جوالك.']]
      :MOBILE?[[icon('phone'),'افتح قائمة المتصفح ⋮','أعلى الشاشة في كروم.'],[icon('addbox'),'اختر «تثبيت التطبيق»','أو «إضافة إلى الشاشة الرئيسية».'],[icon('check'),'اضغط «تثبيت»','وتطلع أيقونة «نجد» في جوالك.']]
      :[[icon('addbox'),'افتح الموقع في كروم أو إيدج',''],[icon('phone'),'اضغط أيقونة التثبيت','في آخر شريط العنوان، أو من القائمة ⋮ ← «تثبيت».'],[icon('check'),'اضغط «تثبيت»','ويفتح الموقع في نافذة لحاله.']];
    var s=document.createElement('div');s.className='nj-sheet';s.id='nj-sheet';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label','ثبّت التطبيق');
    s.innerHTML='<div class="nj-sheet-box"><button type="button" class="nj-sheet-x" data-sheet-x aria-label="إغلاق">'+icon('close')+'</button>'
      +'<div class="nj-sheet-h"><img src="assets/img/icon-192.png" alt="" width="52" height="52"><div><b>'+(MOBILE?'ثبّت «نجد» على جوالك':'ثبّت «نجد» على جهازك')+'</b><small>ويفتح بضغطة مثل أي تطبيق، حتى بدون نت للجدول والخطة والمعدل.</small></div></div>'
      +'<ol class="nj-steps">'+steps.map(function(x){return '<li><span class="nj-step-ic">'+x[0]+'</span><span><b>'+x[1]+'</b>'+(x[2]?'<small>'+x[2]+'</small>':'')+'</span></li>';}).join('')+'</ol>'
      +'<button type="button" class="nj-btn nj-btn-fill" data-sheet-x style="width:100%">تمام</button></div>';
    root.appendChild(s);s.querySelector('.nj-sheet-x').focus();
  }
  function install(){
    if(STANDALONE){toast('التطبيق مثبّت عندك');return;}
    if(bip){bip.prompt();bip.userChoice.then(function(r){pwaMark(r&&r.outcome==='accepted'?'installed':'dismissed');bip=null;closeBanner();}).catch(function(){});return;}
    pwaMark('asked');howTo();
  }
  function offer(){
    if(offered||STANDALONE||!pwaDue()||PAGE==='admin'||(!bip&&!IOS))return;
    offered=true;var tries=0;
    setTimeout(function show(){
      if(document.getElementById('nj-pwa')||STANDALONE)return;
      if(document.querySelector('.nj-sheet')){if(++tries<20)setTimeout(show,3000);return;}
      var b=document.createElement('div');b.className='nj-pwa';b.id='nj-pwa';b.setAttribute('role','region');b.setAttribute('aria-label','ثبّت التطبيق');
      b.innerHTML='<img src="assets/img/icon-192.png" alt="" width="48" height="48"><div><b>'+(MOBILE?'ثبّت أكاديمية نجد':'ثبّت أكاديمية نجد على جهازك')+'</b><small>'+(MOBILE?'افتحه من شاشة جوالك مثل أي تطبيق':'يفتح في نافذة لحاله مثل أي برنامج')+'</small></div>'
        +'<button type="button" class="nj-btn nj-btn-fill nj-btn-sm" data-install>'+(bip?'ثبّت':'كيف؟')+'</button><button type="button" class="nj-pwa-x" data-pwa-x aria-label="لا شكرًا">'+icon('close')+'</button>';
      root.appendChild(b);
    },3500);
  }
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();bip=e;offer();});
  window.addEventListener('appinstalled',function(){pwaMark('installed');closeBanner();});
  if(IOS)offer();
  root.addEventListener('click',function(e){
    if(e.target.closest('[data-install]')){e.preventDefault();install();return;}
    if(e.target.closest('[data-pwa-x]')){pwaMark('dismissed');closeBanner();return;}
    var sx=e.target.closest('[data-sheet-x]');if(sx||e.target.id==='nj-sheet'){var sh=document.getElementById('nj-sheet');if(sh)sh.remove();}
  });

  /* ===== أيام المذاكرة المتتالية =====
     أي نشاط دراسي في اليوم يحسبه: جلسة من خطة المذاكرة تخلصها، أو جلسة تركيز، أو تحدي اليوم، أو اختبار. فتح الموقع لحاله ما يحسب.
     najd_act_v1 = {d:{"YYYY-MM-DD":{f:دقائق التركيز, c:تحدي اليوم, q:عدد الاختبارات}}} (يتزامن مع الحساب)
     وجلسات الخطة من najd_study_v1.done: القيمة وقت ما خلصت (والقديم 1 = نحسبه بتاريخ الجلسة نفسها) */
  var ACT='najd_act_v1';
  function ymdL(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  function actGet(){var a=null;try{a=JSON.parse(localStorage.getItem(ACT)||'null');}catch(e){}if(!a||typeof a!=='object')a={};if(!a.d||typeof a.d!=='object')a.d={};return a;}
  function actLog(kind,n){
    var a=actGet(),k=ymdL(new Date()),x=a.d[k]=(a.d[k]&&typeof a.d[k]==='object')?a.d[k]:{};x[kind]=(+x[kind]||0)+(+n||1);
    var ks=Object.keys(a.d).sort();while(ks.length>120)delete a.d[ks.shift()];
    try{localStorage.setItem(ACT,JSON.stringify(a));}catch(e){}
    streakBadge();
  }
  function actDays(){
    var have={},a=actGet();Object.keys(a.d).forEach(function(k){if(/^\d{4}-\d{2}-\d{2}$/.test(k))have[k]=1;});
    var s=null;try{s=JSON.parse(localStorage.getItem('najd_study_v1')||'null');}catch(e){}
    var done=(s&&s.done)||{};
    Object.keys(done).forEach(function(id){var v=done[id],k=(typeof v==='number'&&v>1e12)?ymdL(new Date(v)):String(id).replace(/^m\|/,'').slice(0,10);if(/^\d{4}-\d{2}-\d{2}$/.test(k))have[k]=1;});
    return have;
  }
  /* n = الأيام المتتالية لين اليوم (ولو اليوم للحين ما ذاكر، لين أمس عشان ما تنقطع قبل يخلص يومه)، week = أيام هذا الأسبوع من الأحد */
  function streak(now){
    now=now||new Date();var have=actDays(),d=new Date(now);d.setHours(12,0,0,0);
    var today=ymdL(d),on=!!have[today],n=0;if(!on)d.setDate(d.getDate()-1);
    while(have[ymdL(d)]){n++;d.setDate(d.getDate()-1);}
    var ws=new Date(now);ws.setHours(12,0,0,0);ws.setDate(ws.getDate()-ws.getDay());var week=[];
    for(var i=0;i<7;i++){var w=new Date(ws);w.setDate(ws.getDate()+i);var k=ymdL(w);week.push({date:k,on:!!have[k],today:k===today,future:k>today});}
    return {n:n,today:on,week:week};
  }
  function daysTxt(n){var en=document.documentElement.lang==='en';return en?(n===1?'1 day':n+' days'):(n===1?'يوم':n===2?'يومين':n<=10?n+' أيام':n+' يوم');}
  function streakBadge(){
    var b=document.getElementById('nj-streak');if(!b)return;var sk=streak(),en=document.documentElement.lang==='en';
    b.hidden=!sk.n;root.classList.toggle('has-streak',!!sk.n);if(!sk.n)return;
    b.querySelector('b').textContent=sk.n;b.classList.toggle('is-today',sk.today);
    var lbl=en?daysTxt(sk.n)+' in a row'+(sk.today?'':'. Study today to keep it going'):(sk.n===1?'يوم واحد ذاكرت فيه':daysTxt(sk.n)+' متتالية تذاكر فيها')+(sk.today?'':'. ذاكر اليوم عشان تكمل');
    b.setAttribute('aria-label',lbl);b.title=lbl;
  }
  streakBadge();
  ['najd:dirty','storage','pageshow','najd:auth-ready'].forEach(function(ev){window.addEventListener(ev,function(){setTimeout(streakBadge,30);});});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)streakBadge();});
  window.NajdAct={KEY:ACT,log:actLog,streak:streak,days:actDays,ymd:ymdL,daysTxt:daysTxt};

  /* ===== «أضف لتقويم جوالك» (ملف ics) =====
     آيفون في سفاري: نفتح الملف نفسه، وسفاري يعرض «إضافة الكل» (روابط data: صار سفاري يمنعها).
     آيفون داخل التطبيق المثبّت: نافذة المشاركة بالملف. غير الآيفون: ينزل الملف ويفتحه التقويم.
     يرجع 'open' أو 'share' أو 'file' عشان الصفحة تكتب التعليمات المناسبة. */
  function addToCalendar(ics,name){
    var blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}),ios=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform));
    if(ios){
      if(STANDALONE){try{var f=new File([blob],name,{type:'text/calendar'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f]}).catch(function(){});return 'share';}}catch(e){}}
      var u=URL.createObjectURL(blob);window.location.href=u;setTimeout(function(){URL.revokeObjectURL(u);},60000);return 'open';
    }
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);return 'file';
  }

  /* الأزرار اللي تختار وحدة من مجموعة (nj-seg): التظليل ينتقل أول ما يلمس الإصبع، بدل ما ينتظر نهاية اللمسة */
  root.addEventListener('pointerdown',function(e){
    if(e.button>0)return;var b=e.target.closest('.nj-seg>button[aria-pressed]');if(!b||b.disabled)return;
    var g=b.parentNode,on=g.querySelectorAll(':scope>button[aria-pressed="true"]');if(on.length!==1||on[0]===b)return;
    var prev=on[0];prev.setAttribute('aria-pressed','false');b.setAttribute('aria-pressed','true');
    var undo=function(){if(b.getAttribute('aria-pressed')==='true'&&prev.getAttribute('aria-pressed')==='false'){b.setAttribute('aria-pressed','false');prev.setAttribute('aria-pressed','true');}};
    b.addEventListener('pointercancel',undo,{once:true});
  });

  /* ===== البحث في الموقع: المقررات وأعضاء هيئة التدريس والأدوات ===== */
  var sxData=null;
  function loadScript(src){return new Promise(function(res){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=res;document.head.appendChild(s);});}
  function sxLoad(){
    if(sxData)return sxData;
    var need=[];
    if(!window.NAJD_COURSES)need.push(loadScript('assets/js/courses-data.js?v='+ASSET_V));
    if(!window.NAJD_FACULTY)need.push(loadScript('assets/js/faculty-data.js?v='+ASSET_V));
    sxData=Promise.all(need);return sxData;
  }
  function norm(s){return String(s||'').toLowerCase().replace(/[ً-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/\s+/g,' ').trim();}
  /* -1 = ما يطابق. وكل ما صغر الرقم كان أقرب: كلمة مطابقة تمامًا، ثم كلمة تبدأ بالبحث، ثم يحتويه */
  function hit(q,hay){var h=norm(hay),toks=h.split(/[\s·.،-]+/),w=q.split(' '),sc=0;
    for(var i=0;i<w.length;i++){if(!w[i])continue;if(h.indexOf(w[i])<0)return -1;
      sc+=toks.indexOf(w[i])>-1?0:toks.some(function(x){return x.indexOf(w[i])===0;})?1:2;}
    return sc;}
  var EN=function(){return document.documentElement.lang==='en';};
  var TT=function(s){return window.NajdT?window.NajdT(s):s;};
  var PAGES_SX=['plans','schedule','study','gpa','nextterm','calendar','courses','guide','lessons','quiz','ratings','coop','store'];
  /* أوامر سريعة (شريط «/»): [الأيقونة، الأمر، الوصف، الرابط، كلمات البحث] */
  var CMDS=[['focus','ابدأ مذاكرة','جلسة تركيز بعدّاد',LINKS.study+'#focus','ذاكر مذاكره ركز تركيز جلسه study focus'],
    ['bolt','تحدي اليوم','٣ أسئلة سريعة تكمّل أيامك',LINKS.quiz+'?challenge=1','تحدي اسئله سوال challenge'],
    ['calendar','أضف اختبار','ميدتيرم أو فاينل في جدولك',LINKS.schedule+'#ex','اختبار امتحان ميد فاينل exam'],
    ['plans','علّم مقرر خلصته','في خطتك الدراسية',LINKS.plans,'علم خلصت مقرر ماده خطه plan'],
    ['gpa','احسب معدلي','الفصلي والتراكمي',LINKS.gpa,'معدل gpa احسب'],
    ['target','راجع أخطائي','الأسئلة اللي غلطت فيها',LINKS.quiz+'?review=all','اخطاء غلط مراجعه دفتر mistakes']];
  function sxItem(href,lead,title,sub,ltr){return '<a class="nj-sx-it" role="option" href="'+href+'"><span class="nj-sx-lead"'+(ltr?' dir="ltr"':'')+'>'+lead+'</span><span class="nj-sx-tx"><b data-no-i18n>'+esc(title)+'</b>'+(sub?'<small data-no-i18n>'+esc(sub)+'</small>':'')+'</span></a>';}
  function sxRender(raw){
    var box=document.getElementById('nj-sx-res'),q=norm(raw),qc=String(raw||'').replace(/\s+/g,'').toUpperCase(),o='';
    var cmds=(root.classList.contains('is-admin')?[['shield','لوحة الإدارة','للمشرفين: الموافقات وأرقام اليوم',LINKS.adminhome,'اداره لوحه مشرف ادمن admin']]:[]).concat(CMDS).filter(function(c){return !q||hit(q,c[1]+' '+c[2]+' '+c[4]+' '+TT(c[1]))>-1;}).slice(0,q?3:6);
    if(cmds.length)o+='<p class="nj-sx-h">'+TT('أوامر سريعة')+'</p>'+cmds.map(function(c){return sxItem(c[3],icon(c[0]),TT(c[1]),TT(c[2]));}).join('');
    var tools=PAGES_SX.filter(function(k){return !q||hit(q,ITEMS[k][1]+' '+ITEMS[k][2]+' '+TT(ITEMS[k][1]))>-1;}).slice(0,q?4:9);
    if(tools.length)o+='<p class="nj-sx-h">'+TT('الأدوات')+'</p>'+tools.map(function(k){return sxItem(LINKS[k],icon(ITEMS[k][0]),TT(ITEMS[k][1]),TT(ITEMS[k][2]));}).join('');
    if(q){
      var cs=(window.NAJD_COURSES||[]).map(function(c){var r=c[0].indexOf(qc)===0?0:hit(q,c[0]+' '+c[1]+' '+c[2]);return [r,c];}).filter(function(x){return x[0]>-1;}).sort(function(a,b){return a[0]-b[0];}).slice(0,8);
      if(cs.length)o+='<p class="nj-sx-h">'+TT('المقررات')+'</p>'+cs.map(function(x){var c=x[1];return sxItem('c/'+encodeURIComponent(c[0])+'.html','<span class="nj-sx-code">'+esc(c[0])+'</span>',EN()?c[2]:c[1],TT('التفاصيل وتجارب الطلاب'));}).join('');
      var D=window.NAJD_DEPTS||{},B=window.NAJD_BRANCHES||{};
      var fs=(window.NAJD_FACULTY||[]).map(function(f){return [hit(q,f[1]+' '+f[2]+' '+f[6]),f];}).filter(function(x){return x[0]>-1;}).sort(function(a,b){return a[0]-b[0];}).slice(0,8);
      if(fs.length)o+='<p class="nj-sx-h">'+TT('الدكاترة')+'</p>'+fs.map(function(x){var f=x[1];return sxItem('ratings.html?tab=inst&i='+encodeURIComponent(f[0]),icon('user'),EN()&&f[2]?f[2]:f[1],[TT(D[f[3]]||''),B[f[5]]?TT('فرع '+B[f[5]]):''].filter(Boolean).join(' · '));}).join('');
      if(!cs.length&&!fs.length&&!tools.length&&!cmds.length)o='<div class="nj-sx-none"><b>'+TT('ما لقينا نتيجة')+'</b><small>'+TT('جرّب رمز المقرر مثل ACCT201، أو جزء من اسم الدكتور.')+'</small></div>';
    }
    box.innerHTML=o;sxActive=-1;
  }
  var sxActive=-1,sxLast=null;
  function sxOpen(){
    var w=document.getElementById('nj-sx');
    if(!w){
      w=document.createElement('div');w.className='nj-sx';w.id='nj-sx';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.setAttribute('aria-label','بحث وأوامر');
      w.innerHTML='<div class="nj-sx-box"><div class="nj-sx-top">'+icon('search')+'<input id="nj-sx-q" class="nj-sx-in" type="search" autocomplete="off" enterkeyhint="search" placeholder="ابحث أو اكتب أمر: ذاكر، معدل، STAT…" aria-label="بحث" aria-controls="nj-sx-res"><button type="button" class="nj-sx-x" data-sx-x aria-label="إغلاق">'+icon('close')+'</button></div><div class="nj-sx-res" id="nj-sx-res" role="listbox"></div><p class="nj-sx-tip">'+TT('اضغط / من الكيبورد عشان تفتح البحث بسرعة')+'</p></div>';
      root.appendChild(w);
      var inp=w.querySelector('#nj-sx-q'),tm;
      inp.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){sxLoad().then(function(){sxRender(inp.value);});},90);});
      inp.addEventListener('keydown',function(e){
        var its=w.querySelectorAll('.nj-sx-it');
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!its.length)return;sxActive=(sxActive+(e.key==='ArrowDown'?1:-1)+its.length)%its.length;for(var i=0;i<its.length;i++)its[i].classList.toggle('is-on',i===sxActive);its[sxActive].scrollIntoView({block:'nearest'});}
        if(e.key==='Enter'){var it=its[sxActive>-1?sxActive:0];if(it){e.preventDefault();location.href=it.getAttribute('href');}}
      });
      w.addEventListener('click',function(e){if(e.target===w||e.target.closest('[data-sx-x]'))sxClose();});
    }
    sxLast=document.activeElement;w.hidden=false;document.documentElement.classList.add('nj-noscroll');
    var q=w.querySelector('#nj-sx-q');q.value='';sxRender('');sxLoad();setTimeout(function(){q.focus();},30);
  }
  function sxClose(){var w=document.getElementById('nj-sx');if(!w||w.hidden)return;w.hidden=true;document.documentElement.classList.remove('nj-noscroll');if(sxLast&&sxLast.focus)sxLast.focus();}
  root.addEventListener('click',function(e){if(e.target.closest('[data-search]')){e.preventDefault();sxOpen();}});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){sxClose();var sh=document.getElementById('nj-sheet');if(sh)sh.remove();}
    var tag=(e.target&&e.target.tagName)||'';
    if((e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(tag)&&!(e.target&&e.target.isContentEditable))||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();sxOpen();}
  });

  /* ===== جرّب بدون تسجيل: الأدوات تشتغل للزائر وتنحفظ في جهازه ===== */
  if(root.getAttribute('data-auth')==='guest'){
    var mainEl=root.querySelector('main');
    if(mainEl){
      var gb=document.createElement('div');gb.className='nj-guest nj-guestbar';
      var nx2=encodeURIComponent(location.pathname.split('/').pop()||'index.html');
      gb.innerHTML='<div class="nj-guestbar-in"><span class="nj-guestbar-ic">'+icon('cloud')+'</span><p><b>تستخدم الأداة بدون حساب.</b> بياناتك محفوظة في هذا الجهاز بس. سجّل دخول عشان تنحفظ في حسابك وتفتحها من أي جهاز.</p><a class="nj-btn nj-btn-fill nj-btn-sm" href="'+LINKS.register+'?next='+nx2+'">أنشئ حساب مجاني</a><a class="nj-btn nj-btn-line nj-btn-sm" href="'+LINKS.login+'?next='+nx2+'">دخول</a></div>';
      var host=mainEl.querySelector('.nj-in')||mainEl;host.insertBefore(gb,host.firstChild);
    }
  }

  window.Najd={setAdmin:setAdmin,calendar:addToCalendar,search:function(){sxOpen();},install:install,LINKS:LINKS,SYNC_KEYS:SYNC_KEYS,META:META,setUser:setUser,toast:toast,icon:icon,setSync:setSync,esc:esc,announce:announce};

  /* ظهور العناصر والعدادات */
  var rv=root.querySelectorAll('.nj-rv');
  function count(el){var to=+el.getAttribute('data-count'),s=null;function step(ts){if(!s)s=ts;var p=Math.min(1,(ts-s)/1100);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;en.target.classList.add('is-vis');var cs=en.target.querySelectorAll('[data-count]');for(var j=0;j<cs.length;j++)count(cs[j]);io.unobserve(en.target);});},{threshold:.15});
    for(var r=0;r<rv.length;r++)io.observe(rv[r]);
  }else{for(var r2=0;r2<rv.length;r2++)rv[r2].classList.add('is-vis');}
})();
