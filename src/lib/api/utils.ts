
// Utilities
// ===========================================

export const generateRandomCode = (length: number) => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
};

// Realtime
// ===========================================

export const enableRealtimeForTable = async (tableName: string) => {
  const { error } = await supabase.functions.invoke('enable-realtime', {
    body: { table: tableName }
  });
  
  if (error) {
    console.error(`Failed to enable realtime for ${tableName}:`, error);
  }
  
  return !error;
};
