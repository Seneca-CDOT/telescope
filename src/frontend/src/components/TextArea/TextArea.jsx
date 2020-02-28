import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Post from '../Post/Post.jsx';
import ReadingTime from '../ReadingTime';

import './TextArea.css';

const TextArea = ({ className, posts }) => {
  return (
    <div className={className}>
      {posts.map((post, index) => {
        const { author, html, published, title, site, url } = post;
        return (
          <Fragment key={index}>
            <ReadingTime text={post.text} />
            <Post
              author={author}
              url={url}
              html={html}
              title={title}
              className={`${className}-item`}
            />
          </Fragment>
        );
      })}
      <Post text={'this is a test'} />
    </div>
  );
};

TextArea.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
};

export default TextArea;
