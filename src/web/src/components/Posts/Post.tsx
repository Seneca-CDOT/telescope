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
      fontFamily: 'Spartan',
      padding: 0,
      fontSize: '1.5rem',
      marginBottom: '4em',
      backgroundColor: theme.palette.background.default,
      // border: '15px solid gray',
    },
    header: {
      // border: '5px solid red',
      // backgroundColor: theme.palette.background.default,
      color: theme.palette.text.secondary,
      padding: '2em 3em 1.5em 3em',
      lineHeight: '1.3',
      zIndex: 1100,
      top: '-1.1em',
      fontSize: '0.9em',
      [theme.breakpoints.down(1200)]: {
        paddingTop: '1.6em',
        paddingBottom: '1em',
      },
      // [theme.breakpoints.down(1065)]: {
      //   position: 'static',
      // },
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
      fontSize: '3.5em',
      fontWeight: 'bold',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '2.5em',
      },
    },
    author: {
      fontSize: '2em',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    published: {
      fontSize: '1.8em',
      textDecoration: 'none',
      color: theme.palette.text.primary,
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '1em',
      },
    },
    content: {
      overflow: 'auto',
      // border: '10px solid blue',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      width: '100%',
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
      lineHeight: '1.00',
      fontSize: '1em',
    },
    test: {
      // backgroundColor: 'purple',
      color: 'white',
      width: '200px',
      height: '200px',
      float: 'right',
      marginRight: '-24em',
      top: '8em',
      bottom: '100%',
      [theme.breakpoints.down(1200)]: {
        // backgroundColor: 'blue',
        color: 'blue',
        width: '100%',
        height: '2%',
        float: 'none',
        top: '8.4em',
      },
    },
    authorInfoContainer: {
      // backgroundColor: 'green',
      display: 'flex',
      flexDirection: 'column',
      flexFlow: 'flex-end',
      borderLeft: '2.5px solid #707070',
      width: '100%',
      paddingLeft: '2em',
      height: '100%',
      [theme.breakpoints.down(1200)]: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'center',
        borderLeft: 'none',
      },
    },
    authorNameContainer: {
      [theme.breakpoints.down(1200)]: {
        padding: '0 3em 0 1em',
      },
    },
    publishedDateContainer: {
      // [theme.breakpoints.down(1200)]: {
      //   // alignSelf: 'flex-end',
      // },
    },
    authorAvatarContainer: {
      shapeOutside: 'circle(50%) border-box',
      shapeMargin: '1rem',
      borderRadius: '50%',
      float: 'left',
      paddingBottom: '1em',
      [theme.breakpoints.down(1200)]: {
        float: 'none',
        paddingBottom: '0px',
        // display: 'none',
      },
    },
    circle: {
      display: 'block',
      borderRadius: '50%',
      backgroundColor: '#121D59',
      width: '8em',
      height: '8em',
      [theme.breakpoints.down(1200)]: {
        margin: '0.5em 0',
        width: '4em',
        height: '4em',
      },
    },
  })
);

const formatPublishedDate = (dateString: string) => {
  const date: Date = new Date(dateString);
  const formatted = new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  return `Last Updated ${formatted}`;
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
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
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
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
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
      <ListSubheader className={classes.header}>
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
      <ListSubheader className={classes.test}>
        <div className={classes.authorInfoContainer}>
          <div className={classes.authorAvatarContainer}>
            <div className={classes.circle} />
          </div>
          <div className={classes.authorNameContainer}>
            <Typography variant="caption" className={classes.author}>
              <a className={classes.link} href={post.feed.url}>
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
