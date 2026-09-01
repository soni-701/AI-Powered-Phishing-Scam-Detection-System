function analyzeURL(url) {
  const text = url.toLowerCase().trim();

  let score = 5;
  const reasons = [];

  // HTTPS check
  if (text.startsWith("http://")) {
    score += 15;
    reasons.push("The URL is using HTTP instead of HTTPS.");
  }

  // Suspicious keywords
  const suspiciousWords = [
    "login",
    "verify",
    "verification",
    "account",
    "secure",
    "update",
    "confirm",
    "password",
    "bank",
    "wallet",
    "payment",
    "signin",
  ];

  const foundWords = suspiciousWords.filter((word) =>
    text.includes(word)
  );

  if (foundWords.length > 0) {
    score += Math.min(foundWords.length * 7, 35);

    reasons.push(
      `Suspicious keywords detected: ${foundWords.join(", ")}`
    );
  }

  // IP address detection
  const ipPattern =
    /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/;

  if (ipPattern.test(text)) {
    score += 30;

    reasons.push(
      "The URL uses an IP address instead of a normal domain."
    );
  }

  // Too many hyphens
  const hyphenCount = (text.match(/-/g) || []).length;

  if (hyphenCount >= 3) {
    score += 15;

    reasons.push(
      "The URL contains an unusually high number of hyphens."
    );
  }

  // @ symbol
  if (text.includes("@")) {
    score += 20;

    reasons.push(
      "The URL contains an @ symbol, which can hide the real destination."
    );
  }

  // Very long URL
  if (text.length > 100) {
    score += 10;

    reasons.push(
      "The URL is unusually long."
    );
  }

  score = Math.min(score, 98);

  let level = "SAFE";
  let category = "No Threat";

  if (score >= 60) {
    level = "HIGH RISK";
    category = "Phishing URL";
  } else if (score >= 30) {
    level = "SUSPICIOUS";
    category = "Suspicious URL";
  }

  if (reasons.length === 0) {
    reasons.push(
      "No common phishing indicators were detected."
    );
  }

  const confidence = Math.min(
    98,
    80 + Math.floor(score / 5)
  );

  return {
    url,
    score,
    level,
    category,
    confidence,
    reasons,
  };
}

module.exports = {
  analyzeURL,
};