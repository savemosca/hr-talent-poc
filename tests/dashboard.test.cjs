'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const elements = {};
const labels = [{nodeValue:'SOFT SKILL PIÙ ALTE'}, {nodeValue:'SOFT SKILL →'}];
const document = {
  body: {}, documentElement: {dataset:{}},
  createTreeWalker() { let index = -1; return {nextNode() { return ++index < labels.length; }, get currentNode() { return labels[index]; }}; },
  querySelectorAll() { return []; },
  getElementById(id) { return elements[id] ??= {innerHTML:'', textContent:'', value:'', hidden:false, disabled:false, setAttribute(name,value) { this[name]=value; }, toggleAttribute(name,enabled) { this[name]=enabled; }, querySelectorAll() {return [];}, focus() {}, click() {}}; },
  createElement() {return {click() {}};}
};
const context = {document, navigator:{languages:['it-IT']}, NodeFilter:{SHOW_TEXT:4}, Blob, URL, setTimeout};
vm.createContext(context);
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
vm.runInContext(`
  const parsed=loadData(parseCSV(csvEncode(sampleRows())));
  if(parsed.length!==50 || new Set(parsed.map(p=>p.id)).size!==50) throw Error('Expected 50 unique profiles');
  if(new Set(parsed.map(p=>p.department)).size!==5) throw Error('Expected five departments');
  const quadrants=new Set();
  for(const department of new Set(parsed.map(p=>p.department))){
    const group=parsed.filter(p=>p.department===department);
    if(group.length!==10||new Set(group.map(p=>p.role)).size!==1) throw Error('Expected 10 people per role');
    const definitions=group.map(p=>p.skills.filter(s=>s.type==='hard').map(s=>s.skill+':'+s.weight).join('|'));
    if(new Set(definitions).size!==1) throw Error('Hard skills or weights differ within a role');
    for(const person of group){const soft=average(person.skills.filter(s=>s.type==='soft'));const hard=average(person.skills.filter(s=>s.type==='hard'));quadrants.add((soft>=3.5?'high':'low')+'-'+(hard>=3.5?'high':'low'));}
  }
  if(quadrants.size!==4) throw Error('Sample must span all four quadrants');
  const legacy=loadData([requiredHeaders,...sampleRows().map(row=>row.slice(0,requiredHeaders.length))]);
  if(legacy.length!==50||legacy[0].skills[0].target!=='') throw Error('Legacy CSV should not invent target levels');
  const badTarget=sampleRows();badTarget[0][18]=7;let targetRejected=false;try{loadData([headers,...badTarget])}catch{targetRejected=true}if(!targetRejected)throw Error('Invalid target accepted');
  const badHistory=sampleRows();badHistory[0][22]='2024-01-01:3|2023-01-01:2';let historyRejected=false;try{loadData([headers,...badHistory])}catch{historyRejected=true}if(!historyRejected)throw Error('Unordered history accepted');
  if(Math.abs(average([{current:3,weight:1},{current:5,weight:3}])-4.5)>1e-10) throw Error('Incorrect weighted average');
  const invalid=sampleRows(); invalid[0][11]=6; let rejected=false;
  try { loadData([headers,...invalid]); } catch { rejected=true; }
  if(!rejected) throw Error('Invalid score was accepted');
`,context);
assert.equal(elements.name.textContent,'Marco Bianchi');
assert.equal(elements['advanced-panel'].hidden,true);
elements['advanced-toggle'].onchange({target:{checked:true}});
assert.equal(elements['advanced-panel'].hidden,false);
assert.ok(elements['gap-content'].innerHTML.includes('Divario'));
assert.ok(elements['history-content'].innerHTML.includes('2024-07-15'));
assert.ok(elements['aspiration-content'].innerHTML.includes('coordinamento'));
assert.ok(elements['aspiration-content'].innerHTML.includes('Disponibilità'));
elements['advanced-toggle'].onchange({target:{checked:false}});
assert.equal(elements['advanced-panel'].hidden,true);
assert.equal(elements.theme['aria-pressed'],'false');
elements.theme.onclick();
assert.equal(elements.theme['aria-pressed'],'true');
assert.equal(document.documentElement.dataset.theme,'dark');
assert.equal(elements['flag-it'].hidden,false);
assert.equal(elements['flag-en'].hidden,true);
elements.theme.onclick();
elements.search.oninput({target:{value:'amina'}});
assert.equal(elements.name.textContent,'Amina Benali');
assert.equal(elements['result-count'].textContent,'1 di 50 persone');
elements.search.oninput({target:{value:'not-a-person'}});
assert.equal(elements.empty.hidden,false);
assert.equal(elements['dashboard-grid'].hidden,true);
elements['clear-filters'].onclick();
assert.equal(elements.empty.hidden,true);
elements.language.onchange({target:{value:'en'}});
assert.equal(elements['flag-it'].hidden,true);
assert.equal(elements['flag-en'].hidden,false);
assert.equal(labels[0].nodeValue,'HIGHEST SOFT SKILLS');
assert.equal(labels[1].nodeValue,'SOFT SKILLS →');
assert.equal(elements.role.textContent,'Assembly operator');
assert.ok(!elements.radar.innerHTML.includes('NaN'));
assert.ok(elements.radar.innerHTML.includes('dominant-baseline="middle"'));
assert.ok(elements['hard-list'].innerHTML.includes('Weight'));
console.log('PASS: import validation, scoring, search, empty state, language and skill detail');

function storage() {const values=new Map();return {getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};}
function boot(localStorage,sessionStorage,languages){
 const nodes={};const document={body:{},documentElement:{dataset:{}},createTreeWalker(){return{nextNode(){return false}}},querySelectorAll(){return[]},getElementById(id){return nodes[id]??={innerHTML:'',textContent:'',value:'',hidden:false,disabled:false,setAttribute(){},toggleAttribute(name,enabled){this[name]=enabled},querySelectorAll(){return[]},focus(){},click(){}}},createElement(){return{click(){}}}};
 const context={document,navigator:{languages},localStorage,sessionStorage,NodeFilter:{SHOW_TEXT:4},Blob,URL,setTimeout};vm.createContext(context);vm.runInContext(fs.readFileSync('app.js','utf8'),context);return {nodes,context,document};
}
(async()=>{
 const local=storage(),session=storage();
 let page=boot(local,session,['it-IT']);assert.equal(page.document.documentElement.lang,'it');
 page.nodes.language.onchange({target:{value:'en'}});page.nodes['advanced-toggle'].onchange({target:{checked:true}});assert.ok(page.nodes['gap-content'].innerHTML.includes('Gap'));
 page.nodes.search.value='Amina';page.nodes.search.oninput({target:page.nodes.search});assert.equal(page.nodes.name.textContent,'Amina Benali');
 page=boot(local,session,['it-IT']);assert.equal(page.document.documentElement.lang,'en');assert.equal(page.nodes['advanced-panel'].hidden,false);assert.equal(page.nodes.search.value,'Amina');assert.equal(page.nodes.name.textContent,'Amina Benali');
 const csv=vm.runInContext('csvEncode(sampleRows())',page.context);
 await page.nodes.file.onchange({target:{files:[{name:'demo.csv',text:async()=>csv}],value:'demo.csv'}});
 page.nodes.search.value='Amina';page.nodes.search.oninput({target:page.nodes.search});
 page=boot(local,session,['it-IT']);assert.equal(page.nodes.name.textContent,'Amina Benali');assert.ok(page.nodes.notice.textContent.includes('demo.csv'));assert.ok(page.nodes.notice.textContent.includes('session'));
 const english=boot(storage(),storage(),['en-US']);assert.equal(english.document.documentElement.lang,'en');
 const italian=boot(storage(),storage(),['it-IT']);assert.equal(italian.document.documentElement.lang,'it');
 console.log('PASS: browser language, saved language, refresh state and imported data');
})().catch(error=>{console.error(error);process.exitCode=1});
