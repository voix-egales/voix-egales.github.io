import {instantRunoff} from './elections.js';

export const practiceScenarios = {
 close: {
  label: ['Course serrée', 'A close contest'],
  note: ['Après les transferts, les 20 autres bulletins donnent 10 voix à A et 10 à B. Votre choix peut départager les projets; un bulletin sans préférence restante peut laisser une égalité.', 'After transfers, the other 20 ballots give A and B 10 votes each. Your choice can decide the winner; a ballot with no remaining preference can leave a tie.'],
  ballots: [{count:8,ranking:[0,1,2]},{count:7,ranking:[1,2,0]},{count:2,ranking:[2,0,1]},{count:3,ranking:[2,1,0]}]
 },
 transfer: {
  label: ['Un transfert, même gagnant', 'A transfer, same winner'],
  note: ['B gagne pour tous vos choix possibles dans ce scénario. Votre bulletin change son propre trajet et parfois les totaux, sans changer le gagnant.', 'B wins for every choice you can make in this scenario. Your ballot changes its own path and sometimes the totals, while the winner stays the same.'],
  ballots: [{count:8,ranking:[0,1,2]},{count:7,ranking:[1,2,0]},{count:5,ranking:[2,1,0]}]
 },
 majority: {
  label: ['Majorité dès le départ', 'A majority from the start'],
  note: ['A a déjà 12 des 20 autres voix. Un bulletin de plus ne change pas sa majorité : aucun transfert n’est nécessaire.', 'A already has 12 of the other 20 votes. One more ballot cannot change that majority, so no transfer is needed.'],
  ballots: [{count:12,ranking:[0,1,2]},{count:5,ranking:[1,2,0]},{count:3,ranking:[2,1,0]}]
 }
};
// Keep final ties visible: a teaching convention must not look like unanimous support.
function countScenario(ranking, scenarioId, includePersonal) {
 const scenario=practiceScenarios[scenarioId];
 if(!scenario)throw new Error('Unknown practice scenario.');
 const ballots=includePersonal?[...scenario.ballots,{count:1,ranking:[...ranking]}]:scenario.ballots;
 const result=[];
 for(const round of instantRunoff(ballots)) {
  const tie=round.active.length===2&&round.counts[round.active[0]]===round.counts[round.active[1]]?[...round.active]:null;
  result.push({...round, ...(tie?{winner:null,eliminated:null}:{}), tie,
   personalChoice:includePersonal?(ranking.find(i=>round.active.includes(i))??null):null,
   continuing:round.counts.reduce((a,b)=>a+b,0)});
  if(tie)break;
 }
 return result;
}
export function countPracticeBallot(ranking, scenarioId='close') {
 if(!Array.isArray(ranking)||ranking.length<1||ranking.length>3||ranking.some(v=>!Number.isInteger(v)||v<0||v>2)||new Set(ranking).size!==ranking.length)throw new Error('Use one to three different choices.');
 return countScenario(ranking,scenarioId,true);
}
export function practiceBaseline(scenarioId='close') { return countScenario([],scenarioId,false); }
let language='fr',scenarioId='close',choices=['',''],counted=null,roundIndex=0;
const L=(fr,en)=>language==='fr'?fr:en;
const localized=pair=>pair[language==='fr'?0:1];
const projects=()=>[L('Jardin partagé','Community garden'),L('Cinéma en plein air','Outdoor cinema'),L('Coin lecture','Reading corner')];
const fullName=i=>`${'ABC'[i]} · ${projects()[i]}`;

export function renderPracticeVote(lang) {
 language=lang;
 return `<div class="practice-vote" id="mon-bulletin">
 <div class="practice-heading"><div><p class="small-cap">${L('SUIVRE UNE VOIX','FOLLOW ONE VOTE')}</p><h3>${L('Que change votre bulletin ?','What does your ballot change?')}</h3></div><p>${L('Un quartier choisit un projet. Ajoutez votre bulletin à 20 votes fictifs, puis comparez le résultat et le trajet de votre voix.','A neighbourhood chooses one project. Add your ballot to 20 fictional votes, then compare the result and your vote’s path.')}</p></div>
 <div class="scenario-picker" role="group" aria-label="${L('Scénario du bulletin','Ballot scenario')}">${Object.entries(practiceScenarios).map(([id,s])=>`<button type="button" data-practice-scenario="${id}" aria-pressed="${scenarioId===id}">${localized(s.label)}</button>`).join('')}</div>
 <p id="practice-scenario-note" class="scenario-note">${localized(practiceScenarios[scenarioId].note)}</p>
 <div class="practice-grid"><form id="practice-form" class="practice-ballot" novalidate><p class="practice-label">${L('VOTRE BULLETIN D’EXERCICE','YOUR PRACTICE BALLOT')}</p>
 ${[0,1].map(i=>`<label for="practice-rank-${i}"><span>${i+1}<sup>${L(i===0?'er':'e',i===0?'st':'nd')}</sup> ${L('choix','choice')}${i?` <small>${L('(facultatif)','(optional)')}</small>`:''}</span><select id="practice-rank-${i}" data-practice-rank="${i}" ${i&&choices[i-1]===''?'disabled':''}><option value="">${i===0?L('Choisir un projet','Choose a project'):L('Aucun autre choix','No further choice')}</option>${projects().map((name,j)=>`<option value="${j}" ${choices[i]===String(j)?'selected':''}>${'ABC'[j]} · ${name}</option>`).join('')}</select></label>`).join('')}
 <p class="practice-instruction">${L('Deux choix suffisent dans cet exemple à trois projets. Ne répétez pas un projet. Le deuxième choix sert uniquement si le premier est éliminé.','Two choices are enough in this three-project example. Do not repeat a project. Your second choice is used only if your first is eliminated.')}</p>
 <p id="practice-error" class="practice-error" role="status"></p><div class="practice-actions"><button type="submit" class="button">${L('Voir mon résultat','See my result')}</button><button type="button" class="text-control" id="practice-clear">${L('Effacer','Clear')}</button></div></form>
 <div id="practice-output" class="practice-output" tabindex="-1" aria-live="polite" aria-atomic="true">${output()}</div></div>
 <div class="practice-bottom"><p>${L('Votre voix compte une seule fois par tour. Changer un bulletin ne change pas toujours le gagnant : cela dépend des autres votes.','Your vote counts once per round. Changing one ballot does not always change the winner: it depends on the other votes.')}</p><details class="practice-details"><summary>${L('Voir les 20 autres bulletins et les règles','See the other 20 ballots and the rules')}</summary><div id="practice-fixed" class="practice-fixed">${fixedBallots()}</div><p>${L('Il faut strictement plus de la moitié des bulletins encore actifs. Sans majorité, le projet le moins soutenu est éliminé. Une égalité finale reste affichée comme une égalité; cet exercice n’attribue pas de gagnant par défaut.','A winner needs strictly more than half the continuing ballots. Without a majority, the lowest project is eliminated. A final tie stays visible as a tie; this exercise does not award a default winner.')}</p><p>${L('Le troisième choix ne départagerait pas l’égalité finale de cet exemple. Cet exercice général autorise le classement incomplet; la Chambre australienne demande de classer toutes les candidatures.','A third choice would not resolve this example’s final tie. This general exercise allows incomplete rankings; Australia’s House requires ranking every candidate.')}</p><p>${L('Exercice fictif, pas un sondage. Choix uniquement dans cette page; aucun enregistrement ni envoi.','A fictional exercise, not a poll. Choices stay in this page; nothing is stored or submitted.')}</p></details></div></div>`;
}
function fixedBallots() {
 return practiceScenarios[scenarioId].ballots.map(b=>`<span><strong>${b.count}</strong> ${L('bulletins','ballots')} · ${b.ranking.map(i=>'ABC'[i]).join(' → ')}</span>`).join('');
}
function resultLabel(final) {
 return final.tie?L('Égalité entre A et B','A and B are tied'):L(`${fullName(final.winner)} gagne`,`${fullName(final.winner)} wins`);
}
function effect(final) {
 const baseline=practiceBaseline(scenarioId).at(-1);
 const countedFor=final.personalChoice;
 const ballot=countedFor===null?L('Votre bulletin n’a plus de préférence restante.','Your ballot has no remaining preference.'):L(`Votre voix ajoute 1 au total de ${'ABC'[countedFor]}.`,`Your ballot adds 1 to ${'ABC'[countedFor]}’s total.`);
 const outcome=final.tie?L('Sans votre bulletin comme avec lui, A et B restent à 10–10. Aucun projet ne dépasse la moitié.','With or without your ballot, A and B remain tied at 10–10. Neither project has more than half.'):baseline.tie?L(`Sans votre bulletin, A et B seraient à égalité. Avec lui, ${'ABC'[final.winner]} obtient la majorité.`,`Without your ballot, A and B would be tied. With it, ${'ABC'[final.winner]} has a majority.`):L(`Le gagnant reste ${'ABC'[final.winner]} : les autres bulletins lui donnent déjà suffisamment de voix.`,`The winner remains ${'ABC'[final.winner]}: the other ballots already give that project enough votes.`);
 return `${ballot} ${outcome}`;
}
function output() {
 if(!counted)return `<div class="practice-empty"><span aria-hidden="true">A · B · C</span><h4>${L('Ajoutez votre premier choix.','Add your first choice.')}</h4><p>${L('Le résultat final apparaîtra ici, avec ce que votre bulletin a changé.','The final result will appear here, with an explanation of what your ballot changed.')} ${scenarioId==='majority'?L('Dans ce scénario, aucun transfert n’est nécessaire.','No transfer is needed in this scenario.'):L('Pour suivre un transfert, choisissez C en premier.','To follow a transfer, choose C first.')}</p><p class="practice-not-poll">${L('Vous pouvez garder votre bulletin et changer de scénario.','You can keep your ballot and switch scenarios.')}</p></div>`;
 const final=counted.at(-1),round=counted[roundIndex],isLast=roundIndex===counted.length-1;
 const first=choices[0],personal=round.personalChoice;
 const trace=roundIndex&&String(personal)!==first?`${'ABC'[Number(first)]} → ${personal===null?'∅':'ABC'[personal]}`:personal===null?'∅':'ABC'[personal];
 const personalText=personal===null?L('Votre bulletin ne compte plus dans ce tour.','Your ballot no longer counts in this round.'):L('Votre voix compte pour ','Your vote counts for ')+fullName(personal)+'.';
 return `<div class="practice-final"><span class="small-cap">${L('RÉSULTAT FINAL','FINAL RESULT')}</span><h4>${resultLabel(final)}</h4><p>${effect(final)}</p></div>
 <div class="practice-round-label">${isLast?L('DÉCOMPTE FINAL','FINAL COUNT'):L('PREMIER DÉCOMPTE','FIRST COUNT')}<span>${round.continuing} ${L('bulletins actifs','continuing ballots')}</span></div>
 <div class="practice-trace"><strong>${trace}</strong><p>${personalText}</p></div>
 <div class="practice-bars">${projects().map((name,i)=>`<div class="practice-result-row ${personal===i?'is-yours':''}"><span>${'ABC'[i]}</span><div><span class="practice-fill" style="width:${round.counts[i]/round.continuing*100}%;--practice-colour:${['#d4ed8a','#efb4a5','#b2a4d8'][i]}"></span></div><strong>${round.counts[i]}</strong></div>`).join('')}</div>
 <p class="practice-round-note">${round.tie?L('10 voix sur 20 chacun : personne ne dépasse la moitié.','10 of 20 votes each: neither project has more than half.'):round.winner!==null?L(`${'ABC'[round.winner]} obtient ${round.counts[round.winner]} voix sur ${round.continuing}.`,`${'ABC'[round.winner]} receives ${round.counts[round.winner]} of ${round.continuing} votes.`):L(`${fullName(round.eliminated)} est éliminé; ses bulletins passent aux prochains choix encore en lice.`,`${fullName(round.eliminated)} is eliminated; its ballots move to the next continuing choices.`)} ${L(`Majorité requise : ${Math.floor(round.continuing/2)+1}.`,`Majority required: ${Math.floor(round.continuing/2)+1}.`)}</p>
 ${round.exhausted?`<p class="practice-exhausted">${L('1 bulletin sans préférence restante : 20 bulletins actifs sur les 21 au départ.','1 ballot has no remaining preference: 20 continuing ballots out of the original 21.')}</p>`:''}
 <div class="practice-progress">${counted.length>1?`<button type="button" class="text-control" data-practice-action="${isLast?'restart':'next'}">${isLast?L('Revoir le trajet depuis le début','Review the ballot’s journey'):L('Voir le transfert','See the transfer')}</button>`:`<span>${L('Aucun transfert nécessaire.','No transfer needed.')}</span>`}<span>${L('Une voix par tour.','One vote per round.')}</span></div>`;
}
export function mountPracticeVote() {
 const controls=[...document.querySelectorAll('[data-practice-rank]')],panel=document.querySelector('#practice-output'),error=document.querySelector('#practice-error');
 const update=()=>{controls.forEach((control,i)=>{control.value=choices[i];control.disabled=i>0&&choices[i-1]==='';});panel.innerHTML=output();};
 controls.forEach((control,i)=>control.onchange=()=>{choices[i]=control.value;if(control.value==='')for(let j=i+1;j<choices.length;j++)choices[j]='';counted=null;roundIndex=0;error.textContent='';update();});
 document.querySelector('#practice-form').onsubmit=event=>{
  event.preventDefault();
  try{counted=countPracticeBallot(choices.filter(v=>v!=='').map(Number),scenarioId);error.textContent='';roundIndex=counted.length-1;update();panel.focus({preventScroll:true});panel.scrollIntoView({block:'nearest',behavior:'auto'});}
  catch{error.textContent=L('Indiquez un premier choix, sans répéter un projet.','Choose a first preference without repeating a project.');counted=null;panel.innerHTML=output();controls[0].focus();}
 };
 document.querySelector('#practice-clear').onclick=()=>{choices=['',''];counted=null;roundIndex=0;error.textContent='';update();controls[0].focus();};
 document.querySelectorAll('[data-practice-scenario]').forEach(button=>button.onclick=()=>{
  scenarioId=button.dataset.practiceScenario;
  document.querySelectorAll('[data-practice-scenario]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  document.querySelector('#practice-scenario-note').textContent=localized(practiceScenarios[scenarioId].note);
  document.querySelector('#practice-fixed').innerHTML=fixedBallots();
  if(counted){counted=countPracticeBallot(choices.filter(v=>v!=='').map(Number),scenarioId);roundIndex=counted.length-1;}
  update();
 });
 panel.onclick=event=>{const button=event.target.closest('[data-practice-action]');if(!button||!counted)return;roundIndex=button.dataset.practiceAction==='next'?Math.min(roundIndex+1,counted.length-1):0;panel.innerHTML=output();panel.querySelector('[data-practice-action]')?.focus({preventScroll:true});};
}
