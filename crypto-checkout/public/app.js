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
const productCatalog={
 'ai-trial':{group:'ai',name:'Kanak AI — 1-Month Trial',amount:499,period:'1 month'},
 'ai-lifetime':{group:'ai',name:'Kanak AI — Lifetime Access',amount:5500,period:'lifetime'},
 'v1-script':{group:'v1',name:'Kanak Algo V1 — TV Script Only',amount:49,period:'1 month'},
 'v1-automation':{group:'v1',name:'Kanak Algo V1 — Script + EA',amount:199,period:'1 month'},
 'v1-lifetime':{group:'v1',name:'Kanak Algo V1 — Lifetime',amount:1099,period:'lifetime'},
 'sq9-monthly':{group:'sq9',name:'Sq9 Origin — Monthly Access',amount:25,period:'1 month'},
 'sq9-yearly':{group:'sq9',name:'Sq9 Origin — Yearly Access',amount:311,period:'1 year'}
};
const checkout=document.getElementById('checkout'),planSelect=document.getElementById('checkout-plan');
function updatePrice(){const plan=productCatalog[planSelect.value];document.getElementById('checkout-title').textContent=plan.name;document.getElementById('checkout-price').textContent='$'+plan.amount.toLocaleString('en-US')+' USD';document.getElementById('renewal-note').textContent=plan.period==='lifetime'?'One-time lifetime payment.':'Covers '+plan.period+' of access. Renewal requires a new crypto payment. No automatic wallet debit.';document.getElementById('checkout-status').textContent='';}
document.querySelectorAll('[data-checkout]').forEach(b=>b.addEventListener('click',()=>{const selected=productCatalog[b.dataset.checkout];document.querySelectorAll('dialog[open]').forEach(d=>d.close());planSelect.innerHTML=Object.entries(productCatalog).filter(([,p])=>p.group===selected.group).map(([id,p])=>'<option value="'+id+'">'+p.name+' — $'+p.amount+' USD</option>').join('');planSelect.value=b.dataset.checkout;updatePrice();checkout.showModal();}));
planSelect?.addEventListener('change',updatePrice);
document.getElementById('checkout-form')?.addEventListener('submit',async e=>{e.preventDefault();const button=document.getElementById('checkout-submit'),status=document.getElementById('checkout-status');button.disabled=true;button.textContent='Creating secure invoice…';status.textContent='Connecting to NOWPayments…';try{const response=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product:planSelect.value,email:document.getElementById('checkout-email').value.trim()})});const data=await response.json();if(!response.ok||!data.invoice_url)throw new Error(data.error||'Checkout is unavailable. Please try again or contact support.');const url=new URL(data.invoice_url);if(url.protocol!=='https:'||!(url.hostname==='nowpayments.io'||url.hostname.endsWith('.nowpayments.io')))throw Error('Unexpected payment address. Contact support.');status.textContent='Opening your secure NOWPayments invoice…';window.location.assign(url.href);}catch(error){status.textContent=error.message;}finally{button.disabled=false;button.textContent='Continue to NOWPayments ↗';}});
document.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('enquiry-plan').value=b.dataset.plan;document.getElementById('enquiry').scrollIntoView({behavior:'smooth'});document.querySelector('[name="name"]').focus({preventScroll:true});}));
document.getElementById('enquiry-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const subject=encodeURIComponent('Sq9 Origin enquiry — '+f.get('plan'));const body=encodeURIComponent('Name: '+f.get('name')+'\nEmail: '+f.get('email')+'\nPlan: '+f.get('plan')+'\nPlatform: '+f.get('platform')+'\n\n'+f.get('question'));window.location.href='mailto:Kanakmay26@gmail.com?subject='+subject+'&body='+body;document.getElementById('enquiry-status').textContent='Your email app will open. Review and send your enquiry there. If it does not open, email Kanakmay26@gmail.com directly.';});
