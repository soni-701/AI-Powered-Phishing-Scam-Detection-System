function analyzeMessage(message) {
  const text = message.toLowerCase().trim();

  let score = 5;
  const reasons = [];
  const detectedKeywords = [];

  // Suspicious scam keywords
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
  ];

  scamKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      detectedKeywords.push(keyword);
    }
  });

  if (detectedKeywords.length > 0) {
    score += Math.min(
      detectedKeywords.length * 6,
      36
    );

    reasons.push(
      `Suspicious keywords detected: ${detectedKeywords.join(
        ", "
      )}`
    );
  }

  // Urgency detection
  const urgencyWords = [
    "urgent",
    "immediately",
    "now",
    "asap",
    "within 24 hours",
    "act fast",
  ];

  const hasUrgency = urgencyWords.some((word) =>
    text.includes(word)
  );

  if (hasUrgency) {
    score += 15;

    reasons.push(
      "Message uses urgent or pressure-based language."
    );
  }

  // Money-related language
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
  ];

  const hasMoneyContent = moneyWords.some((word) =>
    text.includes(word)
  );

  if (hasMoneyContent) {
    score += 15;

    reasons.push(
      "Message contains financial or reward-related content."
    );
  }

  // Link detection
  const urlPattern =
    /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

  if (urlPattern.test(message)) {
    score += 20;

    reasons.push(
      "Message contains a clickable website link."
    );
  }

  // OTP/password request
  if (
    text.includes("otp") ||
    text.includes("one time password") ||
    text.includes("password")
  ) {
    score += 15;

    reasons.push(
      "Message may be requesting sensitive authentication information."
    );
  }

  // Excessive exclamation marks
  const exclamationCount =
    (message.match(/!/g) || []).length;

  if (exclamationCount >= 3) {
    score += 5;

    reasons.push(
      "Message uses excessive exclamation marks."
    );
  }

  // Uppercase words
  const uppercaseWords =
    message.match(/\b[A-Z]{4,}\b/g) || [];

  if (uppercaseWords.length >= 2) {
    score += 5;

    reasons.push(
      "Message uses excessive uppercase wording."
    );
  }

  score = Math.min(score, 98);

  let level = "SAFE";
  let category = "No Threat";

  if (score >= 60) {
    level = "HIGH RISK";
    category = "Scam Message";
  } else if (score >= 30) {
    level = "SUSPICIOUS";
    category = "Suspicious Message";
  }

  if (reasons.length === 0) {
    reasons.push(
      "No common scam indicators were detected."
    );
  }

  const confidence = Math.min(
    98,
    80 + Math.floor(score / 5)
  );

  return {
    message,
    score,
    level,
    category,
    confidence,
    reasons,
    detectedKeywords,
  };
}

module.exports = {
  analyzeMessage,
};