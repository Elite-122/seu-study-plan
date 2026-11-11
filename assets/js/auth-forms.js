/* نماذج الدخول والتسجيل (Gmail + البريد) — تعتمد على window.NajdAuth من auth.js */
(function(){
  var form=document.getElementById('au-form');if(!form)return;
  var MODE=form.getAttribute('data-mode');
  var err=document.getElementById('au-err'),flash=document.getElementById('au-flash');
  var inBox=document.getElementById('au-in'),alt=document.getElementById('au-alt'),gwrap=document.getElementById('au-gwrap');
  var submit=form.querySelector('.au-submit'),label=submit.textContent;
  var acting=false;

  function ready(cb){if(window.NajdAuth)cb(window.NajdAuth);else window.addEventListener('najd:auth-ready',function(){cb(window.NajdAuth);},{once:true});}
  function showErr(m){err.textContent=m||'';err.hidden=!m;if(m)err.scrollIntoView({block:'nearest',behavior:'smooth'});}
  function showFlash(m){if(!flash)return;flash.textContent=m||'';flash.hidden=!m;}
  function busy(b,txt){submit.disabled=b;submit.textContent=b?(txt||'لحظة…'):label;}
  /* نرجع الطالب للصفحة اللي جا منها (روابط داخلية فقط) */
  function next(){var m=/[?&]next=([^&]+)/.exec(location.search);var n=m?decodeURIComponent(m[1]):'';return /^[a-z0-9_-]+\.html(#[\w-]*)?$/i.test(n)?n:'index.html';}
  function done(msg){try{sessionStorage.setItem('najd_flash',msg);}catch(e){}location.href=next();}

  /* إظهار/إخفاء كلمة المرور */
  var eyes=document.querySelectorAll('[data-eye]');
  for(var j=0;j<eyes.length;j++){eyes[j].addEventListener('click',function(){var inp=document.getElementById(this.getAttribute('data-eye'));var show=inp.type==='password';inp.type=show?'text':'password';this.textContent=show?'إخفاء':'إظهار';});}

  /* لو مسجل دخول من قبل */
  window.addEventListener('najd:auth',function(e){
    if(acting)return;
    var u=e.detail;
    form.hidden=!!u;gwrap.hidden=!!u;if(alt)alt.hidden=!!u;inBox.hidden=!u;
    if(u)showErr('');
  });

  /* Gmail */
  var g=document.getElementById('au-google');
  g.addEventListener('click',function(){
    showErr('');acting=true;g.disabled=true;
    ready(function(A){
      A.google().then(function(){done('أهلًا فيك، دخلت بحساب Gmail.');})
        .catch(function(x){acting=false;g.disabled=false;showErr(A.errText(x));});
    });
  });

  /* البريد الإلكتروني */
  form.addEventListener('submit',function(e){
    e.preventDefault();showErr('');showFlash('');
    var email=form.elements.email.value,pass=form.elements.password.value;
    if(MODE==='register'){
      var p2=form.elements.password2.value;
      if(pass.length<6)return showErr('كلمة المرور لازم تكون 6 أحرف أو أكثر.');
      if(pass!==p2)return showErr('كلمتا المرور غير متطابقتين.');
    }
    busy(true,MODE==='register'?'جاري إنشاء حسابك…':'جاري تسجيل الدخول…');acting=true;
    ready(function(A){
      var p=MODE==='register'?A.register(form.elements.name.value,email,pass):A.login(email,pass,form.elements.remember.checked);
      p.then(function(){done(MODE==='register'?'تم إنشاء حسابك، أرسلنا لك رابط تأكيد على بريدك.':'أهلًا فيك من جديد');})
       .catch(function(x){acting=false;busy(false);showErr(A.errText(x));});
    });
  });

  var lost=document.getElementById('au-lost');
  if(lost)lost.addEventListener('click',function(e){
    e.preventDefault();showErr('');
    var email=form.elements.email.value.trim();
    if(!email){showErr('اكتب بريدك الإلكتروني فوق، وبعدها اضغط «نسيت كلمة المرور؟».');form.elements.email.focus();return;}
    ready(function(A){A.reset(email).then(function(){showFlash('أرسلنا رابط تغيير كلمة المرور إلى '+email+' (شيك على الرسائل غير المرغوبة بعد).');}).catch(function(x){showErr(A.errText(x));});});
  });
})();
