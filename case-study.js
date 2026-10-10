import {renderPartyComparison,mountPartyComparison} from './party-comparison.js';
import {elections} from './election-data.js';
import {partyColour} from './parties.js';

export const caseYears=['2026','2022'];
let year=caseYears[0],language='fr';
const systems=[
  {id:'quebec',field:'observed_seats',name:['Québec','Québec'],rule:()=>['Majoritaire à un tour','First past the post'],actual:true},
  {id:'fixed',field:'fixed_total',name:['Compensatoire · taille actuelle','Compensatory · current size'],rule:c=>[`${c.total_seats} sièges · carte réduite non simulée`,`${c.total_seats} seats · smaller map not simulated`]},
  {id:'germany',field:'germany_total',name:['Compensatoire · modèle allemand','Compensatory · German model'],rule:c=>[`Adaptation · ${c.constituency_seats_filled} locaux + ${c.list_seats} de liste`,`Adaptation · ${c.constituency_seats_filled} local + ${c.list_seats} list seats`]},
  {id:'japan',field:'japan_total',name:['Mixte parallèle · Japon','Parallel mixed · Japan'],rule:c=>[`Adaptation · ${c.constituency_seats} locaux + ${c.list_seats} de liste`,`Adaptation · ${c.constituency_seats} local + ${c.list_seats} list seats`]},
  {id:'taiwan',field:'taiwan_total',name:['Mixte parallèle · Taïwan','Parallel mixed · Taiwan'],rule:c=>[`Adaptation · ${c.constituency_seats} locaux + ${c.list_seats} de liste`,`Adaptation · ${c.constituency_seats} local + ${c.list_seats} list seats`]},
];
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const caseYear=()=>year;
export const mainParties=y=>elections[y].data.parties.slice(0,5);

export function renderCaseStudy(lang){
  language=lang;
  const {data,copy}=elections[year],parties=mainParties(year),districts=data.districts;
  const L=(fr,en)=>lang==='fr'?fr:en, ix=lang==='fr'?0:1;
  const n=(v,digits=0)=>v.toLocaleString(lang==='fr'?'fr-CA':'en-CA',{maximumFractionDigits:digits,minimumFractionDigits:digits});
  const pct=v=>`${n(v,2)}${L(' %','%')}`;
  const list=items=>items.length<2?items.join(''):`${items.slice(0,-1).join(', ')} ${L('et','and')} ${items.at(-1)}`;
  const link=(label,url)=>`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
  const row=system=>{
    const config=data.configurations[system.id],seats=parties.map(p=>p[system.field]);
    const top=seats.indexOf(Math.max(...seats)),hasMajority=seats[top]>=config.majority;
    const label=`${system.name[ix]}: ${seats.map((v,i)=>`${parties[i].short_name} ${v}`).join(', ')}. ${config.total_seats} ${L('sièges au total','total seats')}.`;
    return `<article class="case-result" data-scenario="${system.id}">
      <div class="case-system"><span class="case-kind ${system.actual?'is-observed':''}">${system.actual?copy.statuses.observed[lang]:copy.statuses.conditional[lang]}</span><h3>${system.name[ix]}</h3><p>${system.rule(config)[ix]}</p><span class="case-size">${config.total_seats} ${L('sièges','seats')} <span aria-hidden="true">·</span> ${L('majorité','majority')} ${config.majority}</span></div>
      <div class="case-distribution"><div class="case-stack" role="img" aria-label="${escape(label)}">${seats.map((v,i)=>`<span class="case-segment" aria-hidden="true" style="width:${v/config.total_seats*100}%;--party-colour:${partyColour[parties[i].id]}"></span>`).join('')}<span class="case-half" aria-hidden="true"></span></div><dl class="case-counts">${seats.map((v,i)=>`<div><dt><i style="background:${partyColour[parties[i].id]}" aria-hidden="true"></i>${parties[i].short_name}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
      <div class="case-share"><strong>${pct(seats[top]/config.total_seats*100)}</strong><span>${L('des sièges','of seats')} · ${parties[top].short_name}</span><span class="case-majority${hasMajority?' has-majority':''}">${hasMajority?L('Majorité','Majority'):L('Sans majorité','No majority')}</span></div>
    </article>`;
  };
  const au=data.configurations.australia;
  const firstRound=parties.filter(p=>p.guaranteed_irv_first_round>0).sort((a,b)=>b.guaranteed_irv_first_round-a.guaranteed_irv_first_round).map(p=>`${p.short_name} ${p.guaranteed_irv_first_round}`);
  return `<section class="case-study wrap" id="resultats" aria-labelledby="case-title">
    <p class="section-index">${L('ÉTUDE DE CAS · QUÉBEC','CASE STUDY · QUÉBEC')} ${year}</p>
    <div class="section-head"><h2 id="case-title">${L(`Le Québec de ${year}.<br>D’autres règles.`,`Québec in ${year}.<br>Different rules.`)}</h2><p>${copy.subtitle[lang]}</p></div>
    <div class="case-premise"><div class="case-years" role="group" aria-label="${L('Élection à comparer','Election to compare')}">${caseYears.map(y=>`<button type="button" data-case-year="${y}" aria-pressed="${y===year}">${y}</button>`).join('')}</div><div><strong>${copy.premise.title[lang]}</strong><p>${copy.premise.text[lang]}</p><p>${L('Pour les scénarios mixtes, les votes de candidature servent de votes de liste supposés, répartis à l’échelle du Québec. Une comparaison mécanique, pas une prédiction.','For the mixed-system scenarios, candidate votes stand in for assumed list votes, allocated across Québec. A mechanical comparison, not a forecast.')}</p></div></div>
    <div class="case-chart-head"><p>${L('PART DE L’ASSEMBLÉE','SHARE OF THE ASSEMBLY')}</p><div class="case-axis" aria-hidden="true"><span>0 %</span><span>50 %</span><span>100 %</span></div><span></span></div>
    <div class="case-results">${systems.map(row).join('')}</div>
    <p class="case-scale-note">${L(`Chaque barre représente 100 % d’une assemblée. Le scénario à taille actuelle garde ${districts} sièges; les adaptations étrangères en ajoutent pour conserver les ${districts} sièges locaux et approcher les proportions de chaque pays. Le repère central indique 50 %. Tous les autres partis obtiennent 0 siège dans ces scénarios.`,`Each bar represents 100% of an assembly. The current-size scenario keeps ${districts} seats; the foreign adaptations add seats to retain the ${districts} local seats and approximate each country’s ratios. The central marker indicates 50%. All other parties receive 0 seats in these scenarios.`)}</p>
    ${renderPartyComparison(lang,year)}
    <div class="case-takeaway"><span aria-hidden="true">↳</span><p>${copy.takeaway[lang]}</p></div>
    <article class="case-unknown" data-scenario="australia"><div class="case-unknown-heading"><span class="case-kind">${copy.statuses.unknown[lang]}</span><h3>${L('Et l’Australie ?','What about Australia?')}</h3><p>${L('Vote préférentiel · Chambre des représentants','Preferential voting · House of Representatives')}</p><span class="case-size">${au.total_seats} ${L('sièges','seats')} <span aria-hidden="true">·</span> ${L('majorité','majority')} ${au.majority}</span></div><div class="case-unknown-body"><div class="case-known-labels"><div><strong>${au.confirmed_first_round}</strong><span>${L('confirmés au premier tour','settled in the first round')}</span></div><div><strong>${au.unresolved_districts}</strong><span>${L('encore indéterminés','still unknown')}</span></div></div><div class="case-uncertain-track" role="img" aria-label="${L(`${au.confirmed_first_round} sièges confirmés au premier tour et ${au.unresolved_districts} indéterminés, sur ${au.total_seats}.`,`${au.confirmed_first_round} seats settled in the first round and ${au.unresolved_districts} unknown, out of ${au.total_seats}.`)}"><span style="width:${au.confirmed_first_round/au.total_seats*100}%"></span><span style="width:${au.unresolved_districts/au.total_seats*100}%"></span></div><p>${L(`En gardant les votes de ${year} comme premiers choix : ${list(firstRound)}. Les ${au.unresolved_districts} autres sièges nécessitent les classements suivants, qui n’ont pas été recueillis.`,`Keeping the ${year} votes as first choices: ${list(firstRound)}. The other ${au.unresolved_districts} seats require later preferences, which were never collected.`)}</p><p class="case-unknown-note">${copy.australiaNote[lang]}</p></div></article>
    <details class="case-methods"><summary>${L('Hypothèses, méthode et données','Assumptions, method and data')}<span class="plus" aria-hidden="true">+</span></summary><div class="case-method-content">
      <div class="case-method-grid"><div><h3>${L('Une deuxième voix supposée','An assumed second vote')}</h3><p>${copy.listVoteProxy[lang]}</p><p>${copy.sharedAssumptions[lang]}</p></div><div><h3>${L(`Pourquoi plus de ${districts} sièges ?`,`Why more than ${districts} seats?`)}</h3><p>${copy.seatTotals[lang]}</p><p>${copy.seatFormula[lang]}</p></div></div>
      <div class="case-method-rules">${[['fixed',L('Taille actuelle','Current size')],['de',L('Allemagne','Germany')],['jp',L('Japon','Japan')],['tw',L('Taïwan','Taiwan')]].map(([id,name])=>`<div><h4>${name}</h4><p>${copy.methods[id][lang]}${id==='fixed'?'':' '+(id==='de'?L('Seuil de 5 % ou au moins trois premières places locales. Aucune exemption de parti minoritaire n’est transposée.','A 5% threshold or at least three local first-place finishes. No minority-party exemption is transplanted.'):id==='jp'?L('Aucun seuil national de répartition n’est ajouté.','No national allocation threshold is added.'):L('Les règles individuelles de candidature, de genre et de classement ne sont pas simulées.','Individual candidacy, gender and list-ranking rules are not simulated.'))}</p></div>`).join('')}</div>
      <div class="case-evidence"><h3>${L('Des résultats que l’on peut vérifier','Results you can check')}</h3><p>${copy.evidence[lang]}</p><p>${copy.notForecast[lang]}</p><div class="case-data-links">${link(copy.officialLabel[lang],data.source_url)}<a href="/data/quebec-${year}-scenarios.json" download="quebec-${year}-scenarios.json">${L('Données et hypothèses · JSON','Data and assumptions · JSON')} <span aria-hidden="true">↓</span></a><a href="#comparer">${L('Sources des règles de chaque pays','Sources for each country’s rules')} <span aria-hidden="true">↑</span></a></div><p class="case-attribution">${escape(data.attribution)} ${link(L('Licence','Licence'),data.licence_url)}</p><p class="case-checked">${copy.checked[lang]}</p></div>
    </div></details>
  </section>`;
}

export function setCaseYear(next){
  if(!caseYears.includes(next)||next===year)return false;
  year=next;
  const section=document.querySelector('#resultats');
  if(section){
    const methodsOpen=section.querySelector('.case-methods')?.open;
    section.outerHTML=renderCaseStudy(language);
    if(methodsOpen)document.querySelector('#resultats .case-methods').open=true;
    mountCaseStudy();
    document.dispatchEvent(new CustomEvent('case-study-rendered'));
  }
  return true;
}

export function mountCaseStudy(){
  mountPartyComparison();
  document.querySelectorAll('[data-case-year]').forEach(button=>button.addEventListener('click',()=>{
    if(setCaseYear(button.dataset.caseYear))document.querySelector(`[data-case-year="${button.dataset.caseYear}"]`).focus();
  }));
}
