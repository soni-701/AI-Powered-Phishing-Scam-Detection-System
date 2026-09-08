function analyzeMessage(message) {
  const originalMessage = message;
  const text = message.toLowerCase().trim();

  let score = 5;

  const reasons = [];
  const detectedKeywords = [];
  const detectedIndicators = [];

  // =========================================================
  // 1. SCAM / SPAM KEYWORDS
  // =========================================================

  const scamKeywords = [
    "urgent",
    "verify",
    "verification",
    "account",
    "blocked",
    "suspended",
    "password",
    "otp",
    "bank",
    "payment",
    "refund",
    "prize",
    "winner",
    "won",
    "lottery",
    "free",
    "click",
    "claim",
    "limited time",
    "immediately",
    "confirm",
    "kyc",
    "cashback",
    "reward",
    "bonus",
    "offer",
    "credit",
    "debit",
    "transaction",
    "upi",
    "wallet",
    "investment",
  ];

  scamKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      detectedKeywords.push(keyword);
    }
  });

  if (detectedKeywords.length > 0) {
    score += Math.min(
      detectedKeywords.length * 5,
      30
    );

    reasons.push(
      `Suspicious keywords detected: ${detectedKeywords.join(
        ", "
      )}`
    );

    detectedIndicators.push({
      type: "Suspicious Keywords",
      label: "Suspicious keywords detected",
      details: detectedKeywords.join(", "),
    });
  }

  // =========================================================
  // 2. URGENCY / PRESSURE DETECTION
  // =========================================================

  const urgencyWords = [
    "urgent",
    "immediately",
    "now",
    "asap",
    "within 24 hours",
    "act fast",
    "act now",
    "don't wait",
    "do not wait",
    "last chance",
    "expires today",
    "hurry",
  ];

  const detectedUrgency = urgencyWords.filter((word) =>
    text.includes(word)
  );

  if (detectedUrgency.length > 0) {
    score += Math.min(
      detectedUrgency.length * 8,
      16
    );

    reasons.push(
      "Message uses urgent or pressure-based language."
    );

    detectedIndicators.push({
      type: "Urgency / Pressure",
      label: "Urgent or pressure-based language",
      details: detectedUrgency.join(", "),
    });
  }

  // =========================================================
  // 3. MONEY / FINANCIAL CONTENT
  // =========================================================

  const moneyWords = [
    "₹",
    "rs",
    "rupees",
    "money",
    "cash",
    "prize",
    "reward",
    "payment",
    "refund",
    "cashback",
    "bonus",
    "upi",
    "bank",
    "wallet",
    "transaction",
    "investment",
  ];

  const detectedMoneyWords = moneyWords.filter((word) =>
    text.includes(word)
  );

  if (detectedMoneyWords.length > 0) {
    score += Math.min(
      detectedMoneyWords.length * 5,
      15
    );

    reasons.push(
      "Message contains financial, payment, or reward-related content."
    );

    detectedIndicators.push({
      type: "Financial Content",
      label: "Financial or monetary content detected",
      details: detectedMoneyWords.join(", "),
    });
  }

  // =========================================================
  // 4. SUSPICIOUS LINK DETECTION
  // =========================================================

  const urlPattern =
    /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/i;

  if (urlPattern.test(originalMessage)) {
    score += 20;

    reasons.push(
      "Message contains a website or shortened link."
    );

    detectedIndicators.push({
      type: "Suspicious Link",
      label: "Website or shortened link detected",
      details:
        "A URL or shortened URL is present in the message.",
    });
  }

  // =========================================================
  // 5. OTP / PASSWORD / SENSITIVE INFORMATION
  // =========================================================

  const sensitiveWords = [
    "otp",
    "one time password",
    "password",
    "pin",
    "cvv",
    "card number",
    "bank details",
    "account number",
    "verification code",
  ];

  const detectedSensitiveWords =
    sensitiveWords.filter((word) =>
      text.includes(word)
    );

  if (detectedSensitiveWords.length > 0) {
    score += 20;

    reasons.push(
      "Message may be requesting sensitive authentication or financial information."
    );

    detectedIndicators.push({
      type: "Sensitive Information",
      label:
        "Sensitive authentication or financial information",
      details: detectedSensitiveWords.join(", "),
    });
  }

  // =========================================================
  // 6. PERSONAL INFORMATION REQUEST
  // =========================================================

  const personalInfoWords = [
    "send your details",
    "share your details",
    "share your information",
    "provide your information",
    "send otp",
    "share otp",
    "send password",
    "share password",
    "send pin",
    "share pin",
    "enter your details",
  ];

  const personalInfoDetected =
    personalInfoWords.some((phrase) =>
      text.includes(phrase)
    );

  if (personalInfoDetected) {
    score += 15;

    reasons.push(
      "Message asks the recipient to share personal or sensitive information."
    );

    detectedIndicators.push({
      type: "Personal Information Request",
      label:
        "Personal or sensitive information requested",
      details:
        "The message asks the recipient to share information.",
    });
  }

  // =========================================================
  // 7. PHONE NUMBER DETECTION
  // =========================================================

  const phonePattern =
    /(?:\+91[\s-]?)?[6-9]\d{9}\b/;

  if (phonePattern.test(originalMessage)) {
    score += 5;

    reasons.push(
      "Message contains a phone number or contact number."
    );

    detectedIndicators.push({
      type: "Phone Number",
      label: "Phone number detected",
      details:
        "A contact number is present in the message.",
    });
  }

  // =========================================================
  // 8. EMAIL DETECTION
  // =========================================================

  const emailPattern =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  if (emailPattern.test(originalMessage)) {
    score += 3;

    reasons.push(
      "Message contains an email address."
    );

    detectedIndicators.push({
      type: "Email Address",
      label: "Email address detected",
      details:
        "An email address is present in the message.",
    });
  }

  // =========================================================
  // 9. CALL / CONTACT PRESSURE
  // =========================================================

  const contactWords = [
    "call us",
    "call me",
    "contact us",
    "contact me",
    "whatsapp us",
    "message us",
    "reply now",
    "call immediately",
  ];

  const contactPressure = contactWords.some((word) =>
    text.includes(word)
  );

  if (contactPressure) {
    score += 8;

    reasons.push(
      "Message pressures the recipient to contact or respond immediately."
    );

    detectedIndicators.push({
      type: "Contact Pressure",
      label:
        "Immediate contact or response requested",
      details:
        "The message pressures the recipient to call, reply, or contact someone.",
    });
  }

  // =========================================================
  // 10. EXCESSIVE EXCLAMATION MARKS
  // =========================================================

  const exclamationCount =
    (originalMessage.match(/!/g) || []).length;

  if (exclamationCount >= 3) {
    score += 5;

    reasons.push(
      "Message uses excessive exclamation marks."
    );

    detectedIndicators.push({
      type: "Excessive Punctuation",
      label: "Excessive exclamation marks",
      details: `${exclamationCount} exclamation marks detected.`,
    });
  }

  // =========================================================
  // 11. ALL CAPS DETECTION
  // =========================================================

  const uppercaseWords =
    originalMessage.match(/\b[A-Z]{4,}\b/g) || [];

  if (uppercaseWords.length >= 2) {
    score += 5;

    reasons.push(
      "Message uses excessive uppercase wording."
    );

    detectedIndicators.push({
      type: "Excessive Uppercase",
      label: "Excessive uppercase wording",
      details: `${uppercaseWords.length} uppercase words detected.`,
    });
  }

  // =========================================================
  // 12. FINAL SCORE
  // =========================================================

  score = Math.min(score, 98);

  // =========================================================
  // 13. CLASSIFICATION
  // =========================================================

  let level = "SAFE";
  let category = "No Threat";

  if (score >= 60) {
    level = "HIGH RISK";
    category = "Scam Message";
  } else if (score >= 30) {
    level = "SUSPICIOUS";
    category = "Suspicious Message";
  }

  // =========================================================
  // 14. DEFAULT REASON
  // =========================================================

  if (reasons.length === 0) {
    reasons.push(
      "No common spam or scam indicators were detected."
    );
  }

  // =========================================================
  // 15. CONFIDENCE
  // =========================================================

  const confidence = Math.min(
    98,
    80 + Math.floor(score / 5)
  );

  // =========================================================
  // FINAL RESULT
  // =========================================================

  return {
    message: originalMessage,
    score,
    level,
    category,
    confidence,
    reasons,
    detectedKeywords,
    detectedIndicators,
  };
}

module.exports = {
  analyzeMessage,
};