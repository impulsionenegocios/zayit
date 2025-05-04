export function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  
  return {
    start: start.toISOString().split('T')[0], // format: YYYY-MM-DD
    end: end.toISOString().split('T')[0]
  };
}

export function isDateInRange(dateStr: string, startDate: string, endDate: string) {
  if (!startDate || !endDate) return true;
  
  const date = new Date(dateStr);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  end.setHours(23, 59, 59, 999);
  
  return date >= start && date <= end;
}
