import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Post from '../Post/Post.jsx';

import './TextArea.css';

const TextArea = ({ className, posts }) => {
  return (
    <div className={className}>
      {posts.map(({ feed, html, title, url }, index) => (
        <Fragment key={index}>
          <Post
            author={feed.author}
            url={url}
            html={html}
            title={title}
            className={`${className}-item`}
          />
        </Fragment>
      ))}
      <Post text={'this is a test'} />
    </div>
  );
};

TextArea.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
};

export default TextArea;
