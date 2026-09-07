import re
from urllib.parse import urlparse


def extract_url_features(url):
    """
    Extract numerical features from a URL
    for phishing detection.
    """

    url = url.strip()

    parsed = urlparse(url)

    hostname = parsed.netloc.lower()
    path = parsed.path.lower()

    # Remove username/password part if present
    hostname_without_port = hostname.split("@")[-1]
    hostname_without_port = hostname_without_port.split(":")[0]

    # -----------------------------------
    # BASIC FEATURES
    # -----------------------------------

    url_length = len(url)

    hostname_length = len(hostname_without_port)

    path_length = len(path)

    # -----------------------------------
    # SPECIAL CHARACTERS
    # -----------------------------------

    dot_count = url.count(".")

    hyphen_count = url.count("-")

    slash_count = url.count("/")

    question_count = url.count("?")

    equal_count = url.count("=")

    at_count = url.count("@")

    percent_count = url.count("%")

    # -----------------------------------
    # SECURITY FEATURES
    # -----------------------------------

    https = 1 if url.lower().startswith("https://") else 0

    http = 1 if url.lower().startswith("http://") else 0

    # -----------------------------------
    # IP ADDRESS DETECTION
    # -----------------------------------

    ip_pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"

    has_ip = 1 if re.match(
        ip_pattern,
        hostname_without_port
    ) else 0

    # -----------------------------------
    # SUSPICIOUS KEYWORDS
    # -----------------------------------

    suspicious_words = [
        "login",
        "signin",
        "verify",
        "verification",
        "account",
        "secure",
        "security",
        "update",
        "confirm",
        "password",
        "bank",
        "wallet",
        "payment",
        "invoice",
        "claim",
        "reward",
        "bonus",
        "free",
        "urgent",
        "suspended",
        "blocked",
    ]

    suspicious_word_count = sum(
        1
        for word in suspicious_words
        if word in url.lower()
    )

    # -----------------------------------
    # SUBDOMAIN COUNT
    # -----------------------------------

    subdomain_count = max(
        hostname_without_port.count(".") - 1,
        0
    )

    # -----------------------------------
    # DIGIT COUNT
    # -----------------------------------

    digit_count = sum(
        character.isdigit()
        for character in url
    )

    # -----------------------------------
    # LETTER COUNT
    # -----------------------------------

    letter_count = sum(
        character.isalpha()
        for character in url
    )

    # -----------------------------------
    # SHORTENED URL DETECTION
    # -----------------------------------

    shortening_services = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "ow.ly",
        "is.gd",
        "buff.ly",
    ]

    shortened_url = 1 if any(
        service in hostname_without_port
        for service in shortening_services
    ) else 0

    # -----------------------------------
    # RETURN FEATURES
    # -----------------------------------

    return [
        url_length,
        hostname_length,
        path_length,
        dot_count,
        hyphen_count,
        slash_count,
        question_count,
        equal_count,
        at_count,
        percent_count,
        https,
        http,
        has_ip,
        suspicious_word_count,
        subdomain_count,
        digit_count,
        letter_count,
        shortened_url,
    ]


if __name__ == "__main__":

    test_url = "http://secure-login-example.com/verify-account"

    features = extract_url_features(test_url)

    print("URL:")
    print(test_url)

    print("\nExtracted Features:")
    print(features)