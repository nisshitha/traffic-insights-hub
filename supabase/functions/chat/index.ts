import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch current traffic data from database
    let trafficContext = "";
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { data: congestionData, error } = await supabase
        .from('congestion_data')
        .select(`
          congestion_level,
          prediction_30min,
          prediction_1hr,
          prediction_2hr,
          prediction_3hr,
          current_speed,
          vehicle_density,
          reason,
          recorded_at,
          chennai_areas (name, zone)
        `)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (!error && congestionData && congestionData.length > 0) {
        // Get unique areas with latest data
        const uniqueAreas = new Map();
        congestionData.forEach((item: any) => {
          const areaName = item.chennai_areas?.name;
          if (areaName && !uniqueAreas.has(areaName)) {
            uniqueAreas.set(areaName, item);
          }
        });

        const trafficSummary = Array.from(uniqueAreas.values()).map((item: any) => {
          return `- ${item.chennai_areas?.name} (${item.chennai_areas?.zone}): Current=${item.congestion_level}, 30min=${item.prediction_30min || 'N/A'}, 1hr=${item.prediction_1hr || 'N/A'}, 2hr=${item.prediction_2hr || 'N/A'}, 3hr=${item.prediction_3hr || 'N/A'}, Speed=${item.current_speed || 'N/A'}km/h, Density=${item.vehicle_density || 'N/A'}veh/km${item.reason ? ', Reason: ' + item.reason : ''}`;
        }).join('\n');

        trafficContext = `\n\n=== REAL-TIME TRAFFIC DATA ===\nLast updated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n${trafficSummary}\n\n=== END TRAFFIC DATA ===\n\nUse this real-time data to answer questions about current conditions and predictions. For predictions beyond 3 hours, extrapolate based on patterns and typical Chennai traffic behavior.`;
        
        console.log(`Loaded traffic data for ${uniqueAreas.size} areas`);
      }
    }

    // Define system prompts based on chat type
    const systemPrompts: Record<string, string> = {
      citizen: `You are a helpful AI traffic assistant for Chennai city. You help citizens with:
- Traffic conditions and predictions for specific areas
- Best times to travel between locations
- Route suggestions and alternatives
- Weather impact on traffic
- General traffic-related queries

You have access to REAL-TIME traffic data including:
- Current congestion levels (low/medium/high)
- 30-minute, 1-hour, 2-hour, and 3-hour predictions
- Current vehicle speeds and density
- Reasons for congestion (if any)

When users ask about future traffic (e.g., "how will traffic be in 3 hours"), use the prediction data to give accurate forecasts. Be specific with area names and prediction levels.

Always be concise, helpful, and provide actionable advice. Reference Chennai-specific locations like OMR, ECR, T. Nagar, Guindy, Anna Nagar, Velachery, etc.
${trafficContext}`,

      authority: `You are an AI decision support system for Chennai traffic authorities. You help with:
- Traffic management decisions and deployment strategies
- Congestion analysis and predictions
- Staff deployment recommendations
- Traffic diversion suggestions
- Emergency response planning
- Data-driven insights for traffic control

You have access to REAL-TIME traffic data including:
- Current congestion levels (low/medium/high)
- 30-minute, 1-hour, 2-hour, and 3-hour predictions
- Current vehicle speeds and density
- Reasons for congestion (if any)

When analyzing traffic or predicting future conditions, use this actual data. Provide specific insights like:
- "Based on current data, OMR is at HIGH congestion (15 km/h) and predicted to remain HIGH for the next 2 hours"
- "Recommend deploying personnel at Tidel Park junction - prediction shows worsening from medium to high in 30 mins"

Consider Chennai's specific geography, peak hours (8-10 AM, 5-8 PM), IT corridors (OMR, Guindy), and commercial zones (T. Nagar, Anna Nagar).
${trafficContext}`
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