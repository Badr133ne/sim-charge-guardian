
/**
 * Utility to parse SMS messages and extract recharge information
 */

interface ParsedRechargeData {
  amount: number | null;
  operationId: string | null;
}

/**
 * Parse an SMS message to extract recharge information
 * @param message - The SMS message content
 * @returns Parsed recharge data with amount and operationId
 */
export const parseRechargeSms = (message: string): ParsedRechargeData => {
  const result: ParsedRechargeData = {
    amount: null,
    operationId: null,
  };

  // Check if message is a recharge confirmation
  const isRechargeMessage = /vous avez reçu|recharge de|montant|crédit/i.test(message);
  
  if (!isRechargeMessage) {
    return result;
  }

  // Extract amount - handle different formats: 1,800 DA, 1.800 DA, 1800 DA
  const amountMatch = message.match(/(\d+[.,]?\d*)\s*(?:DA|DZD|dinars?)/i);
  if (amountMatch) {
    const amountString = amountMatch[1].replace(',', '.');
    result.amount = parseFloat(amountString);
  }

  // Extract operation ID - common formats include "ID:", "Ref:", "N°:", followed by digits
  const idMatch = message.match(/(?:ID|Ref|N°|Num[eé]ro)[\s:]*(\w+)/i);
  if (idMatch) {
    result.operationId = idMatch[1];
  }

  return result;
};

/**
 * Check if an SMS message is related to recharge
 * @param message - The SMS message content
 * @returns boolean indicating if the SMS is a recharge notification
 */
export const isRechargeSms = (message: string): boolean => {
  const keywords = [
    'recharg',
    'crédit',
    'solde',
    'montant',
    'vous avez reçu',
    'ooredoo',
    'mobilis',
    'djezzy',
  ];
  
  const lowercaseMessage = message.toLowerCase();
  return keywords.some(keyword => lowercaseMessage.includes(keyword.toLowerCase()));
};
