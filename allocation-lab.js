import {apportion} from './elections.js';
export const allocationScenarios={
 same:{votes:[18000,14000,8000,5000],seats:12,threshold:0,label:['Même répartition','Same allocation'],note:['Avec ces 12 sièges, les quatre formules donnent le même résultat. Des règles différentes ne changent pas chaque élection.','With these 12 seats, all four formulas give the same result. Different rules do not change every election.']},
 last:{votes:[18000,14000,8000,5000],seats:5,threshold:0,label:['La dernière place','The last seat'],note:['Les voix sont identiques au premier scénario, mais il n’y a que 5 sièges. Comparez la place de B et de D; la formule Hare comporte aussi une égalité de restes.','The votes match the first scenario, but only 5 seats are available. Compare B and D; the Hare calculation also includes an equal-remainder tie.']},
 threshold:{votes:[47100,31200,17400,4300],seats:25,threshold:5,label:['L’effet du seuil','The threshold’s effect'],note:['D reçoit 4,3 % des voix. À 5 %, il est exclu de la répartition. Repassez le seuil à 0 % pour voir le siège qu’il obtiendrait.','D receives 4.3% of votes. At 5%, it is excluded from allocation. Switch the threshold to 0% to see the seat it would receive.']}
};
const methods=['dhondt','sainte','hare','droop'];
const methodNames={dhondt:'D’Hondt',sainte:'Sainte-Laguë',hare:'Hare',droop:'Droop'};
const colors=['#d4ed8a','#efb4a5','#b2a4d8','#8cb7cb'];
let language='fr',weights=[18000,14000,8000,5000],seatCount=12,formula='dhondt',threshold=0,scenarioId='same';
const L=(fr,en)=>language==='fr'?fr:en;
const num=n=>n.toLocaleString(language==='fr'?'fr-CA':'en-CA',{maximumFractionDigits:2});
const localized=pair=>pair[language==='fr'?0:1];

// Report the actual allocation ties rather than hiding an input-order convention.
export function allocationWithTies(votes,seats,method,cutoff=0){
 const result=apportion(votes,seats,method,cutoff),total=votes.reduce((a,b)=>a+b,0);
 const eligible=votes.map((v,i)=>({v,i})).filter(p=>p.v>0&&p.v*100>=total*cutoff),ties=[];
 if(!eligible.length||result.error)return {...result,ties};
 if(method==='dhondt'||method==='sainte'){
  let counts=votes.map(()=>0);
  result.rounds.forEach((round,index)=>{
   const winner=round.winner,d=method==='dhondt'?counts[winner]+1:2*counts[winner]+1;
   const tied=eligible.filter(p=>p.v*d===votes[winner]*(method==='dhondt'?counts[p.i]+1:2*counts[p.i]+1)).map(p=>p.i);
   if(tied.length>1)ties.push({seat:index+1,parties:tied,awarded:[winner]});
   counts=round.seats;
  });
 }else{
  const valid=eligible.reduce((s,p)=>s+p.v,0);
  const quotas=eligible.map(p=>({...p,whole:Math.floor(method==='hare'?p.v*seats/valid:p.v/result.quota)}));
  const ranked=quotas.map(p=>({...p,remainder:method==='hare'?(p.v*seats)%valid:p.v-p.whole*result.quota})).sort((a,b)=>b.remainder-a.remainder||a.i-b.i);
  const remaining=seats-quotas.reduce((s,p)=>s+p.whole,0);
  if(remaining>0&&remaining<ranked.length&&ranked[remaining-1].remainder===ranked[remaining].remainder){
   const equal=ranked.filter(p=>p.remainder===ranked[remaining].remainder);
   ties.push({seat:seats,parties:equal.map(p=>p.i),awarded:ranked.slice(0,remaining).filter(p=>equal.some(q=>q.i===p.i)).map(p=>p.i)});
  }
 }
 return {...result,ties};
}
export function renderAllocationLab(lang){
 language=lang;
 return `<div class="proportional" id="proportionnel"><div class="pr-heading"><div><span class="small-cap">${L('COMPARER DES SIÈGES','COMPARE SEAT ALLOCATIONS')}</span><h3>${L('Quatre formules.<br>Le même résultat ?','Four formulas.<br>The same result?')}</h3></div><p>${L('Comparez les quatre résultats côte à côte. Explorez un scénario, puis changez les voix, les sièges ou le seuil.','Compare all four results side by side. Explore a scenario, then change the votes, seats or threshold.')}</p></div>
 <div class="scenario-picker" role="group" aria-label="${L('Scénario de répartition','Allocation scenario')}">${Object.entries(allocationScenarios).map(([id,s])=>`<button type="button" data-allocation-scenario="${id}" aria-pressed="${scenarioId===id}">${localized(s.label)}</button>`).join('')}</div><p id="pr-scenario-note" class="scenario-note"></p>
 <div class="pr-controls"><label>${L('Nombre de sièges','Number of seats')}<select id="pr-seats">${[5,7,10,12,15,20,25,30].map(n=>`<option ${n===seatCount?'selected':''}>${n}</option>`).join('')}</select></label><label>${L('Seuil de voix','Vote threshold')}<select id="pr-threshold"><option value="0" ${threshold===0?'selected':''}>0 %</option><option value="5" ${threshold===5?'selected':''}>5 %</option></select></label><button class="text-control" id="pr-reset">${L('Réinitialiser','Reset')}</button></div>
 <div class="pr-workspace"><div class="vote-inputs">${weights.map((v,i)=>`<label class="party-input"><span><i style="background:${colors[i]}"></i>${L('Parti','Party')} ${'ABCD'[i]}</span><input type="number" min="0" max="50000" step="1" inputmode="numeric" data-votes="${i}" value="${v}" aria-label="${L('Votes pour le parti','Votes for party')} ${'ABCD'[i]}"></label>`).join('')}<p class="input-error" id="pr-error" role="status"></p></div>
 <div class="pr-result pr-overview"><table class="allocation-table"><caption>${L('Sièges attribués à chaque parti','Seats allocated to each party')}</caption><thead><tr><th scope="col">${L('Formule','Formula')}</th>${['A','B','C','D'].map((p,i)=>`<th scope="col"><span style="--party-colour:${colors[i]}">${p}</span></th>`).join('')}</tr></thead><tbody id="allocation-rows"></tbody></table></div></div>
 <div class="allocation-feedback" aria-live="polite" aria-atomic="true"><p id="pr-comparison-message"></p><p id="pr-threshold-message"></p></div><p id="pr-ties" class="allocation-ties"></p>
 <details class="lab-details allocation-calculation" id="pr-calculation"><summary>${L('Examiner une formule et son calcul','Inspect a formula and its calculation')}</summary><div class="pr-inspect"><label>${L('Formule à examiner','Formula to inspect')}<select id="pr-formula">${methods.map(m=>`<option value="${m}" ${formula===m?'selected':''}>${methodNames[m]}</option>`).join('')}</select></label><div><div id="pr-dots" class="pr-dots" aria-hidden="true"></div><div id="pr-totals" class="pr-totals"></div><p id="pr-explain"></p></div></div><p id="formula-explain"></p><p id="formula-ties"></p><p>${L('Une seule circonscription et des partis fictifs. Le seuil s’applique avant la répartition. Les égalités favorisent l’ordre A–D et sont signalées ci-dessus. Aucune compensation régionale ni règle de candidature n’est simulée. Droop sert ici de quota pour les plus forts restes, pas de simulation du VUT.','One constituency and fictional parties. The threshold applies before allocation. Ties favour A–D order and are flagged above. Regional compensation and candidate rules are not simulated. Here Droop is a largest-remainder quota, not a simulation of STV.')}</p></details></div>`;
}
function tieText(tie){
 const names=tie.parties.map(i=>'ABCD'[i]).join(' / '),awarded=tie.awarded.map(i=>'ABCD'[i]).join(' / ');
 if(tie.awarded.length>1){const first=tie.seat-tie.awarded.length+1;return L(`Égalité ${names} pour les sièges ${first}–${tie.seat}; ${awarded} reçoivent chacun un siège selon l’ordre A–D.`,`Tie between ${names} for seats ${first}–${tie.seat}; ${awarded} each receive one seat under the A–D convention.`);}
 return L(`Égalité ${names} à l’attribution du siège ${tie.seat}; ${awarded} reçoit le siège selon l’ordre A–D.`,`Tie between ${names} when allocating seat ${tie.seat}; ${awarded} receives the seat under the A–D convention.`);
}
function detectScenario(){
 scenarioId=Object.keys(allocationScenarios).find(id=>{
  const s=allocationScenarios[id];return s.seats===seatCount&&s.threshold===threshold&&s.votes.every((v,i)=>v===weights[i]);
 })||null;
}
function updateAllocation(){
 const total=weights.reduce((a,b)=>a+b,0);
 const results=methods.map(m=>({method:m,...allocationWithTies(weights,seatCount,m,threshold)})),r=results.find(r=>r.method===formula);
 document.querySelectorAll('[data-allocation-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.allocationScenario===scenarioId)));
 document.querySelector('#pr-scenario-note').textContent=scenarioId?localized(allocationScenarios[scenarioId].note):L('Vos paramètres. Lisez ensemble les résultats, les éventuelles exclusions et les égalités.','Your settings. Read the results together with any exclusions and ties.');
 document.querySelector('#pr-error').textContent=total===0?L('Ajoutez des votes pour attribuer les sièges.','Add votes to allocate seats.'):results.some(r=>r.error)?L('Un quota ne permet pas cette répartition. Augmentez les votes ou réduisez les sièges.','A quota cannot allocate these seats. Add votes or reduce the seats.'):'';
 const differentColumns=weights.map((v,i)=>results.filter(r=>!r.error).some(r=>r.seats[i]!==results.find(r=>!r.error)?.seats[i]));
 document.querySelector('#allocation-rows').innerHTML=results.map(r=>`<tr><th scope="row">${methodNames[r.method]}${r.ties.length?' *':''}</th>${r.seats.map((n,i)=>`<td class="${differentColumns[i]?'allocation-varies':''}">${r.error?'—':n}</td>`).join('')}</tr>`).join('');
 const valid=results.filter(r=>!r.error),allSame=valid.length===4&&new Set(valid.map(r=>r.seats.join(','))).size===1;
 const varying=weights.map((v,i)=>i).filter(i=>new Set(valid.map(r=>r.seats[i])).size>1).map(i=>'ABCD'[i]);
 document.querySelector('#pr-comparison-message').textContent=total===0?L('Aucun résultat sans voix à répartir.','There is no allocation without votes.'):valid.length<4?L('Une ou plusieurs formules ne peuvent pas attribuer tous les sièges avec ces paramètres.','One or more formulas cannot allocate all seats with these settings.'):allSame?L(`Les quatre formules donnent ici la même répartition : ${valid[0].seats.join(' / ')}. Les calculs diffèrent, mais aucun siège ne change de parti.`,`All four formulas give the same allocation here: ${valid[0].seats.join(' / ')}. The calculations differ, but no seat changes party.`):L(`La formule change le nombre de sièges pour ${varying.join(' et ')}. Comparez ces colonnes; les autres partis gardent le même total.`,`The formula changes the seat count for ${varying.join(' and ')}. Compare those columns; the other parties keep the same total.`);
 const excluded=weights.map((v,i)=>({v,i})).filter(p=>p.v>0&&p.v*100<total*threshold);
 document.querySelector('#pr-threshold-message').textContent=total===0?'':excluded.length?L(`Seuil de ${threshold} % — partis exclus : ${excluded.map(p=>`${'ABCD'[p.i]} (${num(p.v/total*100)} %)`).join(', ')}. ${num(total-excluded.reduce((s,p)=>s+p.v,0))} voix participent à la répartition, sur ${num(total)}.`,`At the ${threshold}% threshold: ${excluded.map(p=>`${'ABCD'[p.i]} (${num(p.v/total*100)}%)`).join(', ')} excluded. ${num(total-excluded.reduce((s,p)=>s+p.v,0))} of ${num(total)} votes take part in allocation.`):L(`${num(total)} voix. Aucun parti ayant des voix n’est exclu au seuil de ${threshold} %.`,`${num(total)} votes. No party with votes is excluded at the ${threshold}% threshold.`);
 const ties=results.filter(r=>r.ties.length);
 document.querySelector('#pr-ties').textContent=ties.length?L('* Égalité(s) départagée(s) : ','* Allocation tie(s): ')+ties.map(r=>`${methodNames[r.method]} — ${tieText(r.ties[0])}${r.ties.length>1?' '+L(`${r.ties.length} égalités au total; voir le calcul détaillé.`,`${r.ties.length} ties in total; see the calculation details.`):''}`).join(' '):'';
 document.querySelector('#pr-dots').innerHTML=r.seats.map((count,i)=>Array.from({length:count},(_,j)=>`<span style="background:${colors[i]};--delay:${j*20}ms"></span>`).join('')).join('');
 document.querySelector('#pr-totals').innerHTML=r.seats.map((n,i)=>`<div><span><i style="background:${colors[i]}"></i>${'ABCD'[i]}</span><b>${r.error?'—':n}</b><small>${total?num(weights[i]/total*100):'0'} % ${L('des voix','of votes')}</small></div>`).join('');
 document.querySelector('#pr-explain').textContent=`${r.seats.reduce((a,b)=>a+b,0)} / ${seatCount} ${L('sièges attribués','seats allocated')}${r.quota?' · '+L('Quota : ','Quota: ')+num(r.quota):''}`;
 const descriptions={dhondt:L('D’Hondt : diviser les voix par 1, 2, 3… et attribuer les sièges aux plus grands quotients. Cette formule tend à avantager les grandes listes par rapport à Sainte-Laguë.','D’Hondt: divide votes by 1, 2, 3… and award seats to the highest quotients. It tends to favour larger lists compared with Sainte-Laguë.'),sainte:L('Sainte-Laguë : diviser les voix par 1, 3, 5… et attribuer les sièges aux plus grands quotients. Les petits partis peuvent obtenir un siège plus tôt qu’avec D’Hondt.','Sainte-Laguë: divide votes by 1, 3, 5… and award seats to the highest quotients. Smaller parties may obtain a seat earlier than under D’Hondt.'),hare:L('Hare : quota = voix admissibles ÷ sièges. Attribuer la partie entière, puis les sièges restants aux plus grands restes.','Hare: quota = eligible votes ÷ seats. Award whole quotas first, then remaining seats by largest remainders.'),droop:L('Droop : quota = plancher(voix admissibles ÷ (sièges + 1)) + 1. Attribuer la partie entière, puis les sièges restants aux plus grands restes.','Droop: quota = floor(eligible votes ÷ (seats + 1)) + 1. Award whole quotas first, then remaining seats by largest remainders.')};
 document.querySelector('#formula-explain').textContent=descriptions[formula];
 document.querySelector('#formula-ties').textContent=r.error?L('Calcul indisponible avec ces paramètres.','Calculation unavailable with these settings.'):r.ties.length?r.ties.map(tieText).join(' '):L('Aucune égalité à départager dans ce calcul.','No allocation tie in this calculation.');
}
function syncControls(){
 document.querySelectorAll('[data-votes]').forEach((el,i)=>el.value=weights[i]);
 document.querySelector('#pr-seats').value=seatCount;document.querySelector('#pr-threshold').value=threshold;document.querySelector('#pr-formula').value=formula;
}
export function mountAllocationLab(){
 document.querySelectorAll('[data-votes]').forEach(el=>{
  const update=()=>{const n=Number(el.value);weights[+el.dataset.votes]=Number.isFinite(n)?Math.round(Math.min(50000,Math.max(0,n))):0;if(el.value!==''&&n!==weights[+el.dataset.votes])el.value=weights[+el.dataset.votes];detectScenario();updateAllocation();};
  el.addEventListener('input',update);el.addEventListener('change',()=>{update();el.value=weights[+el.dataset.votes];});
 });
 document.querySelector('#pr-seats').onchange=e=>{seatCount=Number(e.target.value);detectScenario();updateAllocation();};
 document.querySelector('#pr-threshold').onchange=e=>{threshold=Number(e.target.value);detectScenario();updateAllocation();};
 document.querySelector('#pr-formula').onchange=e=>{formula=e.target.value;updateAllocation();};
 const setScenario=id=>{const s=allocationScenarios[id];weights=[...s.votes];seatCount=s.seats;threshold=s.threshold;scenarioId=id;syncControls();updateAllocation();};
 document.querySelectorAll('[data-allocation-scenario]').forEach(b=>b.onclick=()=>setScenario(b.dataset.allocationScenario));
 document.querySelector('#pr-reset').onclick=()=>{formula='dhondt';setScenario('same');};
 updateAllocation();
}
export function configureAllocation(input){
 if(!input||!Array.isArray(input.votes)||input.votes.length!==4||input.votes.some(v=>!Number.isInteger(v)||v<0||v>50000)||![5,7,10,12,15,20,25,30].includes(input.seats)||!methods.includes(input.formula)||![0,5].includes(input.threshold))throw new Error('Use four integer vote counts (0–50000), a supported seat count, formula, and threshold (0 or 5).');
 weights=[...input.votes];seatCount=input.seats;formula=input.formula;threshold=input.threshold;detectScenario();syncControls();updateAllocation();
 const section=document.querySelector('#formules-proportionnelles');if(section)section.open=true;
 const r=allocationWithTies(weights,seatCount,formula,threshold);return {votes:weights,seats:r.seats,formula,threshold,quota:r.quota,ties:r.ties,error:r.error||null};
}
