import { createStyles, ListSubheader, makeStyles, Theme } from '@material-ui/core';
import PostAvatar from './PostAvatar';
import AdminButtons from '../AdminButtons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: '2rem',
      padding: '0',
      display: 'flex',
      borderLeft: '2.5px solid #CBCBCB',
      flexDirection: 'column',
      justifyContent: 'center',
      opacity: '0.7',
      transition: 'opacity .5s',
      '&:hover': {
        opacity: '1'
      }
    },
    authorAvatarContainer: {
      shapeOutside: 'circle(50%) border-box',
      shapeMargin: '1rem',
      borderRadius: '50%',
      marginLeft: '1.5rem'
    },
    circle: {
      display: 'block',
      borderRadius: '50%',
      backgroundColor: '#121D59',
      width: '8em',
      height: '8em',
      marginLeft: '.5em',
    },
    authorNameContainer: {
      width: '100%',
      height: '3rem',
      marginLeft: '1.5rem'
    },
    author: {
      width: '100%',
      wordWrap: 'break-word',
      fontSize: '1.6em',
      lineHeight: '1em',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    published: {
      marginLeft: '1.5rem',
      fontSize: '1.2em',
      fontWeight: 'lighter',
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    time: {
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
  })
);

type Props = {
  postUrl: string;
  blogUrl: string;
  authorName: string;
  postDate: string;
};
const PostDesktopInfo = ({ authorName, postDate, blogUrl, postUrl }: Props) => {
  const classes = useStyles();
  return (
    <ListSubheader className={classes.root}>
      <div className={classes.authorAvatarContainer}>
        <PostAvatar name={authorName} blog={blogUrl} />
      </div>
      <div className={classes.authorNameContainer}>
        <p className={classes.author}>
          <a className={classes.link} href={blogUrl}>
            {authorName}
          </a>
        </p>
      </div>
      <div>
        <a href={postUrl} rel="bookmark" className={classes.published}>
          <time className={classes.time} dateTime={postDate}>
            {postDate}
          </time>
        </a>
      </div>
      <AdminButtons />
    </ListSubheader>
  );
};

export default PostDesktopInfo;
