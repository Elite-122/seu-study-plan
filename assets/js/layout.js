/* أكاديمية نجد — الهيدر والفوتر المشتركين، وتتبع التغييرات للمزامنة.
   هذا الملف لازم ينحمّل قبل سكربتات الأدوات (الخطط، الجدول، المعدل). */
(function(){
  var root=document.getElementById('najd');if(!root)return;

  /* روابط الصفحات — عدّلها هنا لو غيّرت أسماء الملفات */
  var LINKS={home:'index.html',plans:'plans.html',schedule:'schedule.html',gpa:'gpa.html',lessons:'lessons.html',login:'login.html',register:'register.html',coop:'coop.html',store:'store.html',admin:'admin.html',privacy:'privacy.html',terms:'terms.html',quiz:'quiz.html',calendar:'calendar.html',ratings:'ratings.html',account:'account.html',college:'college-plans.html'};
  /* بريد التواصل (يظهر في سياسة الخصوصية والشروط) — اكتبه هنا */
  /* حساب تيليقرام */
  var TELEGRAM_URL='https://t.me/najdacdemy';
  var CONTACT_EMAIL='najdacdemy@gmail.com';
  var NAV=[['plans','الخطط'],['schedule','الجدول'],['gpa','المعدل'],['lessons','الشروحات'],['quiz','اختبر نفسك'],['ratings','التقييمات'],['calendar','التقويم'],['coop','التدريب'],['store','المتجر']];
  var PAGE=root.getAttribute('data-page')||'';

  /* المفاتيح اللي تنحفظ في حسابك وتتزامن بين أجهزتك */
  var SYNC_KEYS=['najd_plans_v1','najd_gpa_v1','stq_schedule_v1','najd_quiz_v1'];
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
  function navLinks(){return NAV.map(function(n){return '<a href="'+LINKS[n[0]]+'"'+(PAGE===n[0]?' aria-current="page"':'')+'>'+n[1]+'</a>';}).join('');}
  var userBox='<div class="nj-user nj-member"><a class="nj-av" href="account.html" data-u="init" aria-label="حسابي">ن</a><span><span class="nj-uname" data-u="name"></span><span class="nj-sync" data-u="sync">تقدمك محفوظ في حسابك</span></span><button type="button" class="nj-out" data-logout>خروج</button></div>';

  /* الوضع الداكن/الفاتح واللغة */
  var SUN='<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var MOON='<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  var PREFS='<button type="button" class="nj-ic" data-theme-toggle aria-label="تبديل الوضع الداكن" title="الوضع الداكن / الفاتح">'+MOON+SUN+'</button>';
  var PREFS_LBL='<button type="button" class="nj-ic" data-theme-toggle>'+MOON+SUN+'<span>الوضع الداكن / الفاتح</span></button>';
  function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('najd_theme',t);}catch(e){}var mc=document.querySelector('meta[name=theme-color]');if(mc)mc.setAttribute('content',t==='dark'?'#0F1817':'#2F4F4E');}
  if(!document.documentElement.getAttribute('data-theme')){var t0='light';try{if(localStorage.getItem('najd_theme')==='dark')t0='dark';}catch(e){}document.documentElement.setAttribute('data-theme',t0);}
  root.addEventListener('click',function(e){if(e.target.closest('[data-theme-toggle]'))setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');});

  var head=document.getElementById('nj-header');
  if(head){
    head.outerHTML='<header class="nj-head" id="nj-head"><div class="nj-in nj-bar">'
      +'<a class="nj-logo" href="'+LINKS.home+'"><img class="lg-day" src="assets/img/logo.svg" alt="أكاديمية نجد" width="184" height="45"><img class="lg-night" src="assets/img/logo-light.svg" alt="أكاديمية نجد" width="184" height="45"></a>'
      +'<nav class="nj-nav" aria-label="القائمة الرئيسية">'+navLinks()+'</nav>'
      +'<div class="nj-acts">'+PREFS
      +'<a class="nj-btn nj-btn-line nj-btn-sm nj-guest" href="'+LINKS.login+'">تسجيل الدخول</a>'
      +'<a class="nj-btn nj-btn-fill nj-btn-sm nj-guest" href="'+LINKS.register+'">أنشئ حسابك</a>'
      +userBox
      +'<button type="button" class="nj-menu" id="nj-menu" aria-expanded="false" aria-controls="nj-drawer" aria-label="فتح القائمة"><i></i><i></i><i></i></button>'
      +'</div></div>'
      +'<div class="nj-drawer" id="nj-drawer">'+navLinks()+'<div class="nj-prefs">'+PREFS_LBL+'</div>'
      +userBox
      +'<a class="nj-btn nj-btn-fill nj-guest" href="'+LINKS.register+'">أنشئ حسابك</a>'
      +'<a class="nj-btn nj-btn-line nj-guest" href="'+LINKS.login+'">تسجيل الدخول</a>'
      +'</div></header>';
  }
  var foot=document.getElementById('nj-footer');
  if(foot){
    foot.outerHTML='<footer class="nj-foot"><div class="nj-in">'
      +'<div class="nj-foot-g">'
      +'<div><a class="nj-logo" href="'+LINKS.home+'"><img src="assets/img/logo-light.svg" alt="أكاديمية نجد" width="204" height="50" loading="lazy"></a>'
      +'<p class="nj-foot-about">مبادرة تعليمية من طلاب لطلاب، تجمع لك في مكان واحد خطتك وجدولك ومعدلك وشروحات تساعدك تتقدم.</p></div>'
      +'<div><h4>الأدوات</h4><nav class="nj-foot-links" aria-label="الأدوات"><a href="'+LINKS.plans+'">الخطط الدراسية</a><a href="'+LINKS.schedule+'">الجدول الدراسي</a><a href="'+LINKS.gpa+'">حاسبة المعدل</a><a href="'+LINKS.quiz+'">اختبر نفسك</a><a href="'+LINKS.ratings+'">تقييم المقررات والأعضاء</a><a href="'+LINKS.calendar+'">التقويم الأكاديمي</a><a href="'+LINKS.coop+'">التدريب التعاوني</a><a href="'+LINKS.store+'">المتجر</a><a href="'+LINKS.college+'">خطط كلية العلوم الإدارية والمالية</a></nav></div>'
      +'<div><h4>حسابك</h4><nav class="nj-foot-links" aria-label="الحساب"><a class="nj-member" href="'+LINKS.account+'">حسابي</a><a href="'+LINKS.lessons+'">الشروحات</a><a class="nj-guest" href="'+LINKS.login+'">تسجيل الدخول</a><a class="nj-guest" href="'+LINKS.register+'">أنشئ حسابك</a><a class="nj-member" href="#" data-logout>تسجيل الخروج</a></nav>'
      +'<h4 class="nj-foot-h2">تواصل معنا</h4><nav class="nj-foot-links nj-foot-social" aria-label="تواصل معنا"><a href="'+TELEGRAM_URL+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 3.2 2.9 10.5c-.9.4-.9 1.1 0 1.400l4.700 1.500 1.800 5.600c.2.600.800.700 1.200.300l2.600-2.500 4.700 3.500c.6.400 1.200.200 1.400-.600L22.800 4.400c.2-1-.4-1.500-1.200-1.200zM9.700 13.800l8.100-5.800-6.300 6.700-.3 3.100z"/></svg>تيليقرام</a>'+(CONTACT_EMAIL?'<a href="mailto:'+CONTACT_EMAIL+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.500l8 6 8-6"/></svg><span dir="ltr">'+CONTACT_EMAIL+'</span></a>':'')+'</nav></div>'
      +'</div>'
      +'<div class="nj-foot-bot"><div><p class="nj-love">صُنع بحب 🤍 من طلاب جامعة الأمير مساعد بن عبدالرحمن.</p><p class="nj-disc">هذا الموقع جهد فردي ولا يتبع للجامعة بأي صلة.</p></div>'
      +'<p class="nj-copy"><a href="'+LINKS.privacy+'">سياسة الخصوصية</a> · <a href="'+LINKS.terms+'">الشروط والأحكام</a><br>© <span>'+new Date().getFullYear()+'</span> أكاديمية نجد. جميع الحقوق محفوظة.</p></div>'
      +'</div></footer>';
  }
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

  /* روابط بريد التواصل */
  var cs=root.querySelectorAll('[data-contact]');
  for(var ci=0;ci<cs.length;ci++){if(CONTACT_EMAIL){cs[ci].href='mailto:'+CONTACT_EMAIL;cs[ci].textContent=CONTACT_EMAIL;cs[ci].setAttribute('dir','ltr');}else{cs[ci].removeAttribute('href');cs[ci].textContent=(document.documentElement.lang==='en'?'(contact email coming soon)':'(بريد التواصل بيُضاف قريبًا)');}}

  /* القائمة في الجوال */
  var hd=document.getElementById('nj-head'),btn=document.getElementById('nj-menu');
  if(hd&&btn){
    btn.addEventListener('click',function(){var o=hd.classList.toggle('is-open');btn.setAttribute('aria-expanded',o?'true':'false');btn.setAttribute('aria-label',o?'إغلاق القائمة':'فتح القائمة');});
    document.getElementById('nj-drawer').addEventListener('click',function(e){if(e.target.closest('a'))hd.classList.remove('is-open');});
  }

  /* روابط data-link داخل محتوى الصفحات */
  var as=root.querySelectorAll('[data-link]');
  for(var i=0;i<as.length;i++){var k=as[i].getAttribute('data-link');if(LINKS[k])as[i].setAttribute('href',LINKS[k]);}

  function phoneLocal(p){return p?String(p).replace(/^\+966/,'0'):'';}

  /* صفحات تحتاج تسجيل دخول: نعرض بطاقة دخول بدل المحتوى */
  var REQUIRED=root.getAttribute('data-auth')==='required';
  var PAGE_NAMES={plans:'الخطط الدراسية',schedule:'الجدول الدراسي',gpa:'حاسبة المعدل',lessons:'الشروحات',quiz:'الاختبارات',ratings:'التقييمات',account:'حسابك',admin:'لوحة الإدارة'};
  if(REQUIRED){
    var main=root.querySelector('main');
    if(main){
      var nx=encodeURIComponent(location.pathname.split('/').pop()||'index.html');
      var g=document.createElement('section');g.className='nj-gate';
      g.innerHTML='<div class="nj-in"><div class="nj-gate-card">'
        +'<span class="nj-gate-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><rect x="4" y="10" width="16" height="11" rx="3" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></span>'
        +'<h2>سجّل دخولك عشان تستخدم '+(PAGE_NAMES[PAGE]||'هذي الخدمة')+'</h2>'
        +'<p>كل خدمات أكاديمية نجد تحتاج حساب. سجّل بحساب Gmail أو بريدك خلال دقيقة، ويتحفظ تقدمك في حسابك وترجع له من أي جهاز.</p>'
        +'<div class="nj-gate-ctas"><a class="nj-btn nj-btn-fill" href="'+LINKS.login+'?next='+nx+'">تسجيل الدخول</a><a class="nj-btn nj-btn-line" href="'+LINKS.coop+'">تصفح فرص التدريب التعاوني</a></div>'
        +'<p class="nj-gate-note">التسجيل مجاني.</p>'
        +'</div></div>';
      main.parentNode.insertBefore(g,main);
    }
  }
  function lock(){if(REQUIRED)root.classList.toggle('nj-locked',!root.classList.contains('is-in'));}
  lock();

  /* حالة الدخول: نعرضها فورًا من آخر حالة محفوظة، وبعدين Firebase يأكدها */
  function setUser(u){
    root.classList.toggle('is-in',!!u);
    document.body.classList.toggle('logged-in',!!u);
    var name=u?(u.name||(u.email||'').split('@')[0]||phoneLocal(u.phone)||'طالب نجد'):'';
    var els=root.querySelectorAll('[data-u]');
    for(var j=0;j<els.length;j++){var f=els[j].getAttribute('data-u');if(f==='name')els[j].textContent=name;if(f==='init'){els[j].textContent=(name.trim().charAt(0)||'ن').toUpperCase();els[j].title=name;}}
    try{u?localStorage.setItem('najd_user',JSON.stringify({name:u.name||'',email:u.email||'',phone:u.phone||''})):localStorage.removeItem('najd_user');}catch(e){}
    lock();
    try{window.dispatchEvent(new CustomEvent('najd:auth',{detail:u||null}));}catch(e){}
  }
  try{var cached=JSON.parse(localStorage.getItem('najd_user')||'null');if(cached)setUser(cached);}catch(e){}
  root.addEventListener('click',function(e){var b=e.target.closest('[data-logout]');if(!b)return;e.preventDefault();if(window.NajdAuth)window.NajdAuth.logout();});

  var tt;function toast(m){t.textContent=m;t.classList.add('is-on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('is-on');},3200);}
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
    bar.innerHTML='<div class="nj-in"><p>'+esc(a.text)+(url&&safe?' <a href="'+esc(url)+'"'+(/^https?:/i.test(url)?' target="_blank" rel="noopener"':'')+'>'+esc(a.linkText||'التفاصيل')+' ←</a>':'')+'</p><button type="button" aria-label="إغلاق الإعلان">×</button></div>';
    bar.querySelector('button').addEventListener('click',function(){bar.remove();try{localStorage.setItem('najd_ann_closed',key);}catch(e){}});
    root.insertBefore(bar,root.firstChild);
  }

  window.Najd={LINKS:LINKS,SYNC_KEYS:SYNC_KEYS,META:META,setUser:setUser,toast:toast,setSync:setSync,esc:esc,announce:announce};

  /* ظهور العناصر والعدادات */
  var rv=root.querySelectorAll('.nj-rv');
  function count(el){var to=+el.getAttribute('data-count'),s=null;function step(ts){if(!s)s=ts;var p=Math.min(1,(ts-s)/1100);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;en.target.classList.add('is-vis');var cs=en.target.querySelectorAll('[data-count]');for(var j=0;j<cs.length;j++)count(cs[j]);io.unobserve(en.target);});},{threshold:.15});
    for(var r=0;r<rv.length;r++)io.observe(rv[r]);
  }else{for(var r2=0;r2<rv.length;r2++)rv[r2].classList.add('is-vis');}
})();
