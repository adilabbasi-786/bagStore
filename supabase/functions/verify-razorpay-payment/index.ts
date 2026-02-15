import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.131.0/node/crypto.ts";

// Initialize Supabase Client (optional if you want to update DB from here directly)
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: any;

const RAZORPAY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } });
  }

  try {
    const { orderCreationId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderCreationId || !razorpayPaymentId || !razorpaySignature) {
      throw new Error("Missing required parameters");
    }

    const shasum = createHmac("sha256", RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature) {
      return new Response(JSON.stringify({ status: "failure", message: "Invalid signature" }), {
        headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
        status: 400,
      });
    }

    // Success: Signature matches
    // Here you could also optionally update the order status in Supabase securely using a Service Role Key
    
    return new Response(JSON.stringify({ status: "success", message: "Payment verified" }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 500,
    });
  }
});