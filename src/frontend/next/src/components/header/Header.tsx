import MenuIcon from '@material-ui/icons/Menu';
import Link from 'next/link';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

// let MenuIcon: any = MenuIcon;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      height: '4.5em',
      width: '100%',
      backgroundColor: '#333e64',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
    },
    header_logo: {
      flex: 1,
    },
    logo: {
      height: '3.5em',
      width: 'auto',
      margin: '0.5rem 0.5rem',
    },
    header_navigation: {
      padding: '5rem 0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    search: {
      flex: 1,
      height: '1.8em',
      width: 'auto',
      filter: 'invert(85%)',
    },
    menu: {
      flex: 3,
      marginRight: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      [theme.breakpoints.up(768)]: {
        display: 'none',
      },
    },
    menu_nav_ul_li: {
      color: '#e5e5e5',
      fontWeight: 500,
      display: 'inline',
      padding: '20px 15px',
    },
    menu_icon: {
      display: 'none',
      [theme.breakpoints.up(768)]: {
        height: '1.5em',
        width: 'auto',
        filter: 'invert(85%)',
        display: 'block',
        margin: '0 1em',
        flex: 1,
      },
    },
    side: {
      [theme.breakpoints.up(768)]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        content: ' ',
        background: 'rgba(0, 0, 0, 0.5)',
      },
    },
    sideNav: {
      display: 'none',
      [theme.breakpoints.up(768)]: {
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        lineHeight: '1.75',
        color: '#e5e5e5',
        fontWeight: 500,
        textAlign: 'center',
        position: 'fixed',
        right: 0,
        backgroundColor: '#333e64',
        paddingTop: '15px',
        height: '100%',
        width: '250px',
        zIndex: 1,
      },
    },
    sideNav_div: {
      [theme.breakpoints.up(768)]: {
        width: 'inherit',
        flex: 1,
        justifySelf: 'center',
      },
    },
    sideNav_footer: {
      [theme.breakpoints.up(768)]: {
        justifySelf: 'flex-end',
        fontSize: '0.8rem',
        textAlign: 'center',
      },
    },
    sideNav_footer_a: {
      [theme.breakpoints.up(768)]: {
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  })
);

export default function Header() {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={classes.root}>
      <div className={classes.header_logo}>
        <Link href="/">
          <MenuIcon className={classes.logo} />
          {/* <img src={MenuIcon} alt="logo" className={classes.logo} /> */}
        </Link>
      </div>
      <div>
        <Link href="/search">
          <a>
            <img src="/search.svg" alt="search" className={classes.search} />
          </a>
        </Link>
      </div>
      <div className={classes.header_navigation}>
        <div className={classes.menu}>
          <nav>
            <ul>
              <li className={classes.menu_nav_ul_li}>
                <Link href="/">
                  <a>HOME</a>
                </Link>{' '}
              </li>
              <li className={classes.menu_nav_ul_li}>
                <Link href="/about">
                  <a>ABOUT</a>
                </Link>{' '}
              </li>
              <li className={classes.menu_nav_ul_li}>
                <Link href="/login">
                  <a>LOGIN</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className={classes.menu}>
          <img
            src="/menu.svg"
            alt="menu"
            className={classes.menu_icon}
            onClick={() => {
              setOpen(true);
            }}
          />
          {open ? (
            <div
              className={classes.side}
              onClick={() => {
                setOpen(false);
              }}
            >
              <div
                className={classes.sideNav}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={classes.sideNav_div}>
                  <Link href="/">
                    <a>HOME</a>
                  </Link>
                  <hr />
                  <Link href="/about">
                    <a>ABOUT</a>
                  </Link>
                  <hr />
                  <Link href="/login">
                    <a>LOGIN</a>
                  </Link>
                  <hr />
                </div>
                <footer className={classes.sideNav_footer}>
                  Copyright&copy; {new Date().getFullYear()}
                  <a className={classes.sideNav_footer_a} href="https://cdot.senecacollege.ca/">
                    Seneca’s Centre for Development of Open Technology
                  </a>
                </footer>
              </div>
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
}
