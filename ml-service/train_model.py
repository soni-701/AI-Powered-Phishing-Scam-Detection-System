import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

import joblib


# -----------------------------------
# 1. LOAD DATASET
# -----------------------------------

print("Loading dataset...")

data = pd.read_csv(
    "SMSSpamCollection",
    sep="\t",
    header=None,
    names=["label", "message"],
    encoding="latin-1"
)

print("Dataset loaded successfully.")
print("Total messages:", len(data))


# -----------------------------------
# 2. CHECK DATA
# -----------------------------------

print("\nClass distribution:")
print(data["label"].value_counts())


# -----------------------------------
# 3. CONVERT LABELS
# ham  = 0
# spam = 1
# -----------------------------------

data["label"] = data["label"].map({
    "ham": 0,
    "spam": 1
})


# -----------------------------------
# 4. INPUT AND OUTPUT
# -----------------------------------

X = data["message"]
y = data["label"]


# -----------------------------------
# 5. TRAIN / TEST SPLIT
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining messages:", len(X_train))
print("Testing messages:", len(X_test))


# -----------------------------------
# 6. TF-IDF
# -----------------------------------

print("\nCreating TF-IDF features...")

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=10000
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


# -----------------------------------
# 7. TRAIN MODEL
# -----------------------------------

print("Training Logistic Regression model...")

model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

model.fit(X_train_tfidf, y_train)


# -----------------------------------
# 8. TEST MODEL
# -----------------------------------

y_pred = model.predict(X_test_tfidf)

accuracy = accuracy_score(y_test, y_pred)

print("\n================================")
print("MODEL TRAINING COMPLETED")
print("================================")

print(f"\nAccuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=["ham", "spam"]
    )
)


# -----------------------------------
# 9. SAVE MODEL
# -----------------------------------

joblib.dump(model, "spam_model.pkl")

joblib.dump(
    vectorizer,
    "tfidf_vectorizer.pkl"
)


print("\nModel saved successfully:")
print("spam_model.pkl")
print("tfidf_vectorizer.pkl")