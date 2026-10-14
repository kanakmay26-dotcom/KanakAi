import assert from 'node:assert/strict';
import {checkout,products} from '../worker/checkout.mjs';
const req=data=>new Request('https://preview.example/api/checkout',{method:'POST',headers:{origin:'https://preview.example','Content-Type':'application/json'},body:JSON.stringify(data)});
let payload;
const good=async(url,options)=>{assert.equal(url,'https://kanak-ai-site-six.vercel.app/api/create-invoice');payload=JSON.parse(options.body);return new Response(JSON.stringify({automated:true,invoice_url:'https://nowpayments.io/payment/?iid=test'}));};
for(const [product,plan] of Object.entries(products)){const response=await checkout(req({product,email:'buyer@example.com',price_amount:1}),good);assert.equal(response.status,200);assert.equal(payload.price_amount,plan.amount.toFixed(2));assert.ok(payload.order_description.includes(plan.name));}
assert.equal((await checkout(req({product:'fake',email:'buyer@example.com'}),good)).status,400);
assert.equal((await checkout(req({product:'sq9-monthly',email:'bad'}),good)).status,400);
assert.equal((await checkout(new Request('https://preview.example/api/checkout',{method:'GET'}),good)).status,405);
assert.equal((await checkout(new Request('https://preview.example/api/checkout',{method:'POST',headers:{origin:'https://other.example','Content-Type':'application/json'},body:'{}'}),good)).status,403);
assert.equal((await checkout(req({product:'sq9-monthly',email:'buyer@example.com'}),async()=>new Response(JSON.stringify({automated:true,invoice_url:'https://nowpayments.io.evil.example/'})))).status,502);
assert.equal((await checkout(req({product:'sq9-monthly',email:'buyer@example.com'}),async()=>new Response('{}',{status:500}))).status,502);
console.log('Passed: all seven fixed-price tiers, price tampering, invalid product/email, cross-origin rejection, unsafe redirect and provider failure');
