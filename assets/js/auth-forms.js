/* نماذج الدخول والتسجيل (رقم الجوال + البريد) — تعتمد على window.NajdAuth من auth.js */
(function(){
  var form=document.getElementById('au-form');if(!form)return;
  var MODE=form.getAttribute('data-mode');
  var err=document.getElementById('au-err'),flash=document.getElementById('au-flash');
  var inBox=document.getElementById('au-in'),alt=document.getElementById('au-alt');
  var tabs=document.querySelector('.au-tabs'),pPhone=document.getElementById('au-p-phone'),pEmail=document.getElementById('au-p-email');
  var acting=false;

  function ready(cb){if(window.NajdAuth)cb(window.NajdAuth);else window.addEventListener('najd:auth-ready',function(){cb(window.NajdAuth);},{once:true});}
  function showErr(m){err.textContent=m||'';err.hidden=!m;if(m)err.scrollIntoView({block:'nearest',behavior:'smooth'});}
  function showFlash(m){if(!flash)return;flash.textContent=m||'';flash.hidden=!m;}
  function busy(btn,b,txt){if(!btn.dataset.label)btn.dataset.label=btn.textContent;btn.disabled=b;btn.textContent=b?(txt||'لحظة…'):btn.dataset.label;}
  /* نرجع الطالب للصفحة اللي جا منها (روابط داخلية فقط) */
  function next(){var m=/[?&]next=([^&]+)/.exec(location.search);var n=m?decodeURIComponent(m[1]):'';return /^[a-z0-9_-]+\.html(#[\w-]*)?$/i.test(n)?n:'home.html';}
  function done(msg){try{sessionStorage.setItem('najd_flash',msg);}catch(e){}location.href=next();}

  /* التبويبات */
  function setTab(t){
    var bs=tabs.querySelectorAll('.au-tab');
    for(var i=0;i<bs.length;i++)bs[i].setAttribute('aria-selected',bs[i].getAttribute('data-tab')===t?'true':'false');
    pPhone.hidden=t!=='phone';pEmail.hidden=t!=='email';showErr('');
  }
  tabs.addEventListener('click',function(e){var b=e.target.closest('.au-tab');if(b)setTab(b.getAttribute('data-tab'));});
  if(/[?&]tab=email/.test(location.search))setTab('email');

  /* إظهار/إخفاء كلمة المرور */
  var eyes=document.querySelectorAll('[data-eye]');
  for(var j=0;j<eyes.length;j++){eyes[j].addEventListener('click',function(){var inp=document.getElementById(this.getAttribute('data-eye'));var show=inp.type==='password';inp.type=show?'text':'password';this.textContent=show?'إخفاء':'إظهار';});}

  /* لو مسجل دخول من قبل */
  window.addEventListener('najd:auth',function(e){
    if(acting)return;
    var u=e.detail;
    tabs.hidden=!!u;
    if(u){pPhone.hidden=true;pEmail.hidden=true;}else{setTab(tabs.querySelector('[aria-selected="true"]').getAttribute('data-tab'));}
    if(alt)alt.hidden=!!u;inBox.hidden=!u;
    if(u)showErr('');
  });

  /* ===== رقم الجوال ===== */
  var pf=document.getElementById('au-phone'),tel=document.getElementById('au-tel'),code=document.getElementById('au-code');
  var steps=pf.querySelectorAll('.au-step'),phoneE164='',timer=null;
  function step(n){for(var i=0;i<steps.length;i++)steps[i].hidden=steps[i].getAttribute('data-step')!==String(n);}
  /* يقبل 05XXXXXXXX أو 5XXXXXXXX أو +9665XXXXXXXX، وبالأرقام العربية بعد */
  function normalize(v){
    v=String(v||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);}).replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);}).replace(/[^\d+]/g,'');
    if(/^\+9665\d{8}$/.test(v))return v;
    if(/^009665\d{8}$/.test(v))return '+'+v.slice(2);
    if(/^9665\d{8}$/.test(v))return '+'+v;
    if(/^05\d{8}$/.test(v))return '+966'+v.slice(1);
    if(/^5\d{8}$/.test(v))return '+966'+v;
    return '';
  }
  function countdown(){
    var rs=document.getElementById('au-resend'),tm=document.getElementById('au-timer'),left=60;
    rs.disabled=true;clearInterval(timer);
    tm.textContent='بعد '+left+' ثانية';
    timer=setInterval(function(){left--;if(left<=0){clearInterval(timer);tm.textContent='';rs.disabled=false;return;}tm.textContent='بعد '+left+' ثانية';},1000);
  }
  function send(btn){
    phoneE164=normalize(tel.value);
    if(!phoneE164){showErr('رقم الجوال غير صحيح. اكتبه بهذا الشكل: 05XXXXXXXX');tel.focus();return;}
    showErr('');acting=true;busy(btn,true,'جاري الإرسال…');
    ready(function(A){
      A.phoneStart(phoneE164,'au-recaptcha').then(function(){
        busy(btn,false);
        document.getElementById('au-tel-show').textContent='0'+phoneE164.slice(4);
        step(2);countdown();code.value='';code.focus();
      }).catch(function(x){acting=false;busy(btn,false);showErr(A.errText(x));});
    });
  }
  pf.addEventListener('submit',function(e){
    e.preventDefault();
    var visible=pf.querySelector('.au-step:not([hidden])'),btn=visible.querySelector('.au-submit'),act=btn.getAttribute('data-act');
    if(act==='send')return send(btn);
    if(act==='verify'){
      var c=code.value.replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);}).replace(/\D/g,'');
      if(c.length!==6){showErr('الكود 6 أرقام. اكتبه كامل.');code.focus();return;}
      showErr('');busy(btn,true,'جاري التحقق…');
      ready(function(A){
        A.phoneConfirm(c).then(function(cred){
          clearInterval(timer);
          if(cred.user.displayName){done('أهلًا فيك 👋');return;}
          step(3);document.getElementById('au-pname').focus();
        }).catch(function(x){busy(btn,false);showErr(A.errText(x));});
      });
      return;
    }
    if(act==='name'){
      var nm=document.getElementById('au-pname').value.trim();
      if(!nm){showErr('اكتب اسمك عشان نعرف نناديك 🙂');return;}
      busy(btn,true);
      ready(function(A){A.setName(nm).then(function(){done('حياك الله يا '+nm+' 🎉 حسابك جاهز.');}).catch(function(x){busy(btn,false);showErr(A.errText(x));});});
    }
  });
  tel.addEventListener('input',function(){showErr('');});
  code.addEventListener('input',function(){if(code.value.replace(/\D/g,'').length===6)pf.requestSubmit?pf.requestSubmit():null;});
  document.getElementById('au-tel-edit').addEventListener('click',function(){clearInterval(timer);acting=false;step(1);tel.focus();});
  document.getElementById('au-resend').addEventListener('click',function(){step(1);send(pf.querySelector('[data-act="send"]'));});

  /* ===== البريد الإلكتروني ===== */
  var submit=form.querySelector('.au-submit');
  form.addEventListener('submit',function(e){
    e.preventDefault();showErr('');showFlash('');
    var email=form.elements.email.value,pass=form.elements.password.value;
    if(MODE==='register'){
      var p2=form.elements.password2.value;
      if(pass.length<6)return showErr('كلمة المرور لازم تكون 6 أحرف أو أكثر.');
      if(pass!==p2)return showErr('كلمتا المرور غير متطابقتين.');
    }
    busy(submit,true,MODE==='register'?'جاري إنشاء حسابك…':'جاري تسجيل الدخول…');acting=true;
    ready(function(A){
      var p=MODE==='register'?A.register(form.elements.name.value,email,pass):A.login(email,pass,form.elements.remember.checked);
      p.then(function(){done(MODE==='register'?'تم إنشاء حسابك 🎉 أرسلنا لك رابط تأكيد على بريدك.':'أهلًا فيك من جديد 👋');})
       .catch(function(x){acting=false;busy(submit,false);showErr(A.errText(x));});
    });
  });

  var lost=document.getElementById('au-lost');
  if(lost)lost.addEventListener('click',function(e){
    e.preventDefault();showErr('');
    var email=form.elements.email.value.trim();
    if(!email){showErr('اكتب بريدك الإلكتروني فوق، وبعدها اضغط «نسيت كلمة المرور؟».');form.elements.email.focus();return;}
    ready(function(A){A.reset(email).then(function(){showFlash('أرسلنا رابط تغيير كلمة المرور إلى '+email+' 📬 (شيك على الرسائل غير المرغوبة بعد).');}).catch(function(x){showErr(A.errText(x));});});
  });
})();
