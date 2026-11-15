/* محرك خطة المذاكرة: يولّد جلسات الأسبوع من الجدول والاختبارات والإعدادات.
   تستخدمه study.html و«لوحتي» في الرئيسية، فلازم يطلع نفس النتيجة في الصفحتين (ما يعتمد إلا على المحفوظ).
   المحفوظ في najd_study_v1 (يتزامن مع الحساب):
     avail:{0..6:[ساعات البداية]}  effort:'light'|'mid'|'high'  len:25|45|60
     chap:{المادة:{n:عدد الفصول, done:[أرقام]}}  dl:[{id,title,sub,date,time,kind}]  done:{رقم الجلسة:1}  diff:{الرمز:صعوبة 1-5}  setup:1 */
(function(){
  var KEY='najd_study_v1',SKEY='stq_schedule_v1';
  var EFFORT={light:8,mid:13,high:18};
  var DEF_AVAIL={0:[20,21],1:[20,21],2:[20,21],3:[20,21],4:[20,21],5:[16,17,20],6:[10,11,16,17]};
  function get(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
  function clone(o){return JSON.parse(JSON.stringify(o));}
  function state(){
    var s=get(KEY)||{};
    if(!s.avail)s.avail=clone(DEF_AVAIL);
    if(!EFFORT[s.effort])s.effort='mid';
    if([25,45,60].indexOf(+s.len)<0)s.len=45;
    s.chap=s.chap||{};s.dl=s.dl||[];s.done=s.done||{};s.diff=s.diff||{};
    return s;
  }
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
  function pad(n){return (n<10?'0':'')+n;}
  function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function day0(d){var x=new Date(d);x.setHours(0,0,0,0);return x;}
  function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x;}
  function parse(s){return new Date(s+'T00:00:00');}
  function same(a,b){return String(a||'').trim().toLowerCase()===String(b||'').trim().toLowerCase();}

  /* المادة: الاسم من الجدول، والرمز والساعات من بيانات الموقع */
  function codeOf(name){
    var n=String(name||'').trim(),C=window.NAJD_COURSES||[];
    if(/^[A-Za-z]{2,5}\s?\d{3}$/.test(n))return n.replace(/\s/g,'').toUpperCase();
    for(var i=0;i<C.length;i++){if(same(C[i][1],n)||same(C[i][2],n))return C[i][0];}
    return '';
  }
  function subjects(sched){
    var cells=(sched&&sched.cells)||{},seen={},out=[];
    Object.keys(cells).forEach(function(k){var v=String(cells[k]||'').trim();if(!v)return;var key=v.toLowerCase();if(seen[key])return;seen[key]=1;
      var code=codeOf(v),meta=(window.NAJD_COURSE_META||{})[code];out.push({name:v,code:code,credit:meta?meta[2]:3,color:((sched.colors||{})[v])});});
    ((sched&&sched.exams)||[]).forEach(function(x){var v=String(x.subject||'').trim();if(!v||seen[v.toLowerCase()])return;seen[v.toLowerCase()]=1;var code=codeOf(v),meta=(window.NAJD_COURSE_META||{})[code];out.push({name:v,code:code,credit:meta?meta[2]:3,color:null});});
    return out;
  }
  /* محاضرات اليوم (0 = الأحد): الخانات المتتالية لنفس المادة = محاضرة وحدة. البداية 3 العصر وكل خانة 50 دقيقة */
  function lectures(sched,d){
    var out=[],cur=null,cells=(sched&&sched.cells)||{};
    if(d>4)return out;
    for(var r=0;r<7;r++){var v=String(cells[d+'-'+r]||'').trim();
      if(v&&cur&&same(cur.name,v)&&cur.r1===r-1){cur.r1=r;continue;}
      if(cur){out.push(cur);cur=null;}
      if(v)cur={name:v,r0:r,r1:r};}
    if(cur)out.push(cur);
    out.forEach(function(x){x.start=(15+x.r0)*60;x.end=(15+x.r1)*60+50;});
    return out;
  }
  function exams(sched,from){
    var t=day0(from||new Date());
    return ((sched&&sched.exams)||[]).filter(function(x){return /^\d{4}-\d{2}-\d{2}$/.test(x.date||'')&&parse(x.date)>=t;})
      .sort(function(a,b){return (a.date+(a.time||'')).localeCompare(b.date+(b.time||''));});
  }
  function weight(sub,s,ex,now){
    var w=(+sub.credit||3)*((s.diff[sub.code]||3)/3);
    var e=ex.filter(function(x){return same(x.subject,sub.name)||(sub.code&&same(x.subject,sub.code));})[0];
    if(e){var dd=Math.round((parse(e.date)-day0(now))/864e5);if(dd<=7)w*=2;else if(dd<=14)w*=1.5;}
    return w;
  }

  /* يولّد خطة الأسبوع (من الأحد للسبت) اللي فيه now */
  function plan(opts){
    opts=opts||{};var now=opts.now||new Date(),sched=opts.sched||get(SKEY)||{},s=opts.state||state();
    var subs=subjects(sched),ws=addDays(day0(now),-day0(now).getDay()),len=+s.len,ex=exams(sched,now);
    var days=[];for(var i=0;i<7;i++){var dt=addDays(ws,i);days.push({i:i,date:ymd(dt),d:dt,lec:lectures(sched,i),free:[],ses:[]});}
    if(!subs.length)return {subs:[],days:days,len:len,total:0,ex:ex,byName:{}};
    var byName={};subs.forEach(function(x){byName[x.name.toLowerCase()]=x;});
    /* الأوقات الفاضية: المتاحة ناقص المحاضرات */
    days.forEach(function(D){(s.avail[D.i]||[]).slice().sort(function(a,b){return a-b;}).forEach(function(h){
      var st=h*60,busy=D.lec.some(function(l){return st<l.end&&st+len>l.start;});if(!busy)D.free.push(st);});});
    function take(D,after){for(var k=0;k<D.free.length;k++){if(after==null||D.free[k]>=after){var v=D.free[k];D.free.splice(k,1);return v;}}return null;}
    function add(D,start,sub,kind,extra){var x={id:D.date+'|'+start+'|'+sub.name,date:D.date,start:start,len:len,name:sub.name,code:sub.code,kind:kind};if(extra)for(var k in extra)x[k]=extra[k];D.ses.push(x);return x;}
    function subOf(n){return byName[String(n||'').trim().toLowerCase()]||null;}
    /* ١) مراجعة بعد كل محاضرة: نفس اليوم، وإلا اليوم اللي بعده */
    days.forEach(function(D,i){D.lec.forEach(function(l){var sub=subOf(l.name);if(!sub)return;
      var t=take(D,l.end);if(t!=null){add(D,t,sub,'review');return;}
      var N=days[i+1];if(N){t=take(N);if(t!=null)add(N,t,sub,'review');}});});
    /* ٢) الواجبات والكويزات: جلسة قبل الموعد */
    (s.dl||[]).forEach(function(x){var sub=subOf(x.sub)||{name:x.sub||x.title,code:codeOf(x.sub)};
      for(var i=days.length-1;i>=0;i--){var D=days[i];if(D.date>=x.date)continue;if(D.date<ymd(addDays(parse(x.date),-3)))break;
        var t=take(D);if(t!=null){add(D,t,sub,'hw',{title:x.title});break;}}});
    /* ٣) قبل الاختبار بيوم: مراجعة شاملة */
    ex.forEach(function(x){var sub=subOf(x.subject)||{name:x.subject,code:codeOf(x.subject)};var pre=ymd(addDays(parse(x.date),-1));
      days.forEach(function(D){if(D.date!==pre)return;var t=take(D);if(t!=null)add(D,t,sub,'final',{exam:x.type});});});
    /* ٤) الباقي يتوزع حسب الوزن (ساعات المادة × صعوبتها × قرب اختبارها) */
    var total=Math.max(1,Math.round(EFFORT[s.effort]*60/len)),used=days.reduce(function(a,D){return a+D.ses.length;},0),left=Math.max(0,total-used);
    var W=subs.map(function(x){return {sub:x,w:weight(x,s,ex,now),n:0};}),sw=W.reduce(function(a,x){return a+x.w;},0);
    /* أكبر باقي: كل مادة تاخذ نصيبها، والكسور تروح للأكبر */
    W.forEach(function(x){x.raw=sw?left*x.w/sw:0;x.n=Math.floor(x.raw);});
    var rem=left-W.reduce(function(a,x){return a+x.n;},0);
    W.slice().sort(function(a,b){return (b.raw-b.n)-(a.raw-a.n);}).slice(0,rem).forEach(function(x){x.n++;});
    var queue=[];var mx=Math.max.apply(null,W.map(function(x){return x.n;}).concat([0]));
    for(var r=0;r<mx;r++)W.forEach(function(x){if(x.n>r)queue.push(x.sub);});
    var order=[0,1,2,3,4,5,6],di=0,guard=0;
    while(queue.length&&guard<500){guard++;var D=days[order[di%7]];di++;if(!D.free.length){if(days.every(function(Q){return !Q.free.length;}))break;continue;}
      var sub=queue[0],last=D.ses[D.ses.length-1];
      if(last&&last.name===sub.name&&queue.length>1&&queue.some(function(q){return q.name!==sub.name;})){var j=queue.findIndex(function(q){return q.name!==sub.name;});sub=queue.splice(j,1)[0];}else queue.shift();
      add(D,take(D),sub,'study');}
    /* ٥) الجلسات اللي فاتت ما تضيع: تنتقل لأقرب وقت فاضي من الحين (جلستين باليوم بالكثير) */
    var nowMin=now.getHours()*60+now.getMinutes(),today=ymd(now),missed=[];
    days.forEach(function(D){D.ses.forEach(function(x){if(s.done[x.id])return;if(x.date<today||(x.date===today&&x.start+x.len<=nowMin))missed.push(x);});});
    missed.forEach(function(x){x.missed=1;});
    /* أول شي وقت فاضي، وإذا ما فيه تاخذ مكان جلسة مذاكرة عادية جاية (الفايتة أهم) */
    days.forEach(function(D){if(D.date<today)return;var n=0,after=D.date===today?nowMin:null;
      while(missed.length&&n<2){var o=missed[0],t=take(D,after),extra={moved:1,from:o.id,title:o.title,id:'m|'+o.id};
        if(t==null){var k=-1;for(var q=0;q<D.ses.length;q++){var y=D.ses[q];if(y.kind==='study'&&!y.moved&&!y.missed&&!s.done[y.id]&&(after==null||y.start>=after)){k=q;break;}}
          if(k<0)break;t=D.ses[k].start;D.ses.splice(k,1);}
        missed.shift();add(D,t,{name:o.name,code:o.code},o.kind,extra);n++;}});
    days.forEach(function(D){D.ses.sort(function(a,b){return a.start-b.start;});});
    var hours={};days.forEach(function(D){D.ses.forEach(function(x){if(x.missed)return;hours[x.name]=(hours[x.name]||0)+x.len;});});
    return {subs:subs,days:days,len:len,total:total,ex:ex,byName:byName,hours:hours,now:now};
  }
  /* أيام الالتزام المتتالية: كل يوم خلّص فيه جلسة وحدة على الأقل */
  function streak(s,now){
    var have={};Object.keys(s.done||{}).forEach(function(id){var d=id.replace(/^m\|/,'').slice(0,10);have[d]=1;});
    var d=day0(now||new Date()),n=0;if(!have[ymd(d)])d=addDays(d,-1);
    while(have[ymd(d)]){n++;d=addDays(d,-1);}
    return n;
  }
  function todayOf(p){var t=ymd(p.now||new Date());return p.days.filter(function(D){return D.date===t;})[0]||null;}
  window.NajdStudy={KEY:KEY,EFFORT:EFFORT,state:state,save:save,plan:plan,streak:streak,todayOf:todayOf,lectures:lectures,subjects:subjects,exams:exams,codeOf:codeOf,ymd:ymd,parse:parse,addDays:addDays,day0:day0};
})();
