import { MouseEventHandler } from 'react';
import { Avatar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      boxShadow: `0 0 0 1px ${theme.palette.border.main}`,
    },
  })
);

type TelescopeAvatarProps = {
  name: string;
  size: string;
  img?: string;
  url?: string;
  backgroundColor?: string;
  fontColor?: string;
  action?: MouseEventHandler;
};

const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map((splitName: string, i: number, arr: string[]) =>
      i === 0 || i + 1 === arr.length ? splitName[0].toUpperCase() : null
    )
    .join('');
  // splitName represents the current value, i represents its index, and arr represent the whole splitted name-word array
  // if the index is 0, means it's the first word in the name
  // if the index+1 equals to the array length, it means the current value is the last word in the name
  // anything rather than first word or last word will not be included in initials
  return initials;
};

const TelescopeAvatar = ({
  name,
  img,
  size,
  url,
  backgroundColor,
  fontColor,
  action,
}: TelescopeAvatarProps) => {
  const classes = useStyles();

  const initials = getInitials(name);
  const backColor = backgroundColor || '#A0D1FB';
  const color = fontColor || '#000';
  return (
    <a
      href={url}
      style={{
        textDecoration: 'none',
      }}
    >
      <Avatar
        onClick={action}
        alt={name}
        src={img}
        className={classes.image}
        style={{
          cursor: 'pointer',
          width: size,
          height: size,
          fontSize: `calc(${size} * 0.43)`,
          backgroundColor: `${backColor}`,
          color: `${color}`,
        }}
        title={name}
      >
        {initials}
      </Avatar>
    </a>
  );
};

export default TelescopeAvatar;
