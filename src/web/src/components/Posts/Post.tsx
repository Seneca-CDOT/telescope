import { useRef, useState } from 'react';
import useSWR from 'swr';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Grid, Typography, ListSubheader, createStyles } from '@material-ui/core';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import { Post } from '../../interfaces';
import AdminButtons from '../AdminButtons';
import Spinner from '../Spinner';

type Props = {
  postUrl: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      fontSize: '1.5rem',
      marginBottom: '4em',
      backgroundColor: theme.palette.background.default,
    },
    titleContainer: {
      // backgroundColor: 'yellow',
      color: theme.palette.text.secondary,
      padding: '2em 0 1.5em',
      lineHeight: '1.3',
      top: '-.1em',
      fontSize: '0.9em',
      [theme.breakpoints.down(1200)]: {
        paddingTop: '1.6em',
        paddingBottom: '0',
        // padding: '1.6em 0 0 2em',
      },
    },
    expandHeader: {
      whiteSpace: 'normal',
      cursor: 'pointer',
    },
    collapseHeader: {
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },
    title: {
      fontSize: '3em',
      fontWeight: 'bold',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      letterSpacing: '-3px',
      [theme.breakpoints.down(1200)]: {
        width: 'calc(100% - 1.5em)',
        textAlign: 'left',
        marginLeft: '1.5em',
      },
    },
    author: {
      fontSize: '2em',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    published: {
      fontSize: '1.5em',
      fontWeight: 'lighter',
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    content: {
      overflow: 'auto',
      padding: '1em',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      width: '95%',
      [theme.breakpoints.down(1024)]: {
        padding: '0',
      },
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    time: {
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    spinner: {
      padding: '20px',
    },
    error: {
      lineHeight: '1',
      fontSize: '1em',
    },
    postInfo: {
      color: 'white',
      width: '200px',
      float: 'right',
      marginRight: '-22em',
      top: '8em',
      bottom: '100%',
      [theme.breakpoints.down(1200)]: {
        width: '100%',
        height: '2%',
        float: 'none',
        top: '7.4em',
      },
    },
    authorInfoContainer: {
      // backgroundColor: 'gray',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '2.5px solid #707070',
      width: '100%',
      paddingLeft: '2em',
      height: '100%',
      [theme.breakpoints.down(1200)]: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto',
        border: 'none',
        // paddingLeft: '10px',
      },
    },
    authorNameContainer: {
      width: 'calc(100% - 2em)',
      [theme.breakpoints.down(1200)]: {
        width: 'auto',
        padding: '.1em 2em 0 0',
        // backgroundColor: 'blue',
        marginLeft: '-3.8em',
        gridRowStart: '2',
        gridColumnEnd: '1',
        lineHeight: '1',
      },
      [theme.breakpoints.down(1024)]: {
        margin: '0 0',
      },
    },
    publishedDateContainer: {
      [theme.breakpoints.down(1200)]: {
        backgroundColor: 'green',
        width: '90%',
        gridRowStart: '2',
        lineHeight: '3.5em',
      },
    },
    authorAvatarContainer: {
      shapeOutside: 'circle(50%) border-box',
      shapeMargin: '1rem',
      borderRadius: '50%',
      float: 'left',
      paddingBottom: '1em',
      [theme.breakpoints.down(1200)]: {
        float: 'none',
        paddingBottom: '0',
      },
    },
    circle: {
      display: 'block',
      borderRadius: '50%',
      backgroundColor: '#121D59',
      width: '8em',
      height: '8em',
      [theme.breakpoints.down(1200)]: {
        width: '7em',
        height: '7em',
        margin: '-6.5em 0 0.5em -5em',
        gridRowStart: '1',
      },
      [theme.breakpoints.down(1024)]: {
        margin: '0 0',
      },
    },
  })
);

const formatPublishedDate = (dateString: string) => {
  const date: Date = new Date(dateString);
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const PostComponent = ({ postUrl }: Props) => {
  const classes = useStyles();
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef<HTMLElement>(null);
  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR<Post>(postUrl);
  const [expandHeader, setExpandHeader] = useState(false);

  if (error) {
    console.error(`Error loading post at ${postUrl}`, error);
    return (
      <Box className={classes.root}>
        <ListSubheader className={classes.titleContainer}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            <Grid container className={classes.error}>
              <Grid item>
                <ErrorRoundedIcon className={classes.error} />
              </Grid>{' '}
              - Post Failed to Load
            </Grid>
          </Typography>
        </ListSubheader>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box className={classes.root}>
        <ListSubheader className={classes.titleContainer}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            Loading Blog...
          </Typography>
        </ListSubheader>

        <Grid container justify="center">
          <Grid item className={classes.spinner}>
            <Spinner />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <ListSubheader className={classes.titleContainer}>
        <AdminButtons />
        <Typography variant="h1" title={post.title} id={post.id} className={classes.title}>
          <span
            role="button"
            tabIndex={0}
            onClick={() => setExpandHeader(!expandHeader)}
            onKeyDown={() => setExpandHeader(!expandHeader)}
            className={expandHeader ? classes.expandHeader : classes.collapseHeader}
          >
            {post.title}
          </span>
        </Typography>
      </ListSubheader>
      <ListSubheader className={classes.postInfo}>
        <div className={classes.authorInfoContainer}>
          <div className={classes.authorAvatarContainer}>
            <div className={classes.circle} />
          </div>
          <div className={classes.authorNameContainer}>
            <Typography variant="subtitle2" className={classes.author}>
              <a className={classes.link} href={post.feed.link}>
                {post.feed.author}
              </a>
            </Typography>
          </div>
          <div className={classes.publishedDateContainer}>
            <a href={post.url} rel="bookmark" className={classes.published}>
              <time className={classes.time} dateTime={post.updated}>
                {` ${formatPublishedDate(post.updated)}`}
              </time>
            </a>
          </div>
        </div>
      </ListSubheader>

      <div className={classes.content}>
        <section
          ref={sectionEl}
          className="telescope-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </Box>
  );
};

export default PostComponent;
