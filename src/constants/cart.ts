export const MINIMUM_ORDER_AMOUNT = 19.99;
export const DELIVERY_FEE = 5.00;

// Berechne den verbleibenden Betrag bis zum Mindestbestellwert
export const calculateRemainingAmount = (currentAmount: number): number => {
  return Math.max(0, MINIMUM_ORDER_AMOUNT - currentAmount);
};

// Überprüfe, ob die Mindestbestellmenge erreicht wurde
export const isMinimumOrderReached = (amount: number): boolean => {
  return amount >= MINIMUM_ORDER_AMOUNT;
};
