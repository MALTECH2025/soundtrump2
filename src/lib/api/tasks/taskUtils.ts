
import { supabase } from "@/integrations/supabase/client";

// Get task image URL
export const getTaskImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  const { data } = supabase.storage.from('task-images').getPublicUrl(cleanPath);
  return data.publicUrl;
};

// Get screenshot URL
export const getScreenshotUrl = (screenshotPath: string) => {
  if (!screenshotPath) return null;
  const { data } = supabase.storage.from('task-screenshots').getPublicUrl(screenshotPath);
  return data.publicUrl;
};
