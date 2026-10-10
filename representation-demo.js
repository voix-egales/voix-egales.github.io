import {apportion} from './elections.js';

// Equal-sized fictional districts. Both geographies have exactly the same party totals.
export const representationScenarios = {
  spread: [[45,35,20],[45,35,20],[45,35,20],[45,35,20],[45,35,20]],
  clustered: [[80,10,10],[60,30,10],[40,50,10],[30,50,20],[15,35,50]],
};
let scenario = 'spread', language = 'fr';
const L = (fr,en) => language === 'fr' ? fr : en;
const letters = ['A','B','C'];
const colors = ['#d4ed8a','#efb4a5','#b2a4d8'];

export function representationResult(key) {
  const districts = representationScenarios[key];
  if (!districts) throw new Error('Unknown representation scenario');
  const votes = letters.map((_,i) => districts.reduce((sum,row) => sum + row[i],0));
  const local = [0,0,0];
  const winners = districts.map(row => row.indexOf(Math.max(...row)));
  winners.forEach(i => local[i]++);
  return {districts, votes, winners, local, proportional:apportion(votes,5,'dhondt',0).seats};
}

function seatResult(title,subtitle,counts) {
  return `<article class="representation-result"><h4>${title}</h4><p>${subtitle}</p><div class="representation-seats" aria-hidden="true">${counts.flatMap((count,i)=>Array.from({length:count},()=>`<span style="--seat-color:${colors[i]}">${letters[i]}</span>`)).join('')}</div><dl>${counts.map((n,i)=>`<div><dt>${L('Parti','Party')} ${letters[i]}</dt><dd>${n}<small> / 5 · ${n*20} %</small></dd></div>`).join('')}</dl></article>`;
}

function results() {
  const r = representationResult(scenario);
  return seatResult(L('Une personne par circonscription','One winner per district'),L('5 circonscriptions · 1 siège chacune','5 districts · 1 seat each'),r.local)
    + seatResult(L('Une répartition proportionnelle','A proportional allocation'),L('1 circonscription regroupée · 5 sièges','1 combined district · 5 seats'),r.proportional);
}

function explanation() {
  return scenario === 'spread'
    ? L('A arrive en tête dans les cinq circonscriptions : 45 % des voix lui donnent les 5 sièges. En regroupant les votes pour répartir ces 5 sièges à la proportionnelle, A en reçoit 2, B en reçoit 2 et C en reçoit 1.','A leads in all five districts: 45% of the votes gives it all 5 seats. Pooling the votes to allocate those same 5 seats proportionally gives A 2 seats, B 2 and C 1.')
    : L('Les totaux restent exactement les mêmes : A 45 %, B 35 %, C 20 %. Les victoires locales sont maintenant réparties 2 / 2 / 1 : les deux méthodes donnent ici les mêmes sièges. La géographie du vote a changé; le soutien total à chaque parti, non.','The totals are exactly the same: A 45%, B 35%, C 20%. Local victories are now split 2 / 2 / 1, so both methods give the same seats here. The geography of the vote changed; each party’s overall support did not.');
}

function districtRows() {
  const r = representationResult(scenario);
  return r.districts.map((row,i)=>`<tr><th scope="row">${i+1}</th>${row.map(n=>`<td>${n}</td>`).join('')}<td><strong>${letters[r.winners[i]]}</strong></td></tr>`).join('');
}

export function renderRepresentationDemo(lang) {
  language=lang;
  return `<div class="representation-demo" id="voix-et-sieges">
    <p class="small-cap">${L('500 VOTES FICTIFS · TOUJOURS 5 SIÈGES','500 FICTIONAL VOTES · ALWAYS 5 SEATS')}</p>
    <h3>${L('Même soutien.<br>Quels sièges ?','Same support.<br>Which seats?')}</h3>
    <p class="representation-intro">${L('Trois partis, cinq territoires de 100 votes. Changez la répartition géographique des voix : leur total reste identique.','Three parties, five areas with 100 votes each. Change where the votes are cast: the totals stay the same.')}</p>
    <div class="representation-votes" aria-label="${L('Part des votes, identique dans les deux exemples','Vote shares, identical in both examples')}">${[45,35,20].map((p,i)=>`<div style="--seat-color:${colors[i]}"><span>${L('Parti','Party')} ${letters[i]}</span><strong>${p}<small> %</small></strong><span>${p*5} ${L('votes','votes')}</span></div>`).join('')}</div>
    <div class="representation-scenarios" role="group" aria-label="${L('Répartition géographique des votes','Geography of the vote')}">
      <button type="button" data-geography="spread" aria-pressed="${scenario==='spread'}">${L('A en tête partout','A leads everywhere')}</button>
      <button type="button" data-geography="clustered" aria-pressed="${scenario==='clustered'}">${L('Des victoires locales partagées','Local wins are shared')}</button>
    </div>
    <div class="representation-results" id="representation-results">${results()}</div>
    <p class="representation-takeaway" id="representation-takeaway" role="status">${explanation()}</p>
    <details class="lab-details" id="representation-data"><summary>${L('Voir les 500 votes et les règles','See all 500 votes and the rules')}</summary><div class="table-scroll"><table><caption>${L('100 votes par territoire · aucune égalité en tête','100 votes per area · no ties for first place')}</caption><thead><tr><th scope="col">${L('Territoire','Area')}</th>${letters.map(p=>`<th scope="col">${p}</th>`).join('')}<th scope="col">${L('En tête','Leader')}</th></tr></thead><tbody id="representation-districts">${districtRows()}</tbody><tfoot><tr><th scope="row">Total</th><td>225</td><td>175</td><td>100</td><td>5 ${L('sièges','seats')}</td></tr></tfoot></table></div><p>${L('Le premier calcul élit la personne en tête dans chaque circonscription. Le second regroupe les cinq territoires en une circonscription à cinq sièges et utilise D’Hondt, sans seuil. Il ne conserve donc pas cinq sièges locaux distincts. Il n’y a pas d’égalité pour l’attribution de ces sièges.','The first count elects the leading candidate in each district. The second combines the five areas into one five-seat district and uses D’Hondt without a threshold. It therefore does not retain five separate local seats. There are no allocation ties in these examples.')}</p></details>
    <p class="representation-limit">${L('Exemple pédagogique choisi pour isoler l’effet des règles et de la géographie. Ce n’est ni un sondage ni une proposition de carte pour le Québec. Avec cinq sièges, chaque siège vaut 20 % : la proportionnalité reste approximative.','A teaching example chosen to isolate the effects of rules and geography. It is neither a poll nor a proposed Québec electoral map. With five seats, each seat is worth 20%: proportionality remains approximate.')}</p>
  </div>`;
}

export function mountRepresentationDemo() {
  document.querySelectorAll('[data-geography]').forEach(button=>button.addEventListener('click',()=>{
    scenario=button.dataset.geography;
    document.querySelectorAll('[data-geography]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.geography===scenario)));
    document.querySelector('#representation-results').innerHTML=results();
    document.querySelector('#representation-districts').innerHTML=districtRows();
    document.querySelector('#representation-takeaway').textContent=explanation();
  }));
}
