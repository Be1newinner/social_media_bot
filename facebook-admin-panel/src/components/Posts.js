import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Posts.css'; // Import the CSS file for styling

const Posts = () => {
    const [posts, setPosts] = useState([]);

    // Fetch Facebook posts from the API
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`https://graph.facebook.com/v21.0/101135172991623/posts?fields=message,full_picture,likes.summary(true),comments.summary(true)&access_token=EAAGeANaZBZAvEBO2XMTMpX7MyKWdI6AW7Teulrs1tZC3FVFLzo6LPhf4Jz3qlcwgvtUaCsP9O9nbB9TrsaLofsXnR3ZCDWGMcSQkF4BMqAHgcskzOuz6uire8cJOmWAHhS9q4J0AgbkLHmzCHlVyAi49AejjJrM5pXcnZBWuZCxcNw7ZCho1X8ZBtzLllckRRu9ZB8jacZAVbkaNO7zinJ4fX8rlQZD`);
            const data = await response.json();
            console.log("Updated ", data.data);
            setPosts(data.data); // Assuming the response is in the data array
        };
        fetchPosts();
    }, []);

    return (
        <div className="posts-container">
            <h1>Facebook Posts</h1>
            <div className="posts-grid">
                {posts?.map((post) => (
                    <div key={post.id} className="post-card">
                        <Link to={`/posts/${post.id}`} className="post-link">
                            {post.full_picture && (
                                <img src={post.full_picture} alt="Post Attachment" className="post-image" />
                            )}
                            <span className="post-title">{post.message || "No Content"}</span>
                        </Link>
                        <div className="post-metrics">
                            <span className="post-likes">{post.likes?.summary.total_count} Likes</span>
                            <span className="post-comments">{post.comments?.summary.total_count} Comments</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;
