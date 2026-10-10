import {mountCompare} from './compare.js';
import {mountCaseStudy,setCaseYear} from './case-study.js';
import {mountLab} from './lab.js';
import {mountParticipate} from './participate.js';
import {renderPage,sectionIds} from './page.js';
const app=document.querySelector('#app');
let lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'fr';
// Older links keep working: section ids were renamed when the 2026 results were added.
const aliases={experimenter:'comprendre','resultats-2022':'resultats','partis-2022':'partis'};
let sectionObserver;
function render(){
  document.documentElement.lang=lang;
  app.innerHTML=renderPage(lang);
  bind();mountCompare();mountCaseStudy();mountLab();mountParticipate();observeSections();
  document.title=lang==='fr'?'Voix égales — Pour la proportionnelle au Québec':'Voix égales — Proportional representation for Québec';
  document.querySelector('meta[name=description]').content=lang==='fr'?'Pour une représentation proportionnelle au Québec. Comprendre les écarts, explorer les règles et participer.':'For proportional representation in Québec. Understand the gaps, explore the rules and take part.';
  delete document.documentElement.dataset.pendingLang;
}
function bind(){document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{const disclosures=[...app.querySelectorAll('details')].map(d=>d.open);lang=b.dataset.lang;const url=new URL(location);url.searchParams.set('lang',lang);history.replaceState(null,'',url);render();app.querySelectorAll('details').forEach((d,i)=>{if(i<disclosures.length)d.open=disclosures[i];});revealTarget(location.hash);document.querySelector('[data-lang="'+lang+'"]').focus({preventScroll:true});}));}
// Mark the nav link of the section being read; neighbouring sections share a link.
const navFor={pourquoi:'pourquoi','notre-position':'pourquoi',comprendre:'comprendre',resultats:'comprendre',questions:'questions',approfondir:'questions',participer:'participer',sources:'participer','a-propos':'participer'};
function observeSections(){
  sectionObserver?.disconnect();
  if(!('IntersectionObserver' in window))return;
  const links=new Map(sectionIds.map(id=>[id,app.querySelector(`.site-header nav a[href="#${id}"]`)]));
  sectionObserver=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
      const current=navFor[entry.target.id];
      links.forEach((link,id)=>id===current?link.setAttribute('aria-current','true'):link.removeAttribute('aria-current'));
    }
  },{rootMargin:'-45% 0px -50% 0px'});
  [app.querySelector('.hero'),...Object.keys(navFor).map(id=>document.getElementById(id))].forEach(el=>el&&sectionObserver.observe(el));
}
render();
// The case study replaces its own section when the year changes.
document.addEventListener('case-study-rendered',observeSections);
// Open disclosures before resolving links into content rendered by modules.
function revealTarget(hash,scroll=false){
  let id=decodeURIComponent(hash.slice(1));
  const year=id.match(/^resultats-(\d{4})$/)?.[1];
  if(year)setCaseYear(year);
  id=aliases[id]||id;
  const target=document.getElementById(id);
  if(!target)return;
  for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
  if(scroll)target.scrollIntoView({behavior:'instant'});
}
app.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(link)revealTarget(link.getAttribute('href'));
});
window.addEventListener('hashchange',()=>revealTarget(location.hash,true));
document.fonts.ready.then(()=>revealTarget(location.hash,true));
import './webmcp.js';
