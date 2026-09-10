function analyzeURL(url) {
  // =========================================
  // BASIC INPUT VALIDATION
  // =========================================

  if (typeof url !== "string" || !url.trim()) {
    return {
      url: "",
      score: 0,
      level: "SAFE",
      category: "No Threat",
      confidence: 0,
      isTrustedDomain: false,
      reasons: ["No URL was provided for analysis."],
    };
  }

  const originalUrl = url.trim();
  const text = originalUrl.toLowerCase();

  let score = 5;
  const reasons = [];

  // =========================================
  // URL FORMAT CHECK
  // =========================================

  let parsedURL;

  try {
    parsedURL = new URL(originalUrl);
  } catch {
    return {
      url: originalUrl,
      score: 0,
      level: "SAFE",
      category: "Invalid URL",
      confidence: 0,
      isTrustedDomain: false,
      reasons: ["The provided input is not a valid URL."],
    };
  }

  if (!["http:", "https:"].includes(parsedURL.protocol)) {
    return {
      url: originalUrl,
      score: 0,
      level: "SAFE",
      category: "Invalid URL",
      confidence: 0,
      isTrustedDomain: false,
      reasons: ["Only HTTP and HTTPS URLs are supported."],
    };
  }

  const hostname = parsedURL.hostname.toLowerCase();

  // =========================================
  // TRUSTED DOMAINS
  // =========================================

  const trustedDomains = [
    "youtube.com",
    "google.com",
    "microsoft.com",
    "github.com",
    "wikipedia.org",
    "amazon.com",
    "apple.com",
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "twitter.com",
    "x.com",
    "reddit.com",
    "netflix.com",
    "paypal.com",
  ];

  const isTrustedDomain =
    trustedDomains.includes(hostname) ||
    trustedDomains.some(
      (domain) => hostname.endsWith("." + domain)
    );

  // =========================================
  // HTTPS CHECK
  // =========================================

  if (parsedURL.protocol === "http:") {
    score += 15;

    reasons.push(
      "The URL is using HTTP instead of HTTPS."
    );
  }

  // =========================================
  // SUSPICIOUS KEYWORDS
  // =========================================

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

  const foundWords = suspiciousWords.filter(
    (word) => text.includes(word)
  );

  if (foundWords.length > 0) {
    score += Math.min(foundWords.length * 7, 35);

    reasons.push(
      `Suspicious keywords detected: ${foundWords.join(", ")}`
    );
  }

  // =========================================
  // IP ADDRESS DETECTION
  // =========================================

  const isIPv4 =
    /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);

  if (isIPv4) {
    score += 30;

    reasons.push(
      "The URL uses an IP address instead of a normal domain."
    );
  }

  // =========================================
  // TOO MANY HYPHENS
  // =========================================

  const hyphenCount = (text.match(/-/g) || []).length;

  if (hyphenCount >= 3) {
    score += 15;

    reasons.push(
      "The URL contains an unusually high number of hyphens."
    );
  }

  // =========================================
  // @ SYMBOL
  // =========================================

  if (text.includes("@")) {
    score += 20;

    reasons.push(
      "The URL contains an @ symbol, which can hide the real destination."
    );
  }

  // =========================================
  // VERY LONG URL
  // =========================================

  if (text.length > 100) {
    score += 10;

    reasons.push(
      "The URL is unusually long."
    );
  }

  // =========================================
  // MANY SUBDOMAINS
  // =========================================

  const hostnameParts = hostname.split(".");

  if (hostnameParts.length >= 4) {
    score += 10;

    reasons.push(
      "The URL contains multiple subdomains."
    );
  }

  // =========================================
  // URL ENCODING
  // =========================================

  const percentCount =
    (text.match(/%/g) || []).length;

  if (percentCount >= 3) {
    score += 10;

    reasons.push(
      "The URL contains multiple encoded characters."
    );
  }

  // =========================================
  // TRUSTED DOMAIN MESSAGE
  // =========================================

  if (
    isTrustedDomain &&
    !isIPv4 &&
    !text.includes("@")
  ) {
    reasons.unshift(
      `The domain "${hostname}" is recognized as a trusted domain.`
    );
  }

  // =========================================
  // FINAL SCORE
  // =========================================

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

  // =========================================
  // DEFAULT FINDING
  // =========================================

  if (reasons.length === 0) {
    reasons.push(
      "No common phishing indicators were detected."
    );
  }

  // =========================================
  // RULE-BASED CONFIDENCE
  // =========================================

  const confidence = Math.min(
    98,
    80 + Math.floor(score / 5)
  );

  return {
    url: originalUrl,
    score,
    level,
    category,
    confidence,
    isTrustedDomain,
    reasons,
  };
}

module.exports = {
  analyzeURL,
};