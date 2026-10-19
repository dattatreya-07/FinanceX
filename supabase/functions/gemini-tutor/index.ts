// Supabase Edge Function: gemini-tutor (Legacy/Compatibility Alias to Finance Tutor)
// Proxies to FinanceX Hugging Face & Gemini LLM Pipeline with RAG Context

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized user.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, conversationId, topic, language = 'en', groundedContext, history = [] } = await req.json();
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt parameter.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hfToken = Deno.env.get('HF_TOKEN');
    const hfModel = Deno.env.get('HF_MODEL') || 'Qwen/Qwen2.5-72B-Instruct';
    const geminiKey = Deno.env.get('GEMINI_API_KEY');

    const systemInstruction = `You are the FinanceX AI Financial Educational Tutor. Specialize in NISM certifications, SEBI regulations, derivatives, bonds, and valuation. 
Format: Direct Answer, Explanation, Example, Formula, Caveats. 
Language: ${language === 'ta' ? 'Respond in Tamil with English financial terms retained.' : 'Respond in crisp English.'}
${groundedContext ? `\nCurriculum Grounding:\n${groundedContext}` : ''}`;

    let replyText = '';
    let modelUsed = 'unknown';

    if (hfToken) {
      modelUsed = hfModel;
      const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${hfModel}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: hfModel,
          messages: [
            { role: 'system', content: systemInstruction },
            ...history.slice(-4).map((m: any) => ({ role: m.sender === 'USER' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: `[Topic: ${topic || 'General'}] ${prompt}` }
          ],
          max_tokens: 1024,
          temperature: 0.3
        })
      });

      if (hfResponse.ok) {
        const data = await hfResponse.json();
        replyText = data.choices?.[0]?.message?.content || '';
      }
    }

    if (!replyText && geminiKey) {
      modelUsed = 'gemini-1.5-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nContext/Topic: ${topic || 'General'}\n\nLearner Question: ${prompt}` }]
              }
            ]
          })
        }
      );
      const data = await response.json();
      replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    if (!replyText) {
      replyText = `### Financial Concept Analysis: ${prompt}\n\nPlease ensure HF_TOKEN or GEMINI_API_KEY is configured on the backend for live LLM inference.`;
    }

    if (conversationId) {
      await supabaseClient.from('ai_messages').insert([
        { conversation_id: conversationId, sender_type: 'USER', message_text: prompt },
        { conversation_id: conversationId, sender_type: 'AI', message_text: replyText }
      ]);
    }

    return new Response(
      JSON.stringify({ reply: replyText, model: modelUsed, latencyMs: Date.now() - startTime }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
