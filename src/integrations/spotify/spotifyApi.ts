
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { connectService } from "@/lib/api";

// Spotify API configuration
const SPOTIFY_CLIENT_ID = '9590f00f4f6b4fc080b08c85dc699e9f';
const SPOTIFY_REDIRECT_URI = window.location.origin + '/settings';
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'user-read-recently-played'
].join(' ');

// Initiate Spotify authentication flow
export const initiateSpotifyAuth = () => {
  // Generate a random state value for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store the state in localStorage for verification when the user returns
  localStorage.setItem('spotify_auth_state', state);
  
  // Build the Spotify authorization URL
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('scope', SPOTIFY_SCOPES);
  
  // Redirect the user to the Spotify authorization page
  window.location.href = authUrl.toString();
};

// Handle the Spotify callback after authorization
export const handleSpotifyCallback = async (code: string, state: string) => {
  try {
    // Verify the state parameter to prevent CSRF attacks
    const storedState = localStorage.getItem('spotify_auth_state');
    if (state !== storedState) {
      throw new Error('State verification failed');
    }
    
    // Clear the stored state
    localStorage.removeItem('spotify_auth_state');
    
    // Exchange the authorization code for an access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:b749e8a812b9421a867b62eaabc72b39`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Failed to exchange code for token');
    }
    
    const tokenData = await response.json();
    
    // Get the user's Spotify profile
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Spotify profile');
    }
    
    const profileData = await profileResponse.json();
    
    // Get the current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to connect Spotify');
    }
    
    // Save the Spotify connection in our database
    await connectService(
      user.id,
      'spotify',
      profileData.id,
      tokenData.access_token,
      tokenData.refresh_token,
      new Date(Date.now() + tokenData.expires_in * 1000)
    );
    
    toast.success('Connected to Spotify successfully!');
    return {
      success: true,
      profile: profileData
    };
  } catch (error: any) {
    console.error('Error connecting to Spotify:', error);
    toast.error(error.message || 'Failed to connect to Spotify');
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user's top tracks
export const getSpotifyTopTracks = async (timeRange = 'medium_term') => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in');
    }
    
    // Get the Spotify connection from the database
    const { data: serviceData, error } = await supabase
      .from('connected_services')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', 'spotify')
      .single();
    
    if (error || !serviceData) {
      throw new Error('Spotify not connected');
    }
    
    // Check if the token is expired and needs refreshing (implementation omitted for brevity)
    
    // Fetch top tracks
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20`, {
      headers: {
        'Authorization': `Bearer ${serviceData.access_token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }
    
    const data = await response.json();
    return data.items;
  } catch (error: any) {
    console.error('Error fetching Spotify top tracks:', error);
    return [];
  }
};

// Get user's recently played tracks
export const getSpotifyRecentlyPlayed = async (limit = 20) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in');
    }
    
    // Get the Spotify connection from the database
    const { data: serviceData, error } = await supabase
      .from('connected_services')
      .select('*')
      .eq('user_id', user.id)
      .eq('service_name', 'spotify')
      .single();
    
    if (error || !serviceData) {
      throw new Error('Spotify not connected');
    }
    
    // Fetch recently played tracks
    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${serviceData.access_token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recently played tracks');
    }
    
    const data = await response.json();
    return data.items;
  } catch (error: any) {
    console.error('Error fetching Spotify recently played tracks:', error);
    return [];
  }
};
