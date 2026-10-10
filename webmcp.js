import {configureAllocation} from './lab.js';
const context=document.modelContext;
if(context?.registerTool){
 const lifecycle=new AbortController();
 try{Promise.resolve(context.registerTool({
  name:'configure_seat_simulation',title:'Configure educational seat allocation',
  description:'Update the visible fictional four-party seat simulation. This only changes local page state; it does not store data or contact anyone.',
  inputSchema:{type:'object',properties:{votes:{type:'array',items:{type:'integer',minimum:0,maximum:50000},minItems:4,maxItems:4},seats:{type:'integer',enum:[5,7,10,12,15,20,25,30]},formula:{type:'string',enum:['dhondt','sainte','hare','droop']},threshold:{type:'integer',enum:[0,5]}},required:['votes','seats','formula','threshold'],additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},execute:configureAllocation
 },{signal:lifecycle.signal})).catch(()=>{});}catch{/* Enhancement is optional when unavailable. */}
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
