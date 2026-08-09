export const getDaysRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getExpiryPriority = (daysRemaining) => {
  if (daysRemaining < 0) return { label: 'Expired', color: '#ef4444', priority: 'High' };
  if (daysRemaining <= 7) return { label: 'Expiring in <=7 Days', color: '#f59e0b', priority: 'Critical' };
  if (daysRemaining <= 30) return { label: 'Expiring in <=30 Days', color: '#3b82f6', priority: 'Medium' };
  return { label: 'Valid', color: '#22c55e', priority: 'Low' };
};
