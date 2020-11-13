import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';
import { InViewStateContext } from '../../../contexts/InView/InViewContext';

const useStyles = makeStyles((theme) => ({
  text: {
    color: theme.palette.primary.main,
    fontSize: '1.6em',
  },
  size: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
}));

const PostReference = ({ postUrl }) => {
  const classes = useStyles();
  const inViewPost = useContext(InViewStateContext);
  const { data: post } = useSWR(postUrl, (url) => fetch(url).then((r) => r.json()));

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <ListItem
      button
      component="a"
      href={`#inView${post.id}`}
      autoFocus={post.id === inViewPost}
      selected={post.id === inViewPost}
    >
      <ListItemText
        disableTypography
        primary={<Typography className={classes.text}>{`${post.feed.author}`}</Typography>}
        secondary={<Typography className={classes.text}>{`- ${post.title}`}</Typography>}
      />
    </ListItem>
  );
};

PostReference.propTypes = {
  postUrl: PropTypes.string,
};

export default PostReference;
