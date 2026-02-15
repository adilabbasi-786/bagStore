import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Razorpay from "npm:razorpay@2.8.6";

declare const Deno: any;

const razorpay = new Razorpay({
  key_id: Deno.env.get("RAZORPAY_KEY_ID") || "",
  key_secret: Deno.env.get("RAZORPAY_KEY_SECRET") || "",
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } });
  }

  try {
    const { amount, currency = "INR" } = await req.json();
    
    const options = {
      amount: Math.round(amount * 100), // convert to smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify(order), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});