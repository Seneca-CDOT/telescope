import { useRef, useState } from 'react';
import useSWR from 'swr';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Typography,
  ListSubheader,
  createStyles,
  useMediaQuery,
} from '@material-ui/core';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import { Post } from '../../interfaces';
import AdminButtons from '../AdminButtons';
import Spinner from '../Spinner';
import PostDesktopInfo from './PostInfo';
import PostAvatar from './PostAvatar';

type Props = {
  postUrl: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      paddingBottom: '2em',
      marginBottom: '3em',
      borderBottom: '1.5px solid #cccccc',
      fontSize: '1.5rem',
      width: '100%',
      backgroundColor: theme.palette.background.default,
      minHeight: '300px',
    },
    spinner: {
      padding: '20px',
    },
    error: {
      lineHeight: '1',
      fontSize: '1em',
    },
    desktopPostInfo: {
      width: '200px',
      float: 'right',
      marginRight: '-22em',
      top: '8em',
      bottom: '100%',
    },
    postInfo: {
      [theme.breakpoints.down(1205)]: {
        display: 'grid',
        gridTemplateAreas: "'avatar title title title''avatar author date date'",
        gridTemplateColumns: 'auto auto auto auto',
        justifyContent: 'left',
        width: '100%',
        padding: '1em 0 1em 0',
      },
    },
    titleContainer: {
      gridArea: 'title',
      color: theme.palette.text.secondary,
      width: '100%',
      padding: '2em 0 1.5em',
      lineHeight: '1.3',
      top: '-1.1em',
      [theme.breakpoints.down(1205)]: {
        top: '-1.1em',
        width: '725px',
        padding: '1em 0 .1em',
      },
      [theme.breakpoints.down(1024)]: {
        width: '80vw',
      },
      [theme.breakpoints.down(600)]: {
        width: '78vw',
      },
    },
    title: {
      fontSize: '3em',
      fontWeight: 'bold',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      letterSpacing: '-1.5px',
      [theme.breakpoints.down(1205)]: {
        fontSize: '2em',
        fontWeight: 'bold',
        textAlign: 'start',
        letterSpacing: '-1.5px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.3',
        marginLeft: '.3em',
      },
      [theme.breakpoints.down(1024)]: {
        fontSize: '2.5em',
        marginLeft: '.1em',
      },
    },
    expandHeader: {
      whiteSpace: 'normal',
      cursor: 'pointer',
      outline: 'none',
    },
    collapseHeader: {
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      outline: 'none',
    },
    authorNameContainer: {
      [theme.breakpoints.down(1205)]: {
        gridArea: 'author',
        width: '100%',
      },
    },
    author: {
      [theme.breakpoints.down(1205)]: {
        fontSize: '2em',
        lineHeight: '1.5em',
        fontWeight: 'bold',
        margin: '.2em 0 0 .5em',
        color: theme.palette.text.primary,
      },
      [theme.breakpoints.down(1024)]: {
        fontSize: '1.1em',
        marginRight: '.3em',
      },
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    publishedDateContainer: {
      [theme.breakpoints.down(1205)]: {
        gridArea: 'date',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      },
      [theme.breakpoints.down(300)]: {
        minWidth: '140px',
      },
    },
    published: {
      [theme.breakpoints.down(1205)]: {
        height: '10px',
        margin: '-.6em 1em -1em 1.5em',
        fontSize: '1.3em',
        fontWeight: 'lighter',
        color: theme.palette.text.primary,
      },
      [theme.breakpoints.down(1024)]: {
        fontSize: '1.1em',
        height: '5px',
        margin: '-1.6em 1em -1em .5px',
      },
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    authorAvatarContainer: {
      [theme.breakpoints.down(1205)]: {
        gridArea: 'avatar',
        shapeOutside: 'circle(50%) border-box',
        shapeMargin: '1rem',
        borderRadius: '50%',
        padding: '0',
        display: 'grid',
        alignItems: 'center',
      },
    },
    content: {
      overflow: 'auto',
      padding: '1em',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      width: '95%',
      '& a': {
        color: theme.palette.action.active,
      },
      '& a:visited': {
        color: theme.palette.action.selected,
      },
      [theme.breakpoints.down(600)]: {
        padding: '.5em',
        width: 'auto',
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

const extractBlogClassName = (url: string) => {
  const blogClassName = new URL(url).hostname;
  if (blogClassName.endsWith('medium.com')) {
    return 'is-medium';
  }
  if (blogClassName.endsWith('dev.to')) {
    return 'is-devto';
  }
  if (blogClassName.endsWith('blogspot.com')) {
    return 'is-blogspot';
  }
  return 'is-generic';
};

const PostComponent = ({ postUrl }: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1205));
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef<HTMLElement>(null);
  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR<Post>(postUrl);
  const [expandHeader, setExpandHeader] = useState(false);

  if (error) {
    console.error(`Error loading post at ${postUrl}`, error);
    return (
      <Box component={Box} className={classes.root}>
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
      <ListSubheader className={classes.postInfo}>
        <div className={classes.titleContainer}>
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
        </div>
        {!desktop && (
          <>
            <div className={classes.authorAvatarContainer}>
              <PostAvatar name={post.feed.author} url={post.feed.link} />
            </div>
            <div className={classes.authorNameContainer}>
              <h1 className={classes.author}>
                <a className={classes.link} href={post.feed.link}>
                  {post.feed.author}
                </a>
              </h1>
            </div>
            <div className={classes.publishedDateContainer}>
              <h1 className={classes.published}>
                <a href={post.url} rel="bookmark" className={classes.link}>
                  {`${formatPublishedDate(post.updated)}`}
                </a>
              </h1>
              <div>
                <AdminButtons />
              </div>
            </div>
          </>
        )}
      </ListSubheader>
      {desktop && (
        <ListSubheader className={classes.desktopPostInfo}>
          <PostDesktopInfo
            postUrl={post.url}
            authorName={post.feed.author}
            postDate={formatPublishedDate(post.updated)}
            blogUrl={post.feed.link}
          />
        </ListSubheader>
      )}
      <div className={classes.content}>
        <section
          ref={sectionEl}
          className={`telescope-post-content ${extractBlogClassName(post.url)}`}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </Box>
  );
};

export default PostComponent;
