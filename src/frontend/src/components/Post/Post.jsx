import React from 'react';
import PropTypes from 'prop-types';

const Post = ({ html, author, url, title }) => {
  return (
    <div className="post">
      <div className="">
        <h2>
          <a href={url}>{title}</a>
        </h2>
        <h3>{author}</h3>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
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
