import Link from 'next/link';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip, Zoom, SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const useStyles = makeStyles(() => ({
  icon: {
    fontSize: '2.5rem',
  },
  button: {
    margin: '0 0.5rem 0 0.5rem',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#000',
    },
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.5rem',
    margin: 0,
  },
})(Tooltip);

export type NavBarIcon = {
  href: string;
  title: string;
  ariaLabel: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
};

const NavBarButton = ({ button }: { button: NavBarIcon }) => {
  const classes = useStyles();
  const { href, title, ariaLabel, Icon } = button;

  return (
    <Link href={href} passHref>
      <ButtonTooltip title={title} arrow placement="top" TransitionComponent={Zoom}>
        <IconButton color="inherit" className={classes.button} aria-label={ariaLabel} component="a">
          <Icon className={classes.icon} />
        </IconButton>
      </ButtonTooltip>
    </Link>
  );
};

export default NavBarButton;
