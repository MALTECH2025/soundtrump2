
import { supabase } from "@/integrations/supabase/client";

// Get task image URL
export const getTaskImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  const { data } = supabase.storage.from('task-images').getPublicUrl(imagePath);
  return data.publicUrl;
};

// Get screenshot URL
export const getScreenshotUrl = (screenshotPath: string) => {
  if (!screenshotPath) return null;
  const { data } = supabase.storage.from('task-screenshots').getPublicUrl(screenshotPath);
  return data.publicUrl;
};
