import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentSentiment from './CommentSentiment';

const PostDetails = () => {
    const { postId } = useParams();
    const [postDetails, setPostDetails] = useState(null);
    const [comments, setComments] = useState([]);

    // Fetch post details from the Facebook API
    useEffect(() => {
        const fetchPostDetails = async () => {
            const response = await fetch(`https://graph.facebook.com/v21.0/${postId}?fields=message,likes.summary(true),comments{message,from,created_time},shares&access_token=EAAGeANaZBZAvEBO2XMTMpX7MyKWdI6AW7Teulrs1tZC3FVFLzo6LPhf4Jz3qlcwgvtUaCsP9O9nbB9TrsaLofsXnR3ZCDWGMcSQkF4BMqAHgcskzOuz6uire8cJOmWAHhS9q4J0AgbkLHmzCHlVyAi49AejjJrM5pXcnZBWuZCxcNw7ZCho1X8ZBtzLllckRRu9ZB8jacZAVbkaNO7zinJ4fX8rlQZD`);
            const data = await response.json();
            console.log(data);
            setPostDetails(data);
            setComments(data?.comments?.data || []); // Set the comments data
        };
        fetchPostDetails();
    }, [postId]);

    if (!postDetails) return <div>Loading...</div>;

    return (
        <div>
            <h1>Post Details</h1>
            <div className="post-card">
                {postDetails?.full_picture && (
                    <img src={postDetails.full_picture} alt="Post Attachment" className="post-image" />
                )}
                <div className="post-meta">
                    <p>Likes: {postDetails?.likes?.summary?.total_count}</p>
                    <p>Shares: {postDetails?.shares ? postDetails?.shares?.count : 0}</p>
                </div>
                <div className="post-content">
                    <p>{postDetails?.message || "No content available"}</p>
                </div>
            </div>

            <h2>Comments</h2>
            {comments?.length > 0 ? (
                comments?.map((comment) => (
                    <div key={comment.id} className="comment-card">
                        <p><strong>{comment?.from.name}</strong>: {comment?.message}</p>
                        <p><em>{new Date(comment?.created_time).toLocaleString()}</em></p>
                    </div>
                ))
            ) : (
                <p>No comments available.</p>
            )}
        </div>
    );
};

export default PostDetails;
