import { MouseEventHandler } from 'react';
import Link from 'next/link';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { IconButton, Button, Tooltip, Zoom, SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const useStyles = makeStyles((theme) => ({
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
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
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
