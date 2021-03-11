import { createStyles, Box, ListSubheader, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '0',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderLeft: '2.5px solid #707070',
    },
    authorAvatarContainer: {
      shapeOutside: 'circle(50%) border-box',
      shapeMargin: '1rem',
      borderRadius: '50%',
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
    },
    author: {
      width: '100%',
      wordWrap: 'break-word',
      fontSize: '2em',
      lineHeight: '1.5em',
      fontWeight: 'bold',
      marginLeft: '.5em',
      color: theme.palette.text.primary,
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    publishedDateContainer: {
      // width: '100%',
    },
    published: {
      // width: '50%',
      marginLeft: '.5em',
      // marginTop: '7em',
      fontSize: '1.5em',
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
        <div className={classes.circle} />
      </div>
      <div className={classes.authorNameContainer}>
        <h1 className={classes.author}>
          <a className={classes.link} href={blogUrl}>
            {authorName}
          </a>
        </h1>
      </div>
      <div className={classes.publishedDateContainer}>
        <a href={postUrl} rel="bookmark" className={classes.published}>
          <time className={classes.time} dateTime={postDate}>
            {postDate}
          </time>
        </a>
      </div>
    </ListSubheader>
  );
};

export default PostDesktopInfo;
