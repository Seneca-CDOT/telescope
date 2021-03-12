import { createStyles, Theme, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type AvatarProps = {
  name: String;
  img?: String;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      marginLeft: '0.5rem',
      color: '#e5e5e5',
      backgroundColor: '#121D59',
      fontSize: '2.5rem',
      width: '3em',
      height: '3em',
      [theme.breakpoints.down(1200)]: {
        fontSize: '2em',
        width: '2.5em',
        height: '2.5em',
      },
    },
  })
);

const PostAvatar = ({ name, img }: AvatarProps) => {
  const classes = useStyles();

  if (img) {
    return <Avatar className={classes.avatar} src="img" />;
  }

  if (name.length > 0) {
    const initials = name
      .split(' ')
      .map((splitName, i, arr) => (i === 0 || i + 1 === arr.length ? splitName[0] : null))
      .join('');
    return <Avatar className={classes.avatar}>{initials}</Avatar>;
  }

  return <Avatar className={classes.avatar} />;
};

export default PostAvatar;
