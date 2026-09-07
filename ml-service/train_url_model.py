import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from url_model import extract_url_features


# =========================================
# 1. LOAD DATASET
# =========================================

print("Loading URL dataset...")

data = pd.read_csv(
    "url_dataset.csv",
    low_memory=False
)

print("Dataset loaded successfully.")
print("Total rows:", len(data))

print("\nDataset columns:")
print(data.columns.tolist())


# =========================================
# 2. FIND URL COLUMN
# =========================================

possible_url_columns = [
    "URL",
    "url",
    "Url"
]

url_column = None

for column in possible_url_columns:
    if column in data.columns:
        url_column = column
        break

if url_column is None:
    raise ValueError(
        "URL column was not found in the dataset."
    )

print("\nUsing URL column:", url_column)


# =========================================
# 3. FIND LABEL COLUMN
# =========================================

possible_label_columns = [
    "label",
    "Label",
    "status",
    "Status",
    "phishing",
    "Phishing"
]

label_column = None

for column in possible_label_columns:
    if column in data.columns:
        label_column = column
        break

if label_column is None:
    raise ValueError(
        "Label column was not found in the dataset."
    )

print("Using label column:", label_column)


# =========================================
# 4. SHOW LABEL DISTRIBUTION
# =========================================

print("\nOriginal label distribution:")
print(data[label_column].value_counts())


# =========================================
# 5. CREATE OUR 18 URL FEATURES
# =========================================

print("\nExtracting URL features...")

feature_rows = []
valid_labels = []

for index, row in data.iterrows():

    url = str(row[url_column])

    label = row[label_column]

    if url.lower() == "nan":
        continue

    try:
        features = extract_url_features(url)

        feature_rows.append(features)
        valid_labels.append(label)

    except Exception:
        continue


X = pd.DataFrame(feature_rows)

y = pd.Series(valid_labels)


print("Feature extraction completed.")
print("Valid URLs:", len(X))
print("Number of features:", X.shape[1])


# =========================================
# 6. CONVERT LABELS
#
# PhiUSIIL:
# 1 = legitimate
# 0 = phishing
#
# Our model:
# 0 = legitimate
# 1 = phishing
# =========================================

y = y.map({
    1: 0,
    0: 1,
    "1": 0,
    "0": 1,
    "legitimate": 0,
    "phishing": 1,
    "legit": 0,
    "phish": 1
})


# =========================================
# 7. REMOVE UNKNOWN LABELS
# =========================================

valid_mask = y.notna()

X = X[valid_mask]
y = y[valid_mask].astype(int)


print("\nFinal label distribution:")

print(
    y.map({
        0: "legitimate",
        1: "phishing"
    }).value_counts()
)


# =========================================
# 8. TRAIN / TEST SPLIT
# =========================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("Training URLs:", len(X_train))
print("Testing URLs:", len(X_test))


# =========================================
# 9. TRAIN RANDOM FOREST
# =========================================

print("\nTraining URL phishing model...")

model = RandomForestClassifier(
    n_estimators=150,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)


# =========================================
# 10. TEST MODEL
# =========================================

y_pred = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    y_pred
)


print("\n========================================")
print("URL MODEL TRAINING COMPLETED")
print("========================================")

print(
    f"\nAccuracy: {accuracy * 100:.2f}%"
)


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "legitimate",
            "phishing"
        ]
    )
)


# =========================================
# 11. SAVE MODEL
# =========================================

joblib.dump(
    model,
    "url_phishing_model.pkl"
)


print("\nModel saved successfully:")
print("url_phishing_model.pkl")