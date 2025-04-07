
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0"

interface EnableRealtimeRequestBody {
  table_name: string;
}

serve(async (req) => {
  try {
    // Extract the request data
    const { table_name } = await req.json() as EnableRealtimeRequestBody;

    if (!table_name) {
      return new Response(
        JSON.stringify({ success: false, message: "Table name is required" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create Supabase client using admin access from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Execute SQL to enable realtime on the table
    const { error } = await supabase.rpc("enable_realtime_for_table", {
      table_name: table_name,
    });

    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Error enabling realtime for ${table_name}: ${error.message}`
        }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Realtime enabled for ${table_name}`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Unexpected error: ${error.message}`
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
})
