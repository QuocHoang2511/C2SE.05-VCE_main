import os
import sys
import joblib
from transformers import AutoModel, AutoTokenizer
import torch
import re
import numpy as np
import underthesea


# Load PhoBERT model and tokenizer
def load_phobert():
    import warnings
    warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
    model = AutoModel.from_pretrained("vinai/phobert-base")
    tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
    return model, tokenizer


# Standardize the input text
def standardize_data(row):
    row = re.sub(r"[^\w\s]", " ", row)  # Remove punctuation
    row = re.sub(r"\s+", " ", row)  # Remove extra whitespace
    row = row.strip().lower()  # Remove trailing spaces and convert to lowercase
    return row


# Tokenize and convert to features using PhoBERT
def tokenize_and_convert_to_features(text, phobert_model, phobert_tokenizer):
    text = standardize_data(text)  # Standardize text before tokenization
    tokenized_text = underthesea.word_tokenize(text, format="text")  # Tokenize using underthesea
    encoded_text = phobert_tokenizer.encode_plus(
        tokenized_text,
        add_special_tokens=True,
        max_length=100,
        padding="max_length",
        truncation=True,
        return_tensors="pt",
    )
    input_ids = encoded_text["input_ids"]
    attention_mask = encoded_text["attention_mask"]

    with torch.no_grad():
        last_hidden_states = phobert_model(
            input_ids=input_ids, attention_mask=attention_mask
        )
    return last_hidden_states.last_hidden_state[:, 0, :].numpy()


# Main function to load the model and predict sentiment
if __name__ == "__main__":
    # Load the sentiment model
    loaded_model = joblib.load("app/python/sentiment_model.joblib")
    
    # Load PhoBERT model and tokenizer
    phobert_model, phobert_tokenizer = load_phobert()

    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        # Tokenize and convert the input text to features
        input_features = tokenize_and_convert_to_features(input_text, phobert_model, phobert_tokenizer)
        # Reshape the features for prediction
        input_features = input_features.reshape(1, -1)
        # Predict sentiment
        predicted_sentiment = loaded_model.predict(input_features)
        # Print the predicted sentiment
        print(predicted_sentiment[0])
    else:

        print("No input text provided.")

