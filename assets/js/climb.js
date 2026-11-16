/* «همّتك»: الخطة الدراسية جبل طويق. كل مستوى محطة على الدرب، والقمة التخرج.
   - «لوحتي» تعرض البطاقة: NajdClimb.card()
   - صفحة الخطط تفتح ورقة «مبروك» لما يخلص الطالب مستوى: NajdClimb.celebrate(li)
   - زر «شارك» في البطاقة يفتح نفس الورقة: NajdClimb.open()
   الصورة (ستوري ٩:١٦) تترسم في جهاز الطالب بـcanvas وما تنرفع لأي مكان. المعدل مخفي إلا إذا اختار يظهره.
   يحتاج: layout.js (Najd) و plans-data.js (NAJD_PLANS و NajdPlan). */
(function(){
  var N=window.Najd;if(!N)return;
  var esc=N.esc,I=N.icon,EN=document.documentElement.lang==='en';function L(a,e){return EN?e:a;}
  var FONT="'Tajawal','Geeza Pro',Tahoma,sans-serif",SAND='#D9B48A',SEEN='najd_climb_seen',STYLE='najd_story_style';
  /* محطات الدرب (المستوى ١-٢، ثم ٣ لين ٨) والقمة، بإحداثيات رسمة 360×178 */
  var ST=[[318,160],[236,141],[270,116],[190,96],[222,74],[164,56],[178,38]],SUM=[150,16];
  function get(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
  function reduce(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}

  /* حالة الطالب من خطته */
  function state(){
    var s=get('najd_plans_v1'),P=window.NAJD_PLANS,NP=window.NajdPlan;
    if(!P||!NP)return null;var m=s&&P[s.major]?s.major:null;
    if(!m)return {none:true};
    var done=s.done||{};try{NP.cleanAll(done);}catch(e){}
    var plan=P[m],h=NP.hours(m,done),lv=plan.levels.map(function(l,li){return {label:l.label,full:l.courses.length>0&&l.courses.every(function(c,ci){return !!done[NP.key(m,li,ci)];})};});
    var cur=Math.min(7,NP.level(h));
    return {major:m,label:plan.label,h:h,pct:Math.min(100,Math.round(h/130*100)),left:Math.max(0,130-h),cur:cur,lv:lv,top:h>=130};
  }
  function lvName(S,i){return i>=7?L('القمة','The summit'):EN?translate(S.lv[i].label):S.lv[i].label;}
  function translate(t){return window.NajdT?window.NajdT(t):t;}
  /* المعدل (لو الطالب حسبه): التراكمي إذا فيه، وإلا الفصلي */
  function gpa(){
    var g=get('najd_gpa_v1'),GR={'A+':4,'A':3.75,'B+':3.5,'B':3,'C+':2.5,'C':2,'D+':1.5,'D':1,'F':0},th=0,tp=0;
    ((g&&g.rows)||[]).forEach(function(r){if(!r||!(r.grade in GR))return;var hh=parseFloat(r.hours)||0;th+=hh;tp+=hh*GR[r.grade];});
    if(!th)return null;var ph=Math.max(0,parseFloat(g.ph)||0),pg=Math.min(4,Math.max(0,parseFloat(g.pg)||0));
    return (ph>0?(ph*pg+tp)/(ph+th):tp/th).toFixed(2);
  }

  /* ===== رسمة الجبل والدرب (SVG للبطاقة) ===== */
  function seg(a,b,i){return ' Q'+((a[0]+b[0])/2+(i%2?18:-18))+' '+((a[1]+b[1])/2)+' '+b[0]+' '+b[1];}
  function trail(upto){var p='M'+ST[0][0]+' '+ST[0][1],n=upto==null?ST.length-1:Math.min(upto,ST.length-1);for(var i=1;i<=n;i++)p+=seg(ST[i-1],ST[i],i);if(upto==null||upto>=7)p+=' L'+SUM[0]+' '+(SUM[1]+8);return p;}
  function mountain(S,anim){
    var cur=S?S.cur:0,o='<svg class="cl-mt" viewBox="0 -6 360 184" aria-hidden="true">'
      +'<circle cx="300" cy="30" r="30" fill="'+SAND+'" opacity=".12"/><circle cx="300" cy="30" r="13" fill="'+SAND+'"/>'
      +'<path d="M0 178L55 118l30 18 50-56 40 30 60-74 45 50 80-30v120z" fill="rgba(255,255,255,.06)"/>'
      +'<path d="M-10 178L150 14l220 164z" fill="rgba(255,255,255,.1)"/>'
      +'<path d="M150 14L130.500 34l9.500-4 8 7 10-7 18.800 4z" fill="rgba(255,255,255,.82)"/>'
      +'<path d="'+trail()+'" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.500" stroke-dasharray="3 6" stroke-linecap="round"/>';
    if(S&&cur>0)o+='<path class="cl-walk'+(anim?' is-anim':'')+'" d="'+trail(cur)+'" fill="none" stroke="'+SAND+'" stroke-width="3.500" stroke-linecap="round" pathLength="100"/>';
    ST.forEach(function(s,i){var full=S&&S.lv[i]&&S.lv[i].full,here=S&&i===cur;
      if(here)return;o+='<circle cx="'+s[0]+'" cy="'+s[1]+'" r="'+(full?6:5)+'" fill="'+(full?SAND:'#1F3837')+'" stroke="'+(full?SAND:'rgba(255,255,255,.55)')+'" stroke-width="2"/>';});
    o+='<path d="M150 16V-4" stroke="#fff" stroke-width="2"/><path d="M150 -4l14 5-14 5z" fill="'+(S&&S.top?SAND:'rgba(255,255,255,.75)')+'"/>';
    var h=cur>=7?[SUM[0],SUM[1]+6]:ST[cur];
    o+='<g class="cl-here'+(anim?' is-anim':'')+'"><circle cx="'+h[0]+'" cy="'+h[1]+'" r="11" fill="'+SAND+'" opacity=".3"/><circle cx="'+h[0]+'" cy="'+h[1]+'" r="7" fill="#fff" stroke="'+SAND+'" stroke-width="3"/></g>';
    var tx=h[0]-62<4?h[0]+14:h[0]-62;
    o+='<g transform="translate('+tx+' '+(h[1]-12)+')"><rect width="50" height="22" rx="11" fill="#fff"/><text x="25" y="15.500" text-anchor="middle" font-family="Tajawal,sans-serif" font-weight="800" font-size="12" fill="#1F3837">'+L('أنت هنا','You')+'</text></g>';
    return o+'</svg>';
  }

  /* ===== بطاقة «همّتك» في «لوحتي» ===== */
  function card(){
    var S=state();if(!S)return '';
    if(S.none)return '<section class="dsh-climb cl is-empty" aria-labelledby="cl-h"><div class="cl-top"><div><p class="cl-k">'+L('همّتك','Your climb')+'</p><h2 id="cl-h">'+L('ارسم دربك للقمة','Map your way to the top')+'</h2><small>'+L('علّم المقررات اللي خلصتها، ونوريك وين وصلت وكم باقي على التخرج.','Tick the courses you finished and see how far you are from graduating.')+'</small></div></div>'
      +mountain(null)+'<div class="cl-ft"><p>'+L('القمة = التخرج','The summit = graduation')+'</p><a class="cl-b sand" href="plans.html">'+L('ابدأ خطتك','Start your plan')+' <span class="nj-arrow">'+I('arrow')+'</span></a></div></section>';
    var title=S.top?L('وصلت القمة!','You reached the top!'):lvName(S,S.cur);
    return '<section class="dsh-climb cl" aria-labelledby="cl-h"><div class="cl-top"><div><p class="cl-k">'+L('همّتك','Your climb')+'</p><h2 id="cl-h">'+esc(title)+'</h2><small>'+esc(translate(S.label))+' · '+(EN?S.h+' of 130 hours':S.h+' من 130 ساعة')+'</small></div>'
      +'<div class="cl-pc"><b dir="ltr">'+S.pct+'%</b><small>'+L('من الخطة','of the plan')+'</small></div></div>'
      +mountain(S)
      +'<div class="cl-ft"><p>'+(S.top?L('مبروك التخرج!','Congratulations, graduate!'):(EN?'<b>'+S.left+' hours</b> to the top':'باقي <b>'+S.left+' ساعة</b> على القمة'))+'</p>'
      +(S.h>0?'<button type="button" class="cl-b" data-climb-share>'+I('share')+L('شارك','Share')+'</button>':'')
      +(S.top?'':'<a class="cl-b sand" href="next-term.html">'+L('الفصل الجاي','Next term')+' <span class="nj-arrow">'+I('arrow')+'</span></a>')+'</div></section>';
  }

  /* ===== الستوري (1080×1920) ===== */
  var logoN=new Image(),logoD=new Image();logoN.src='assets/img/logo-light.svg?v=202611162330';logoD.src='assets/img/logo.svg?v=202611162330';
  function ready(){
    var f=[];try{if(document.fonts&&document.fonts.load)f=['500','800'].map(function(w){return document.fonts.load(w+' 40px "Tajawal"');});}catch(e){}
    var im=[logoN,logoD].map(function(i){return i.complete?Promise.resolve():new Promise(function(r){i.onload=r;i.onerror=r;});});
    return Promise.all(f.concat(im)).catch(function(){});
  }
  /* o = {style:'night'|'dawn', level: رقم المستوى اللي خلص (أو null للتقدم العام), gpa: نص المعدل أو null} */
  function story(cv,S,o){
    var c=cv.getContext('2d'),W=1080,H=1920,dawn=o.style==='dawn',ink=dawn?'#1F3837':'#FFFFFF',sub=dawn?'#3E5A59':'rgba(255,255,255,.82)',accent=dawn?'#8A6430':SAND;
    c.setTransform(1,0,0,1,0,0);
    var g=c.createLinearGradient(0,0,0,H);if(dawn){g.addColorStop(0,'#F3E6D2');g.addColorStop(.55,'#E9EFEE');g.addColorStop(1,'#A9C6C4');}else{g.addColorStop(0,'#0F1D1C');g.addColorStop(.6,'#1F3837');g.addColorStop(1,'#2F4F4E');}
    c.fillStyle=g;c.fillRect(0,0,W,H);
    if(!dawn){c.fillStyle='rgba(255,255,255,.5)';for(var s=0;s<40;s++){c.beginPath();c.arc((s*197)%W,(s*131)%760+60,s%3?1.6:2.6,0,7);c.fill();}}
    var lg=dawn?logoD:logoN;if(lg.complete&&lg.naturalWidth)c.drawImage(lg,W/2-230,120,460,460*188/768);
    c.textAlign='center';c.direction=EN?'ltr':'rtl';c.textBaseline='alphabetic';
    var k,l1,l2,l3;
    if(S.top){k=L('مبروك','Congratulations');l1=L('وصلت','I reached');l2=L('القمة','the top');l3=L('خلّصت خطتي في ','I finished my plan in ')+translate(S.label);}
    else if(o.level!=null){k=L('مبروك','Congratulations');l1=L('خلّصت','I finished');l2=lvName(S,o.level);l3=translate(S.label)+' · '+(EN?S.pct+'% of my plan':S.pct+'% من الخطة');}
    else{k=L('همّتي','My climb');l1=S.pct+'%';l2=L('من خطتي','of my plan');l3=translate(S.label)+' · '+lvName(S,S.cur);}
    c.fillStyle=accent;c.font='800 46px '+FONT;c.fillText(k,W/2,430);
    c.fillStyle=ink;fitLine(c,l1,108,W-140,560);fitLine(c,l2,108,W-140,690);
    c.fillStyle=sub;c.font='500 44px '+FONT;fitLine(c,l3,44,W-160,780,'500');
    if(o.gpa){c.fillStyle=accent;c.font='800 46px '+FONT;c.fillText(L('معدلي ','My GPA ')+o.gpa,W/2,870);}
    /* الجبل والدرب */
    var bx=90,by=1660,sx=900/360,sy=700/178;function X(x){return bx+x*sx;}function Y(y){return by-700+y*sy;}
    c.fillStyle=dawn?'rgba(47,79,78,.10)':'rgba(255,255,255,.07)';c.beginPath();c.moveTo(X(0),Y(178));[[55,118],[85,136],[135,80],[175,110],[235,36],[280,86],[360,56],[360,178]].forEach(function(p){c.lineTo(X(p[0]),Y(p[1]));});c.fill();
    c.fillStyle=dawn?'rgba(47,79,78,.16)':'rgba(255,255,255,.12)';c.beginPath();c.moveTo(X(-10),Y(178));c.lineTo(X(150),Y(14));c.lineTo(X(370),Y(178));c.fill();
    c.fillStyle=dawn?'#F4F7F7':'rgba(255,255,255,.85)';c.beginPath();c.moveTo(X(150),Y(14));[[130.5,34],[140,30],[148,37],[158,30],[176.8,34]].forEach(function(p){c.lineTo(X(p[0]),Y(p[1]));});c.fill();
    function path(upto){var p=new Path2D(),n=upto==null?ST.length-1:Math.min(upto,ST.length-1);p.moveTo(X(ST[0][0]),Y(ST[0][1]));
      for(var i=1;i<=n;i++){var a=ST[i-1],b=ST[i];p.quadraticCurveTo(X((a[0]+b[0])/2+(i%2?18:-18)),Y((a[1]+b[1])/2),X(b[0]),Y(b[1]));}
      if(upto==null||upto>=7)p.lineTo(X(SUM[0]),Y(SUM[1]+8));return p;}
    c.lineCap='round';c.setLineDash([10,16]);c.lineWidth=7;c.strokeStyle=dawn?'rgba(47,79,78,.35)':'rgba(255,255,255,.35)';c.stroke(path());c.setLineDash([]);
    if(S.cur>0){c.strokeStyle=SAND;c.lineWidth=10;c.stroke(path(S.cur));}
    ST.forEach(function(p,i){var full=S.lv[i]&&S.lv[i].full,here=i===S.cur;c.beginPath();c.arc(X(p[0]),Y(p[1]),here?22:full?16:13,0,7);
      c.fillStyle=here?'#fff':full?SAND:(dawn?'#E9EFEE':'#1F3837');c.fill();c.lineWidth=6;c.strokeStyle=here||full?SAND:(dawn?'rgba(47,79,78,.45)':'rgba(255,255,255,.55)');c.stroke();});
    c.strokeStyle=ink;c.lineWidth=5;c.beginPath();c.moveTo(X(150),Y(16));c.lineTo(X(150),Y(-14));c.stroke();
    c.fillStyle=S.top?SAND:(dawn?'#4F8280':SAND);c.beginPath();c.moveTo(X(150),Y(-14));c.lineTo(X(150)+44,Y(-14)+16);c.lineTo(X(150),Y(-14)+32);c.fill();
    c.fillStyle=ink;c.font='800 54px '+FONT;c.fillText(S.top?L('مبروك التخرج','Graduation, done'):(EN?S.left+' hours to graduation':'باقي '+S.left+' ساعة على التخرج'),W/2,1760);
    c.fillStyle=sub;c.font='500 36px '+FONT;c.direction='ltr';c.fillText('najdacdemy.com',W/2,1850);
  }
  function fitLine(c,t,size,maxW,y,w){var fs=size;do{c.font=(w||'800')+' '+fs+'px '+FONT;if(c.measureText(t).width<=maxW)break;fs-=4;}while(fs>28);c.fillText(t,1080/2,y);}

  /* ===== ورقة «مبروك» ===== */
  var box=null,last=null,opt={style:'night',level:null,gpa:false},cur=null;
  function canShare(){try{return !!(navigator.canShare&&navigator.share&&navigator.canShare({files:[new File([new Blob(['x'],{type:'image/png'})],'x.png',{type:'image/png'})]}));}catch(e){return false;}}
  function onKey(e){if(e.key==='Escape'&&box){e.stopPropagation();close();}}
  function close(){if(!box)return;document.removeEventListener('keydown',onKey,true);box.remove();box=null;document.documentElement.classList.remove('nj-noscroll');if(last&&last.focus)last.focus();}
  function draw(){var cv=box&&box.querySelector('canvas');if(!cv||!cur)return;story(cv,cur,{style:opt.style,level:opt.level,gpa:opt.gpa?gpa():null});}
  function file(cb){var cv=document.createElement('canvas');cv.width=1080;cv.height=1920;story(cv,cur,{style:opt.style,level:opt.level,gpa:opt.gpa?gpa():null});
    cv.toBlob(function(b){cb(b);},'image/png');}
  function save(b){var url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='najd-climb.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},4000);}
  function open(o){
    o=o||{};cur=state();if(!cur||cur.none)return;
    var st=get(STYLE);opt={style:st==='dawn'?'dawn':'night',level:o.level!=null?o.level:null,gpa:false};
    close();last=document.activeElement;
    var share=canShare(),g=gpa(),cel=o.level!=null,anim=cel&&!reduce();
    var head=cur.top?L('مبروك! وصلت القمة','Congratulations! You reached the top'):cel?L('مبروك! خلّصت ','Congratulations! You finished ')+lvName(cur,o.level):L('شارك همّتك','Share your climb');
    var subTxt=cur.top?L('خلّصت 130 ساعة من خطتك.','You finished all 130 hours.'):(EN?cur.pct+'% of your plan, '+cur.left+' hours to graduation.':cur.pct+'% من خطتك، وباقي '+cur.left+' ساعة على التخرج.');
    box=document.createElement('div');box.className='nj-sheet nj-climb-sheet';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby','cs-h');
    box.innerHTML='<div class="nj-sheet-box cs-box"><button type="button" class="nj-sheet-x" data-cs="x" aria-label="'+L('إغلاق','Close')+'">'+I('close')+'</button>'
      +(cel?'<div class="cs-cel">'+mountain(cur,anim)+'</div>':'')
      +'<h2 id="cs-h" class="cs-h">'+esc(head)+'</h2><p class="cs-sub">'+esc(subTxt)+'</p>'
      +'<div class="cs-pick" role="radiogroup" aria-label="'+L('شكل الصورة','Image style')+'"><button type="button" role="radio" data-style="night" aria-checked="'+(opt.style==='night')+'"><i class="sw-n"></i>'+L('الليل','Night')+'</button><button type="button" role="radio" data-style="dawn" aria-checked="'+(opt.style==='dawn')+'"><i class="sw-d"></i>'+L('الفجر','Dawn')+'</button></div>'
      +'<div class="cs-prev"><canvas width="1080" height="1920" role="img" aria-label="'+L('معاينة الصورة','Image preview')+'"></canvas></div>'
      +(g?'<label class="cs-tg"><span>'+L('أظهر معدلي في الصورة','Show my GPA on the image')+'</span><input type="checkbox" class="nj-switch" data-cs="gpa"></label>':'')
      +'<div class="cs-acts">'+(share?'<button type="button" class="nj-btn nj-btn-fill" data-cs="share">'+I('share')+L('شارك','Share')+'</button><button type="button" class="nj-btn nj-btn-line" data-cs="save">'+L('احفظ الصورة','Save image')+'</button>'
        :'<button type="button" class="nj-btn nj-btn-fill" data-cs="save">'+L('احفظ الصورة','Save image')+'</button>')+'</div>'
      +'<button type="button" class="cs-later" data-cs="x">'+L('لاحقًا','Later')+'</button></div>';
    document.getElementById('najd').appendChild(box);document.documentElement.classList.add('nj-noscroll');
    box.addEventListener('click',function(e){
      if(e.target===box){close();return;}
      var b=e.target.closest('[data-cs],[data-style]');if(!b)return;
      if(b.hasAttribute('data-style')){opt.style=b.getAttribute('data-style');try{localStorage.setItem(STYLE,JSON.stringify(opt.style));}catch(x){}
        box.querySelectorAll('[data-style]').forEach(function(x){x.setAttribute('aria-checked',x===b?'true':'false');});draw();return;}
      var a=b.getAttribute('data-cs');
      if(a==='x'){close();return;}
      if(a==='save'){if(b.getAttribute('aria-busy')==='true')return;b.setAttribute('aria-busy','true');file(function(bl){b.removeAttribute('aria-busy');if(bl)save(bl);N.toast(L('حفظنا الصورة','Image saved'));});return;}
      if(a==='share'){if(b.getAttribute('aria-busy')==='true')return;b.setAttribute('aria-busy','true');file(function(bl){b.removeAttribute('aria-busy');if(!bl)return;var f=new File([bl],'najd-climb.png',{type:'image/png'});
        navigator.share({files:[f],title:L('همّتي','My climb')}).catch(function(err){if(err&&err.name!=='AbortError')save(bl);});});}
    });
    box.addEventListener('change',function(e){if(e.target.getAttribute('data-cs')==='gpa'){opt.gpa=e.target.checked;draw();}});
    document.addEventListener('keydown',onKey,true);
    box.addEventListener('keydown',function(e){
      if(e.key==='Tab'){var f=box.querySelectorAll('button:not([disabled]),input');if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});
    if(anim){try{if(navigator.vibrate)navigator.vibrate([30,60,30]);}catch(x){}}
    ready().then(draw);draw();
    setTimeout(function(){var f=box&&box.querySelector('[data-cs="share"],[data-cs="save"]');if(f)f.focus();},60);
  }
  /* بعد ما يعلّم آخر مادة في مستوى: نحتفل مرة وحدة لكل مستوى */
  function celebrate(li){
    var S=state();if(!S||S.none||!S.lv[li]||!S.lv[li].full)return false;
    var seen=get(SEEN)||{},k=S.major+'|'+li;if(seen[k])return false;seen[k]=1;try{localStorage.setItem(SEEN,JSON.stringify(seen));}catch(e){}
    open({level:li});return true;
  }
  document.addEventListener('click',function(e){if(e.target.closest('[data-climb-share]')){e.preventDefault();open();}});
  window.NajdClimb={state:state,card:card,open:open,celebrate:celebrate,story:story,ready:ready};
})();
