const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=document.querySelector('.navlinks').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.navlinks').classList.remove('open');menu?.setAttribute('aria-expanded','false');}));
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.dialog).showModal()));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close')?.addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
function calculate(){
 const p=Number(document.getElementById('anchor')?.value),s=Number(document.getElementById('unit')?.value),side=document.getElementById('direction')?.value;
 const tbody=document.getElementById('levels');if(!tbody)return;
 if(!Number.isFinite(p)||p<=0||!Number.isFinite(s)||s<0){tbody.innerHTML='<tr><td colspan="2">Enter a positive anchor and a non-negative unit.</td></tr>';return;}
 const unit=s>0?s:10**Math.floor(Math.log10(p*.0002));
 document.getElementById('unit-readout').textContent='Price unit: '+unit.toLocaleString('en-US',{maximumFractionDigits:8});
 tbody.innerHTML=[0,45,90,135,180,225,270,315,360].map(a=>{const root=Math.sqrt(p/unit)+(side==='down'?-1:1)*a/180;return '<tr><td>'+a+'°</td><td>'+(root>=0?(unit*root*root).toLocaleString('en-US',{minimumFractionDigits:3,maximumFractionDigits:3}):'Outside range')+'</td></tr>';}).join('');
}
document.querySelectorAll('.calculator input,.calculator select').forEach(e=>e.addEventListener('input',calculate));calculate();
document.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('enquiry-plan').value=b.dataset.plan;document.getElementById('enquiry').scrollIntoView({behavior:'smooth'});document.querySelector('[name="name"]').focus({preventScroll:true});}));
document.getElementById('enquiry-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const subject=encodeURIComponent('Sq9 Origin enquiry — '+f.get('plan'));const body=encodeURIComponent('Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\nPlan: '+f.get('plan')+'\nPlatform: '+f.get('platform')+'\n\n'+f.get('question'));window.location.href='mailto:Kanakmay26@gmail.com?subject='+subject+'&body='+body;document.getElementById('enquiry-status').textContent='Your email app will open. Review and send your enquiry there. If it does not open, email Kanakmay26@gmail.com directly.';});
