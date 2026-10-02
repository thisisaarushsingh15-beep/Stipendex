(function(){
  'use strict';

  function send(name,params){
    if(typeof window.gtag==='function') window.gtag('event',name,params||{});
  }

  document.addEventListener('DOMContentLoaded',function(){
    var page=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'');
    var title=document.title||page;

    document.addEventListener('click',function(e){
      var link=e.target.closest ? e.target.closest('a') : null;
      if(!link) return;
      var href=link.getAttribute('href')||'';
      var text=(link.textContent||'').trim().replace(/\s+/g,' ').slice(0,80);
      if(!href || href.charAt(0)==='#') return;
      if(/^https?:\/\//i.test(href) && href.indexOf(location.origin)!==0){
        send('outbound_click',{link_url:href,link_text:text,page_location:location.href});
        return;
      }
      if(/(calculator|planner|gpa|cgpa|degree|student-finance|loan)/i.test(href)){
        send('select_content',{content_type:'calculator_link',content_id:href.split('#')[0].replace(/^.*\//,''),link_text:text});
      } else if(/guide-/i.test(href)){
        send('select_content',{content_type:'guide_link',content_id:href.split('#')[0].replace(/^.*\//,''),link_text:text});
      }
    });

    var buttons=document.querySelectorAll('button');
    buttons.forEach(function(btn){
      var label=(btn.textContent||'').trim().replace(/\s+/g,' ').toLowerCase();
      if(!/(calculate|work it out|find|convert|plan|estimate|compare|show result|update)/i.test(label)) return;
      btn.addEventListener('click',function(){
        send('calculator_use',{tool_name:page,tool_title:title});
      });
    });
  });
})();
