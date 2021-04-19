import { createStyles, Theme, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type AvatarProps = {
  name: string;
  img?: string;
  url?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      marginLeft: '0.5rem',
      color: theme.palette.type === 'light' ? '#e5e5e5' : '#121D59',
      backgroundColor: theme.palette.primary.main,
      fontSize: '2.5rem',
      width: '2.5em',
      height: '2.5em',
      [theme.breakpoints.down(1200)]: {
        fontSize: '2.5em',
        width: '2.5em',
        height: '2.5em',
      },
      [theme.breakpoints.down(1024)]: {
        fontSize: '2em',
        width: '2.5em',
        height: '2.5em',
      },
    },
    text: {
      transform: 'translateY(3px)',
      [theme.breakpoints.down(1200)]: {
        transform: 'translateY(2px)',
      },
    },
    link: {
      textDecoration: 'none',
    },
  })
);

const PostAvatar = ({ name, img, url }: AvatarProps) => {
  const classes = useStyles();

  if (img) {
    return <Avatar className={classes.avatar} src={img} />;
  }

  if (name.length > 0) {
    const initials = name
      .split(' ')
      // splitName represents the current value, i represents its index, and arr represent the whole splitted name-word array
      // if the index is 0, means it's the first word in the name
      // if the index+1 equals to the array length, it means the current value is the last word in the name
      // anything rather than first word or last word will not be included in initials
      .map((splitName, i, arr) =>
        i === 0 || i + 1 === arr.length ? splitName[0].toUpperCase() : null
      )
      .join('');
    return (
      <div>
        {url?.length ? (
          <a href={url} className={classes.link}>
            <Avatar className={classes.avatar}>
              <p className={classes.text}>{initials}</p>
            </Avatar>
          </a>
        ) : (
          <Avatar className={classes.avatar}>
            <p className={classes.text}>{initials}</p>
          </Avatar>
        )}
      </div>
    );
  }

  return <Avatar className={classes.avatar} />;
};

export default PostAvatar;
