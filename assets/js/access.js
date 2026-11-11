/* اشتراكات الطلاب حسب المقرر والنوع.
   الوثيقة access/{email} فيها grants: { "ACCT101_pdf": تاريخ الانتهاء أو true, ... }
   النوع: video = شروحات، pdf = ملخصات، all = الاثنين. المقرر all = كل المقررات. */
(function(){
  var KINDS={video:'شروحات',pdf:'ملخصات',all:'شروحات وملخصات'};
  function name(code){if(code==='all')return 'كل المقررات';var l=window.NAJD_COURSES||[];for(var i=0;i<l.length;i++){if(l[i][0]===code)return window.NajdLang==='en'?l[i][2]:l[i][1];}return '';}
  function label(code){if(!code||code==='none')return 'عام';var n=name(code);return code==='all'?n:(n?code+' · '+n:code);}
  function toDate(v){if(v===true||v==null)return null;if(v&&v.toDate)return v.toDate();var d=new Date(v);return isNaN(d)?null:d;}
  function list(data){
    var g=(data&&data.grants)||{},out=[],now=Date.now();
    Object.keys(g).forEach(function(k){var p=k.split('_');if(p.length!==2)return;var until=toDate(g[k]);out.push({key:k,code:p[0],kind:p[1],until:until,live:!until||until.getTime()>now});});
    out.sort(function(a,b){return (b.live-a.live)||a.code.localeCompare(b.code)||a.kind.localeCompare(b.kind);});
    return out;
  }
  function has(grants,code,kind){
    code=code||'none';
    return (grants||[]).some(function(x){return x.live&&(x.code===code||x.code==='all')&&(x.kind===kind||x.kind==='all');});
  }
  var fmtD=null;try{fmtD=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'});}catch(e){}
  function fmt(d){return d?(fmtD?fmtD.format(d):d.toISOString().slice(0,10)):'';}
  window.NajdAccess={KINDS:KINDS,name:name,label:label,list:list,has:has,fmt:fmt};
})();
