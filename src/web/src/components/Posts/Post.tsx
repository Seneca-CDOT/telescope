import { useRef, useState, useEffect } from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Typography,
  ListSubheader,
  createStyles,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@material-ui/core';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import GitHubInfo from './GitHubInfo';
import GitHubInfoMobile from './GitHubInfo/GitHubInfoMobile';
import GithubInfoProvider from '../GithubInfoProvider';
import PostDesktopInfo from './PostInfo';
import PostAvatar from './PostAvatar';
import AdminButtons from '../AdminButtons';
import Spinner from '../Spinner';
import ShareButton from './ShareButton';
import ExpandIcon from './ExpandIcon';
import { Post } from '../../interfaces';

import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

type Props = {
  postUrl: string;
  currentPost?: number;
  totalPosts?: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flow-root',
      padding: '0',
      paddingBottom: '2em',
      marginBottom: '3em',
      borderBottom: '1.5px solid #cccccc',
      fontSize: '1.5rem',
      width: '100%',
      backgroundColor: theme.palette.background.default,
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
    },
    postInfo: {
      [theme.breakpoints.down(1205)]: {
        display: 'grid',
        gridTemplateAreas: "'avatar title title title''avatar author date date'",
        gridTemplateColumns: 'auto auto auto auto',
        justifyContent: 'left',
        width: '100%',
        padding: '1em 0 0 0',
        marginBottom: '0',
      },
    },
    video: {
      display: 'block',
      margin: 'auto',
      width: '85%',
      marginBottom: '1.5em',
      [theme.breakpoints.down(1024)]: {
        width: '100%',
      },
    },
    titleContainer: {
      gridArea: 'title',
      color: theme.palette.text.secondary,
      width: '100%',
      padding: '2em 0 1.5em',
      lineHeight: '1.3',
      top: '-1.1em',
      overflowY: 'hidden',
      [theme.breakpoints.down(1205)]: {
        top: '-1.1em',
        width: '725px',
        padding: 'env(safe-area-inset-top, 1em) 0 .1em',
      },
      [theme.breakpoints.down(1024)]: {
        width: '80vw',
      },
      [theme.breakpoints.down(600)]: {
        width: '78vw',
      },
    },
    title: {
      fontWeight: 'bold',
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical',
      textAlign: 'center',
      letterSpacing: '-1.5px',
      fontSize: 'clamp(2.5em, 4vw, 3em)',
      [theme.breakpoints.down(1205)]: {
        textAlign: 'start',
        fontSize: '2em',
        marginLeft: '.3em',
      },
      [theme.breakpoints.down(1024)]: {
        marginLeft: '.1em',
      },
      cursor: 'pointer',
      outline: 'none',
    },
    expandedTitle: {
      display: 'block',
    },
    postCount: {
      marginRight: '16px',
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down(1024)]: {
        margin: '0 2em 0.05em 0',
      },
      [theme.breakpoints.down(600)]: {
        margin: '0 0 0.05em 0',
      },
    },
    chipComponent: {
      border: `1px solid ${theme.palette.primary.main}`,
      color: `${theme.palette.text.primary}`,
      fontSize: '0.75em',
      [theme.breakpoints.down(1024)]: {
        fontSize: '.65em',
      },
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
        margin: '-1.6em -.5em .5px',
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
        paddingTop: 'env(safe-area-inset-top, 1em)',
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
      '& pre code': {
        backgroundColor: theme.palette.background.default,
      },
      '& code': {
        backgroundColor: theme.palette.background.default,
      },
      [theme.breakpoints.down(600)]: {
        padding: '.5em',
        width: 'auto',
      },
    },
    accordionSummary: {
      marginTop: '0',
      paddingRight: '0',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingBottom: '0',
      '& .MuiAccordionSummary-content': {
        marginBottom: '0.2em',
      },
    },
    accordion: {
      backgroundColor: 'inherit',
      borderBottom: '1.5px solid #cccccc',
      boxShadow: 'none',
      top: '0',
      zIndex: 1,
      position: 'sticky',
    },
    expandIcon: {
      alignSelf: 'center',
      borderLeft: '1px solid #cccccc',
      paddingLeft: '5px',
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
  try {
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
  } catch {
    return 'is-generic';
  }
};

// a 'guid' from a YouTube video is usually written as 'yt:video:id'
const extractVideoId = (post: Post): string => post.guid.split(':')[2];

/**
 * Destroys all the .zoomed-image-container elements in the DOM
 * @return {number} Number of elements destroyed
 */
const zoomOutAllImages = () => {
  const zoomedImgContainers = document.querySelectorAll<HTMLDivElement>('.zoomed-image-container');
  zoomedImgContainers.forEach((zoomedImgDiv) => {
    zoomedImgDiv.remove();
  });
  return zoomedImgContainers.length;
};

function ZoomInImage(img: HTMLImageElement) {
  // create a new div to hold the zoomed image
  const zoomedImgContainer = document.createElement('div');
  zoomedImgContainer.classList.add('zoomed-image-container');
  // clone the image and add it to the new div
  const zoomedImg = img.cloneNode(true) as HTMLImageElement;
  zoomedImgContainer.appendChild(zoomedImg);
  // add the new div to the DOM
  document.body.appendChild(zoomedImgContainer);
  zoomedImg.classList.add('zoomed-image');
}

function handleZoom(e: MouseEvent) {
  // zoom out of all the currently zoomed images, if zoomed out, don't do anything.
  if (zoomOutAllImages()) return;

  // if the user clicks on an image, zoom in
  if (e.target instanceof HTMLImageElement) {
    e.preventDefault();
    ZoomInImage(e.target);
  }
  // if the user clicks an anchor with an image inside, do not open the image link in a new tab.
  else if (
    e.target instanceof HTMLAnchorElement &&
    e.target.firstChild instanceof HTMLImageElement
  ) {
    e.preventDefault();
  }
}

const PostComponent = ({ postUrl, currentPost, totalPosts }: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1205));
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef<HTMLElement>(null);

  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR<Post>(postUrl);
  const isMedia = post?.type === 'video';
  const [expandHeader, setExpandHeader] = useState(false);
  // Extract all the github urls from the post
  useEffect(() => {
    const onScroll = () => {
      // get the distance between the bottom of the blog post and
      // the top of the web page
      const bottom = sectionEl?.current?.getBoundingClientRect().bottom;
      if (bottom && bottom < 1) {
        // if bottom reaches top => close header and remove event listener
        setExpandHeader(false);
        window.removeEventListener('scroll', onScroll);
      }
    };
    // only if header is open, we attach the onScroll function to scroll event
    if (expandHeader) {
      window.addEventListener('scroll', onScroll);
    }
  }, [expandHeader]);

  // Listen for click events
  useEffect(() => {
    window.document.addEventListener('click', handleZoom);
  }, []);
  // Remove the event listener when the component unmounts
  useEffect(() => {
    return () => {
      window.document.removeEventListener('click', handleZoom);
    };
  }, []);

  if (error) {
    console.error(`Error loading post at ${postUrl}`, error);
    return (
      <Box component="div" className={classes.root}>
        <ListSubheader component="div" className={classes.titleContainer}>
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
        <ListSubheader component="div" className={classes.titleContainer}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            Loading Blog...
          </Typography>
        </ListSubheader>

        <Grid container justifyContent="center">
          <Grid item className={classes.spinner}>
            <Spinner />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <GithubInfoProvider htmlString={post?.html}>
      <Box className={classes.root}>
        {currentPost && totalPosts && (
          <div className={classes.postCount}>
            <Chip
              label={`${currentPost.toLocaleString()} of ${totalPosts.toLocaleString()}`}
              variant="outlined"
              className={classes.chipComponent}
            />
          </div>
        )}

        {desktop ? (
          <>
            <ListSubheader component="div" className={classes.postInfo}>
              <div className={classes.titleContainer}>
                <Typography
                  variant="h3"
                  title={post.title}
                  id={post.id}
                  className={clsx(classes.title, expandHeader && classes.expandedTitle)}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandHeader(!expandHeader)}
                    onKeyDown={() => setExpandHeader(!expandHeader)}
                  >
                    {post.title}
                  </span>
                </Typography>
              </div>
            </ListSubheader>
            <ListSubheader component="div" className={classes.desktopPostInfo}>
              <PostDesktopInfo
                postUrl={post.url}
                authorName={post.feed.author}
                postDate={formatPublishedDate(post.updated)}
                blogUrl={post.feed.link}
              />
              <GitHubInfo />
            </ListSubheader>
          </>
        ) : (
          <Accordion
            onKeyDown={() => setExpandHeader(!expandHeader)}
            expanded={expandHeader}
            className={classes.accordion}
          >
            <AccordionSummary className={classes.accordionSummary}>
              <ListSubheader component="div" className={classes.postInfo}>
                <div className={classes.titleContainer}>
                  <Typography
                    variant="h3"
                    title={post.title}
                    id={post.id}
                    className={clsx(classes.title, expandHeader && classes.expandedTitle)}
                  >
                    <span role="button" tabIndex={0}>
                      {post.title}
                    </span>
                  </Typography>
                </div>
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
                      <time dateTime={post.updated}>{`${formatPublishedDate(post.updated)}`}</time>
                    </a>
                    <ShareButton url={post.url} />
                    <ExpandIcon
                      small
                      expandHeader={expandHeader}
                      setExpandHeader={setExpandHeader}
                    />
                  </h1>

                  <div>
                    <AdminButtons />
                  </div>
                </div>
              </ListSubheader>
            </AccordionSummary>
            <AccordionDetails>
              <GitHubInfoMobile />
            </AccordionDetails>
            <ExpandIcon
              small={false}
              expandHeader={expandHeader}
              setExpandHeader={setExpandHeader}
            />
          </Accordion>
        )}

        <div className={classes.content}>
          {isMedia && (
            <LiteYouTubeEmbed
              id={extractVideoId(post)}
              title={post.title}
              wrapperClass={`yt-lite ${classes.video}`}
            />
          )}
        </div>
        <div className={classes.content}>
          {isMedia && (
            <LiteYouTubeEmbed
              id={extractVideoId(post)}
              title={post.title}
              wrapperClass={`yt-lite ${classes.video}`}
            />
          )}

          <section
            ref={sectionEl}
            className={`telescope-post-content ${extractBlogClassName(post.url)}`}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </Box>
    </GithubInfoProvider>
  );
};

export default PostComponent;
