export const products={
 'ai-trial':{name:'Kanak AI — 1-Month Trial',amount:499},
 'ai-lifetime':{name:'Kanak AI — Lifetime Access',amount:5500},
 'v1-script':{name:'Kanak Algo V1 — TV Script Only',amount:49},
 'v1-automation':{name:'Kanak Algo V1 — Script + EA',amount:199},
 'v1-lifetime':{name:'Kanak Algo V1 — Lifetime',amount:1099},
 'sq9-monthly':{name:'Sq9 Origin — Monthly Access',amount:25},
 'sq9-yearly':{name:'Sq9 Origin — Yearly Access',amount:311}
};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export async function checkout(request,fetcher=fetch){
 if(request.method!=='POST')return json({error:'Use POST to create a checkout.'},405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Open checkout from this website.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required.'},415);
 if(Number(request.headers.get('content-length')||0)>2048)return json({error:'Request too large.'},413);
 let data;try{const raw=await request.text();if(raw.length>2048)return json({error:'Request too large.'},413);data=JSON.parse(raw);}catch{return json({error:'Invalid request.'},400);}
 const plan=Object.hasOwn(products,data?.product)?products[data.product]:null;
 if(!plan||typeof data.email!=='string'||data.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))return json({error:'Choose a valid plan and delivery email.'},400);
 try{
  const response=await fetcher('https://kanak-ai-site-six.vercel.app/api/create-invoice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({price_amount:plan.amount.toFixed(2),order_description:plan.name+' | Delivery: '+data.email}),signal:AbortSignal.timeout(20000)});
  if(!response.ok)return json({error:'NOWPayments checkout is temporarily unavailable. Please try again or contact support.'},502);
  const result=await response.json();
  if(!result.automated||!result.invoice_url)return json({error:'Crypto checkout is not configured. Please contact support.'},503);
  const url=new URL(result.invoice_url);
  if(url.protocol!=='https:'||!(url.hostname==='nowpayments.io'||url.hostname.endsWith('.nowpayments.io')))return json({error:'Payment link could not be verified. Please contact support.'},502);
  return json({invoice_url:url.href});
 }catch{return json({error:'Could not create the payment link. Please try again or contact support.'},502);}
}
