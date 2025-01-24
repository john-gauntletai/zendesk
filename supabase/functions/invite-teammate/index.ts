// Supabase Edge Function: create-user.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method === 'POST') {
    try {
      const { email, redirectTo } = await req.json();

      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: redirectTo
      });

      if (error) {  
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      return new Response(
        JSON.stringify({ message: 'User created successfully', data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return new Response('Method not allowed', { 
    status: 405,
    headers: corsHeaders 
  });
});