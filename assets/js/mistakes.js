/* دفتر الأخطاء: كل سؤال يغلط فيه الطالب يرجع له بعد يوم، ثم 3 أيام، ثم أسبوع، لين يحله صح 3 مرات.
   المحفوظ في najd_mist_v1 (يتزامن مع الحساب): {items:{"<الاختبار>#<بصمة السؤال>":{quiz,code,h,box,due,wrong,at}}, mastered:عدد} */
(function(){
  var KEY='najd_mist_v1',GAP=[1,3,7];
  function get(){var s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}s=s||{};s.items=s.items||{};s.mastered=+s.mastered||0;return s;}
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
  /* بصمة نص السؤال (ترتيب الأسئلة يتخلط كل مرة، فنعرف السؤال من نصه) */
  function hash(t){var h=5381,s=String(t||'').replace(/\s+/g,' ').trim();for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36);}
  function day(n){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+(n||0));return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
  function record(quiz,code,text,correct){
    var s=get(),h=hash(text),k=quiz+'#'+h,it=s.items[k];
    if(!correct)s.items[k]={quiz:quiz,code:code||'',h:h,box:1,due:day(GAP[0]),wrong:(it?it.wrong:0)+1,at:Date.now()};
    else if(it){if(it.box>=GAP.length){delete s.items[k];s.mastered++;}else{it.box++;it.due=day(GAP[it.box-1]);}}
    else return;
    save(s);
  }
  function list(code){var s=get();return Object.keys(s.items).map(function(k){return s.items[k];}).filter(function(x){return !code||x.code===code;});}
  function due(code){var t=day(0);return list(code).filter(function(x){return x.due<=t;});}
  function count(code){var l=list(code),t=day(0),nx=l.filter(function(x){return x.due>t;}).map(function(x){return x.due;}).sort()[0]||'';return {total:l.length,due:l.filter(function(x){return x.due<=t;}).length,mastered:code?0:get().mastered,next:nx};}
  window.NajdMist={KEY:KEY,GAP:GAP,get:get,save:save,hash:hash,record:record,list:list,due:due,count:count};
})();
