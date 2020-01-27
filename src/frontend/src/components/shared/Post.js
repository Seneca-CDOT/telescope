import React from 'react';
import PropTypes from 'prop-types';

const Post = ({ text, author, url, title }) => {
  return (
    <div className="post">
      <div className="">
        <h2>
          <a href={url}>{title}</a>
        </h2>
        <h3>{author}</h3>
      </div>
      {text}
    </div>
  );
};

Post.propTypes = {
  url: PropTypes.string,
  author: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string,
};

export default Post;
