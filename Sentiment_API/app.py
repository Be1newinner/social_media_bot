import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize Flask app
app = Flask(__name__)

# Load the model and tokenizer
MODEL_NAME = "ai4bharat/indic-bert"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3)  # Adjust num_labels as needed
analyzer = SentimentIntensityAnalyzer()


# Force the model to run on CPU
device = torch.device('cpu')
model.to(device)

# Define a function for sentiment analysis
def analyze_sentiment(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True).to(device)  # Ensure inputs are on CPU
    outputs = model(**inputs)
    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=1)

    # Get the predicted label
    predicted_label = torch.argmax(probabilities, dim=1).item()
    score = probabilities[0][predicted_label].item()

    # Map the predicted label to sentiment
    label_map = {0: 'negative', 1: 'neutral', 2: 'positive'}
    sentiment = label_map.get(predicted_label, "unknown")

    return {"sentiment": sentiment, "score": score}

# Define a route for sentiment analysis
@app.route('/analyze', methods=['POST'])
def analyze():
    # Get comment from the request body
    data = request.json
    comment = data.get('comment', '')

    if not comment:
        return jsonify({"error": "No comment provided"}), 400

    # Analyze the sentiment of the comment
    result = analyze_sentiment(comment)

    # Return the result as a JSON response
    sentiment_score = analyzer.polarity_scores(comment)
    print(sentiment_score)

    return jsonify(sentiment_score)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
