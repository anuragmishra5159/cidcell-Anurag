export const formatTime12h = (timeStr) => {
  if (!timeStr) return '';
  
  // Check if it's already in a format like "10:00 AM" (maybe some old data)
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;

  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  const m = minutes || '00';
  
  return `${h}:${m} ${ampm}`;
};
