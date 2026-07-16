export const ORDER_STATUS = {
  HOLD: "Hold",
  COMPLETED: "Completed",
  RETURNED: "Returned",
} as const;

export const ORDER_TYPE = {
  DINE_IN: "DineIn",
  TAKE_AWAY: "TakeAway",
  DELIVERY: "Delivery",
} as const;

export const DISCOUNT_TYPE = {
  AMOUNT: "Amount",
  PERCENTAGE: "Percentage",
} as const;

export const PAYMENT_METHOD = {
  CASH: "Cash",
  VISA: "Visa",
  INSTAPAY: "Instapay",
  WALLET: "Wallet",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];
export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
