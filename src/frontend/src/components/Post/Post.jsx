import React from 'react';
import PropTypes from 'prop-types';
import './telescope-post-content.css';

const Post = ({ html, author, url, title }) => {
  return (
    <div className="post">
      <div className="">
        <h2 className="title">
          <a href={url}>{title}</a>
        </h2>
        <h3 className="author">{author}</h3>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} className="telescope-post-content" />
    </div>
  );
};

Post.propTypes = {
  url: PropTypes.string,
  author: PropTypes.string,
  html: PropTypes.any,
  title: PropTypes.string,
};

export default Post;
