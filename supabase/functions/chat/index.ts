import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, chatType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Define system prompts based on chat type
    const systemPrompts: Record<string, string> = {
      citizen: `You are a helpful AI traffic assistant for Chennai city. You help citizens with:
- Traffic conditions and predictions for specific areas
- Best times to travel between locations
- Route suggestions and alternatives
- Weather impact on traffic
- General traffic-related queries

Always be concise, helpful, and provide actionable advice. Reference Chennai-specific locations like OMR, ECR, T. Nagar, Guindy, Anna Nagar, Velachery, etc.

Current context: You have access to real-time traffic data for Chennai. Provide specific, practical advice based on typical Chennai traffic patterns.`,

      authority: `You are an AI decision support system for Chennai traffic authorities. You help with:
- Traffic management decisions and deployment strategies
- Congestion analysis and predictions
- Staff deployment recommendations
- Traffic diversion suggestions
- Emergency response planning
- Data-driven insights for traffic control

Provide detailed, actionable recommendations with specific locations and times. Be professional and thorough.

Example insights you might provide:
- "Heavy congestion predicted in OMR at 6:45 PM due to rainfall and increased vehicle density. Recommend deploying additional traffic personnel at Tidel Park junction."
- "Signal timing optimization needed at Guindy industrial area during 8-10 AM to reduce bottleneck."

Always consider Chennai's specific geography, peak hours (8-10 AM, 5-8 PM), IT corridors (OMR, Guindy), and commercial zones (T. Nagar, Anna Nagar).`
    };

    const systemPrompt = systemPrompts[chatType] || systemPrompts.citizen;

    console.log(`Processing ${chatType} chat request with ${messages.length} messages`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response.";

    console.log("Successfully generated response");

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
