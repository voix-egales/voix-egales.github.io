/** Transparent educational algorithms. Ties use candidate input order. */
export function apportion(votes, seats, method = 'sainte', threshold = 0) {
  if (!Number.isInteger(seats) || seats < 1 || seats > 1000 || !Array.isArray(votes) || !votes.length || votes.some(v => !Number.isSafeInteger(v) || v < 0 || v > 1000000000) || !Number.isFinite(threshold) || threshold < 0 || threshold > 100) throw new Error('Invalid inputs');
  if (!['dhondt', 'sainte', 'hare', 'droop'].includes(method)) throw new Error('Unknown method');
  const total = votes.reduce((a,b) => a+b,0);
  const eligible = votes.map((v,i)=>({v,i})).filter(x=>x.v>0 && x.v * 100 >= total * threshold);
  const result = votes.map(()=>0), rounds=[];
  if (!eligible.length) return {seats:result, rounds, quota:null};
  const valid = eligible.reduce((a,b)=>a+b.v,0);
  let quota = null;
  if (method === 'hare' || method === 'droop') {
    quota = method === 'hare' ? valid/seats : Math.floor(valid/(seats+1))+1;
    for (const {v,i} of eligible) result[i]=Math.floor(method==='hare'?v*seats/valid:v/quota);
    const remainders = eligible.map(({v,i})=>({i,r:method==='hare'?(v*seats)%valid:v-result[i]*quota})).sort((a,b)=>b.r-a.r || a.i-b.i);
    let remaining=seats-result.reduce((a,b)=>a+b,0);
    if(remaining>eligible.length) return {seats:votes.map(()=>0),rounds:[],quota,error:'insufficient-votes'};
    for(let k=0;remaining>0;k++,remaining--) result[remainders[k].i]++;
  } else {
    for(let s=0;s<seats;s++){
      const ranked=eligible.map(({v,i})=>({i,v,d:method==='dhondt'?result[i]+1:result[i]*2+1})).sort((a,b)=>b.v*a.d-a.v*b.d||a.i-b.i);
      result[ranked[0].i]++;
      rounds.push({winner:ranked[0].i, quotient:ranked[0].v/ranked[0].d, seats:[...result]});
    }
  }
  return {seats:result, rounds, quota};
}
export const profiles = [
  {count:42, ranking:[0,1,2], scores:[5,1,0]},
  {count:33, ranking:[1,2,0], scores:[0,5,3]},
  {count:25, ranking:[2,1,0], scores:[0,4,5]},
];
export function instantRunoff(ballots, candidates=3){
  let active=Array.from({length:candidates},(_,i)=>i), rounds=[];
  while(active.length){
    const counts=Array(candidates).fill(0);let exhausted=0;
    for(const b of ballots){const first=b.ranking.find(i=>active.includes(i)); if(first===undefined)exhausted+=b.count;else counts[first]+=b.count;}
    const continuing=counts.reduce((a,b)=>a+b,0);
    const order=[...active].sort((a,b)=>counts[b]-counts[a]||a-b);
    const winner=continuing>0 && (counts[order[0]]>continuing/2||active.length===1)?order[0]:null;
    if(!continuing){rounds.push({counts,active:[...active],winner:null,exhausted,eliminated:null});break;}
    const eliminated=winner===null?order[order.length-1]:null;
    rounds.push({counts,active:[...active],winner,exhausted,eliminated});
    if(winner!==null)break;
    active=active.filter(i=>i!==eliminated);
  }
  return rounds;
}
export function star(ballots,candidates=3){
  const totals=Array(candidates).fill(0);
  for(const b of ballots)for(let i=0;i<candidates;i++)totals[i]+=b.count*b.scores[i];
  const finalists=totals.map((v,i)=>i).sort((a,b)=>totals[b]-totals[a]||a-b).slice(0,2);
  const runoff=Array(candidates).fill(0);let equal=0;
  for(const b of ballots){const [a,c]=finalists;if(b.scores[a]===b.scores[c])equal+=b.count;else runoff[b.scores[a]>b.scores[c]?a:c]+=b.count;}
  const winner=[...finalists].sort((a,b)=>runoff[b]-runoff[a]||a-b)[0];
  return {totals,finalists,runoff,equal,winner};
}
export const palette=['#8cb7cb','#eab1a3','#b7a6d8','#c7db8b','#e6c97b','#a3afba'];
export function hemisphere(counts){
  const total=counts.reduce((a,b)=>a+b,0), points=[];
  // 125 seats fill five rows; extra seats go to the outer rows, where spacing is widest.
  const rows=[16,21,25,29,34];
  for(let extra=total-125,row=4;extra>0;extra--,row=row===2?4:row-1)rows[row]++;
  let index=0;
  for(let row=0;row<rows.length;row++)for(let j=0;j<rows[row];j++){
    const angle=Math.PI-(j/(rows[row]-1))*Math.PI;
    const radius=82+row*30;
    let sum=0,group=0;for(;group<counts.length;group++){sum+=counts[group];if(index<sum)break;}
    points.push({x:240+Math.cos(angle)*radius,y:224-Math.sin(angle)*radius,group:Math.min(group,counts.length-1),index});index++;
  }
  const ordered=[...points].sort((a,b)=>Math.atan2(224-b.y,b.x-240)-Math.atan2(224-a.y,a.x-240)||a.index-b.index);
  ordered.forEach((p,k)=>{let sum=0;for(let i=0;i<counts.length;i++){sum+=counts[i];if(k<sum){p.group=i;break;}}});
  return points.slice(0,total);
}
