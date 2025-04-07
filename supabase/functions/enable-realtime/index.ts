
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.35.0";

serve(async (req) => {
  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // Get the table name from the request
    const { table_name } = await req.json();

    if (!table_name) {
      return new Response(
        JSON.stringify({ error: "Table name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Enable REPLICA IDENTITY FULL on the table
    const { data: enableReplicaResult, error: enableReplicaError } = await supabase
      .rpc("admin_enable_replica_identity", { table_name });

    if (enableReplicaError) {
      throw enableReplicaError;
    }

    // Add the table to the realtime publication
    const { data: enableRealtimeResult, error: enableRealtimeError } = await supabase
      .rpc("admin_enable_realtime", { table_name });

    if (enableRealtimeError) {
      throw enableRealtimeError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Realtime enabled for table ${table_name}`,
        replica_result: enableReplicaResult,
        realtime_result: enableRealtimeResult
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
