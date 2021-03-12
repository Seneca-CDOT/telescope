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

  if (name) {
    const nameArr = name.split(' ');
    let initials;
    if (nameArr.length >= 2) {
      const firstName = nameArr[0].substring(0, 1).toUpperCase();
      const lastName = nameArr[nameArr.length - 1].substring(0, 1).toUpperCase();
      initials = firstName + lastName;
    } else if (nameArr.length === 1) {
      initials = nameArr[0].substring(0, 1).toUpperCase();
    }
    return <Avatar className={classes.avatar}>{initials}</Avatar>;
  }

  return <Avatar className={classes.avatar} />;
};

export default PostAvatar;
