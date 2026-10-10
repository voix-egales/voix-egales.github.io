import {learning as data} from './learning-data.js';

const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sources=(ids,lang)=>ids.map(id=>{const s=data.sources[id];return `<a href="${escape(s.url||s.href)}" ${s.url?'target="_blank" rel="noopener noreferrer"':''}>${escape(id==='case-2022'?(lang==='fr'?'Québec 2026 et 2022 · études du projet':'Québec 2026 and 2022 · project case studies'):s.label)} <span aria-hidden="true">↗</span></a>`;}).join('');

export function renderOverview(lang){
  const L=(fr,en)=>lang==='fr'?fr:en,m=data.matrix;
  return `<details class="system-overview" id="tableau-comparatif"><summary><span><strong>${L('Comparer en un coup d’œil','Compare at a glance')}</strong><small>${L('Cinq systèmes, six questions communes.','Five systems, six shared questions.')}</small></span><span class="disclosure-sign" aria-hidden="true">+</span></summary>
    <p class="overview-principle">${m.intro[lang]} ${m.interpretationNote[lang]}</p>
    <p class="matrix-scope">${m.scopeNote[lang]}</p>
    <p class="matrix-hint" id="matrix-hint">${L('Faites défiler le tableau horizontalement pour comparer les cinq systèmes. Au clavier : placez le focus dans le tableau, puis utilisez les flèches.','Scroll the table sideways to compare all five systems. With a keyboard: focus the table area, then use the arrow keys.')}</p>
    <div class="matrix-scroll" tabindex="0" role="region" aria-label="${L('Tableau des cinq systèmes électoraux','Table of five electoral systems')}" aria-describedby="matrix-hint"><table class="system-matrix"><caption class="visually-hidden">${m.title[lang]}</caption><thead><tr><th scope="col">${L('La question','The question')}</th>${m.systems.map(s=>`<th scope="col"><button class="matrix-country-link" data-profile="${s.id}" aria-label="${L('Lire la fiche : ','Read the profile: ')}${s.name[lang]}">${s.name[lang]}</button><small>${s.scope[lang]}</small></th>`).join('')}</tr></thead><tbody>${m.dimensions.map(d=>`<tr><th scope="row">${d.label[lang]}</th>${m.systems.map(s=>`<td>${s.cells[d.id][lang]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="matrix-footnote">${L('Les noms des pays ouvrent les fiches détaillées ci-dessous. Seuils, exceptions et sources officielles y sont précisés.','Country names open the detailed profiles below, including thresholds, exceptions and official sources.')}</p><p class="matrix-footnote"><a href="/assets/voix-egales-summary-${lang}.pdf" download="voix-egales-summary-${lang}.pdf">${L('Télécharger la fiche à imprimer · PDF · 1 page','Download the printable summary · PDF · 1 page')} ↓</a></p>
  </details>`;
}

export function renderQuestions(lang){
  const L=(fr,en)=>lang==='fr'?fr:en;
  return `<section class="common-questions wrap" id="questions" aria-labelledby="questions-title"><div class="faq-layout"><div class="faq-intro"><p class="section-index">${L('POUR COMMENCER','GETTING STARTED')}</p><h2 id="questions-title">${L('Des questions<br>tout à fait normales.','Questions worth<br>asking.')}</h2><p>${L('Une réforme change des règles concrètes. Voici ce qu’elles peuvent changer — et ce que nos exemples ne permettent pas de conclure.','A reform changes concrete rules. Here is what they can change, and what our examples cannot tell us.')}</p><a href="#tableau-comparatif">${L('Revenir au tableau comparatif','Return to the comparison table')} ↑</a></div><div><div class="faq-list">${data.faq.map(f=>`<details id="question-${f.id}"><summary>${f.question[lang]}<span aria-hidden="true">+</span></summary><div class="faq-answer"><p>${f.answer[lang]}</p><div class="faq-sources" aria-label="${L('Sources','Sources')}">${sources(f.sourceIds,lang)}</div></div></details>`).join('')}</div><p class="faq-checked">${L('Sources officielles et calculs du projet · vérifiés le 4 octobre 2026.','Official sources and project calculations · checked on 4 October 2026.')}</p></div></div></section>`;
}
