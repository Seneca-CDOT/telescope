import { MouseEventHandler } from 'react';
import Link from 'next/link';
import { Button, IconButton, Theme, Tooltip, Zoom } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { SvgIconComponent } from '@mui/icons-material';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    fontSize: '2.5rem',
  },
  button: {
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
    },
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.5rem',
    margin: 0,
  },
})(Tooltip);

interface NavBarIconBase {
  title: string;
  Icon: SvgIconComponent;
}

interface NavBarIconButton extends NavBarIconBase {
  onClick: MouseEventHandler;
}

interface NavBarIconLink extends NavBarIconBase {
  href: string;
  ariaLabel: string;
}

export type NavBarIconProps = NavBarIconButton | NavBarIconLink;

const NavBarButton = (props: NavBarIconProps) => {
  const classes = useStyles();

  if (!props) {
    return null;
  }

  if ('href' in props) {
    const { href, title, ariaLabel, Icon } = props;
    return (
      <Link href={href} passHref>
        <ButtonTooltip title={title} arrow placement="top" TransitionComponent={Zoom}>
          <IconButton
            color="inherit"
            className={classes.button}
            aria-label={ariaLabel}
            component="a"
            size="large"
          >
            <Icon className={classes.icon} />
          </IconButton>
        </ButtonTooltip>
      </Link>
    );
  }

  const { onClick, title, Icon } = props;
  return (
    <ButtonTooltip title={title} arrow placement="top" TransitionComponent={Zoom}>
      <Button color="inherit" className={classes.button} onClick={onClick}>
        <Icon className={classes.icon} />
      </Button>
    </ButtonTooltip>
  );
};

export default NavBarButton;
