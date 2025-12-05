/**
 * Format price as Malaysian Ringgit (RM)
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'RM 0.00';
  
  return `RM ${numPrice.toFixed(2)}`;
};

/**
 * Format price without currency symbol (for calculations)
 */
export const formatPriceNumber = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0.00';
  
  return numPrice.toFixed(2);
};

