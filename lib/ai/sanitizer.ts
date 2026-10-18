/**
 * SettlementCheck Pre-Gateway Privacy & PII Edge Filter
 * Fixes SC-E-PRIV-002 / SC-B-003 (P0 Privacy & UK GDPR Article 9 Remediation)
 *
 * Sanitizes draft settlement agreements and user inputs before transmission to
 * external cloud LLM gateways (Gemini, Claude, OpenAI), preventing exposure of
 * UK GDPR Article 9 Special Category Data, bank details, and personal identifiers.
 */

export interface SanitizationResult {
  sanitizedText: string;
  redactedCount: number;
  redactedCategories: string[];
}

export function sanitizePiiAndSpecialCategoryData(rawText: string): SanitizationResult {
  if (!rawText || typeof rawText !== 'string') {
    return { sanitizedText: '', redactedCount: 0, redactedCategories: [] };
  }

  let text = rawText;
  let count = 0;
  const categoriesSet = new Set<string>();

  // 1. UK National Insurance (NI) Numbers (e.g., QQ 12 34 56 A, AB123456C)
  const niPattern = /\b[A-Za-z]{2}[ \t\-]?[0-9]{2}[ \t\-]?[0-9]{2}[ \t\-]?[0-9]{2}[ \t\-]?[A-Da-d\s]?\b/g;
  text = text.replace(niPattern, (match) => {
    // Ensure it's not a short 2-letter word followed by numbers that isn't an NI number
    if (match.replace(/[^0-9]/g, '').length === 6) {
      count++;
      categoriesSet.add('National Insurance Number');
      return '[REDACTED_NI_NUMBER]';
    }
    return match;
  });

  // 2. UK Bank Sort Codes (e.g., 12-34-56, 12 34 56, Sort Code: 123456)
  const sortCodePattern = /\b(?:sort\s*code\s*[:#]?\s*)?(\d{2}[- \t]\d{2}[- \t]\d{2})\b/gi;
  text = text.replace(sortCodePattern, () => {
    count++;
    categoriesSet.add('Bank Sort Code');
    return '[REDACTED_SORT_CODE]';
  });

  // 3. UK Bank Account Numbers (e.g., Acc No: 12345678, Account: 12345678)
  const bankAccPattern = /\b(?:(?:account|acc|a\/c)\s*(?:no\.?|number)?\s*[:#]?\s*)(\d{7,8})\b/gi;
  text = text.replace(bankAccPattern, () => {
    count++;
    categoriesSet.add('Bank Account Number');
    return '[REDACTED_ACCOUNT_NUMBER]';
  });

  // 4. Email Addresses
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  text = text.replace(emailPattern, () => {
    count++;
    categoriesSet.add('Email Address');
    return '[REDACTED_EMAIL]';
  });

  // 5. UK Phone Numbers (e.g., +44 7700 900342, 07700 900342, 020 7946 0812)
  const phonePattern = /\b(?:(?:\+44\s?\(0\)\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3}|(?:\+44\s?\(0\)\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4}|(?:\+44\s?\(0\)\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}|(?:\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{6}|07\d{3}\s?\d{6}|07\d{4}\s?\d{5})\b/g;
  text = text.replace(phonePattern, () => {
    count++;
    categoriesSet.add('Phone Number');
    return '[REDACTED_PHONE]';
  });

  // 6. UK Full Postcodes (e.g., SW1A 1AA, BS8 1TH, EC1A 1BB, M1 1AE)
  const postcodePattern = /\b([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})\b/g;
  text = text.replace(postcodePattern, () => {
    count++;
    categoriesSet.add('Postcode');
    return '[REDACTED_POSTCODE]';
  });

  // 7. NHS Numbers & Health Identifiers (UK GDPR Article 9 Special Category Data)
  const nhsPattern = /\b(?:NHS\s*(?:no\.?|number)?\s*[:#]?\s*)?(\d{3}[- \t]\d{3}[- \t]\d{4})\b/gi;
  text = text.replace(nhsPattern, () => {
    count++;
    categoriesSet.add('NHS Health Identifier');
    return '[REDACTED_HEALTH_IDENTIFIER]';
  });

  // 8. Prompt Injection Jailbreak Neutralization
  const injectionPattern = /(?:ignore\s+all\s+previous\s+instructions|disregard\s+all\s+prior\s+instructions|system\s+prompt\s*:|forget\s+all\s+previous\s+prompts)/gi;
  text = text.replace(injectionPattern, () => {
    count++;
    categoriesSet.add('Prompt Injection Vector');
    return '[PROMPT_INJECTION_BLOCKED]';
  });

  return {
    sanitizedText: text,
    redactedCount: count,
    redactedCategories: Array.from(categoriesSet),
  };
}
