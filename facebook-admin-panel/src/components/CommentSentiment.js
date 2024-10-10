import React, { useState, useEffect } from 'react';

const CommentSentiment = ({ comments }) => {
    const [analyzedComments, setAnalyzedComments] = useState([]);

    useEffect(() => {
        const analyzeComments = async () => {
            const results = [];
            for (let comment of comments) {
                // Send each comment to the Flask API for sentiment analysis
                const response = await fetch('http://localhost:5000/sentiment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comment: comment.message })
                });
                const sentiment = await response.json();
                results.push({ comment: comment.message, sentiment: sentiment.sentiment });
            }
            setAnalyzedComments(results);
        };

        analyzeComments();
    }, [comments]);

    if (!comments.length) return <div>No comments available</div>;

    return (
        <div>
            <h2>Sentiment Analysis</h2>
            <ul>
                {analyzedComments.map((item, index) => (
                    <li key={index}>
                        <p>Comment: {item.comment}</p>
                        <p>Sentiment: {item.sentiment[0].label} (Score: {item.sentiment[0].score.toFixed(2)})</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSentiment;
