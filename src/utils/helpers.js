// Format price to USD currency
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculate cart totals
export const calculateCartTotals = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  return { subtotal, shipping, tax, total };
};