import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Posts from './components/Posts';
import PostDetails from './components/PostDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
