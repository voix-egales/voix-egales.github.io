// Pure string rendering for the whole page: used in the browser and by scripts/prerender.mjs.
import {renderCompare} from './compare.js';
import {renderCaseStudy} from './case-study.js';
import {renderQuestions} from './learning-guide.js';
import {renderLab} from './lab.js';
import {renderLibrary} from './library.js';
import {renderParticipate} from './participate.js';
import {text} from './content.js';
import {renderAdvocacy} from './advocacy.js';
import {hemisphere} from './elections.js';
import {elections} from './election-data.js';
import {partyColour} from './parties.js';

// Nav labels in content.js follow this order.
export const sectionIds=['pourquoi','comprendre','questions','participer'];
const latest=elections['2026'].data;
const mark='<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
const bySeats=latest.parties.filter(p=>p.observed_seats>0).sort((a,b)=>b.observed_seats-a.observed_seats);

function seatsSVG(lang){
  const label=`Québec 2026${lang==='fr'?' :':':'} ${bySeats.map(p=>`${p.short_name} ${p.observed_seats}`).join(', ')}`;
  return `<svg viewBox="0 0 480 260" role="img" aria-label="${label}"><g>${hemisphere(bySeats.map(p=>p.observed_seats)).map(p=>`<circle class="seat-dot" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="7.9" fill="${partyColour[bySeats[p.group].id]}" style="--delay:${p.index*5}ms"/>`).join('')}</g></svg>`;
}

// Five parties, two bars each: what voters gave them and what the Assembly gave them.
function gapChart(lang){
  const L=(fr,en)=>lang==='fr'?fr:en;
  const n=(v,d=2)=>v.toLocaleString(lang==='fr'?'fr-CA':'en-CA',{minimumFractionDigits:d,maximumFractionDigits:d});
  const unit=L(' %','%');
  const rows=latest.parties.slice(0,5).map(p=>{
    const seatShare=p.observed_seats/latest.districts*100,gap=seatShare-p.vote_share_pct;
    return `<tr><th scope="row"><i style="background:${partyColour[p.id]}" aria-hidden="true"></i>${p.short_name}</th>
      <td><span class="gap-bar" aria-hidden="true"><i style="width:${p.vote_share_pct}%"></i></span><span class="gap-value">${n(p.vote_share_pct)}${unit}</span></td>
      <td><span class="gap-bar is-seats" aria-hidden="true"><i style="width:${seatShare}%"></i></span><span class="gap-value">${n(seatShare)}${unit} <small>(${p.observed_seats})</small></span></td>
      <td class="gap-diff ${gap>=0?'is-over':'is-under'}">${gap>0?'+':'−'}${n(Math.abs(gap),1)} ${L('pts','pts')}</td></tr>`;
  }).join('');
  return `<table class="gap-chart"><caption class="visually-hidden">${L('Part des voix et part des sièges des cinq principaux partis, élection du 5 octobre 2026','Vote share and seat share of the five largest parties, 5 October 2026 election')}</caption>
    <thead><tr><th scope="col">${L('Parti','Party')}</th><th scope="col">${L('Voix','Votes')}</th><th scope="col">${L('Sièges','Seats')}</th><th scope="col">${L('Écart','Gap')}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function renderPage(lang){
  const c=text[lang],L=(fr,en)=>lang==='fr'?fr:en;
  return `<a class="skip" href="#main">${c.skip}</a><div class="header-bar"><header class="site-header"><a class="brand" href="#">${mark}<span>Voix égales</span></a><nav aria-label="${L('Navigation principale','Main navigation')}">${c.nav.map((label,i)=>`<a href="#${sectionIds[i]}">${label}</a>`).join('')}</nav><div class="language" aria-label="Language"><button data-lang="fr" class="${lang==='fr'?'active':''}" aria-pressed="${lang==='fr'}">FR</button><span>/</span><button data-lang="en" class="${lang==='en'?'active':''}" aria-pressed="${lang==='en'}">EN</button></div></header></div>
  <main id="main"><section class="hero wrap"><div class="hero-copy"><h1>${c.headline}</h1><p>${c.intro}</p><div class="hero-actions"><a class="button primary" href="#pourquoi">${c.explore}</a><a class="button outline" href="#comprendre">${c.try}</a></div><div class="reading-path" aria-label="${L('Repères de lecture','Reading shortcuts')}"><a href="#questions">${L('Questions fréquentes','Common questions')}</a><span aria-hidden="true">·</span><a href="#a-propos">${L('À propos du projet','About the project')}</a></div></div><figure class="hero-figure">${seatsSVG(lang)}<figcaption><strong>${c.figure}</strong><span>${c.figureNote}</span><div class="mini-legend">${bySeats.map(p=>`<span><i style="background:${partyColour[p.id]}"></i>${p.short_name} · ${p.observed_seats}</span>`).join('')}<span><i class="is-empty"></i>CAQ · 0</span></div></figcaption></figure></section>
  <section class="history wrap" id="pourquoi"><div><p class="section-index">${c.caseLabel}</p><h2>${c.caseTitle}</h2><p>${c.caseDesc}</p><a class="case-entry" href="#resultats">${L('Comparer avec d’autres règles','Compare under other rules')}<span aria-hidden="true">↓</span></a></div><div class="historic-chart">${gapChart(lang)}<p class="chart-note">${c.caseNote} <a href="https://www.electionsquebec.qc.ca/resultats-et-statistiques/resultats-generales/2026-10-05/" target="_blank" rel="noopener noreferrer">${c.source}</a></p></div></section>${renderAdvocacy(lang)}${renderLab(lang)}${renderCaseStudy(lang)}${renderQuestions(lang)}<details class="learning-extension wrap" id="approfondir"><summary><span>${L('Pour aller plus loin','Explore further')}<small>${L('Pays, formules et autres méthodes de vote','Countries, formulas and other voting methods')}</small></span><span class="plus" aria-hidden="true">+</span></summary>${renderCompare(lang)}${renderLibrary(lang)}</details>${renderParticipate(lang)}</main>`;
}
