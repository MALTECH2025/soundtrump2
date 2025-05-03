
import { supabase } from "@/integrations/supabase/client";

// Services (Spotify, etc.)
// ===========================================

export const connectService = async (
  serviceName: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: string,
  serviceUserId: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if service already exists for user
    const { data: existingService } = await supabase
      .from('connected_services')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', serviceName)
      .single();

    if (existingService) {
      // Update the existing service
      const { error } = await supabase
        .from('connected_services')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingService.id);

      if (error) throw error;
    } else {
      // Create a new service connection
      const { error } = await supabase
        .from('connected_services')
        .insert({
          user_id: user.id,
          service_name: serviceName,
          service_user_id: serviceUserId,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt
        });

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error connecting ${serviceName}:`, error);
    return { success: false, error: error.message };
  }
};

export const getServiceConnection = async (serviceName: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { connected: false };
    }

    const { data, error } = await supabase
      .from('connected_services')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', serviceName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No match found (Supabase error code for no results from .single())
        return { connected: false };
      }
      throw error;
    }

    return {
      connected: true,
      serviceUserId: data.service_user_id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at
    };
  } catch (error: any) {
    console.error(`Error checking ${serviceName} connection:`, error);
    return { connected: false, error: error.message };
  }
};

export const disconnectService = async (serviceName: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('connected_services')
      .delete()
      .eq('user_id', user.id)
      .eq('service_name', serviceName);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error(`Error disconnecting ${serviceName}:`, error);
    return { success: false, error: error.message };
  }
};
