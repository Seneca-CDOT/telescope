import styles from '../../styles/Header.module.css';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.header_logo}>
        <Link href="/">
          <img src="/logo.svg" alt="logo" className={styles.logo} />
        </Link>
      </div>
      <div>
        <Link href="/search">
          <a>
            <img src="/search.svg" alt="search" className={styles.search} />
          </a>
        </Link>
      </div>
      <div className={styles.header_navigation}>
        <div className={styles.menu}>
          <nav>
            <ul>
              <li>
                <Link href="/">
                  <a>HOME</a>
                </Link>{' '}
              </li>
              <li>
                <Link href="/about">
                  <a>ABOUT</a>
                </Link>{' '}
              </li>
              <li>
                <Link href="/login">
                  <a>LOGIN</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.menu_wrap}>
          <img
            src="/menu.svg"
            alt="menu"
            className={styles.menu_icon}
            onClick={() => {
              setOpen(true);
            }}
          />
          {open ? (
            <div
              className={styles.side}
              onClick={() => {
                setOpen(false);
              }}
            >
              <div
                className={styles.sideNav}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div>
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
                <footer>
                  Copyright &copy; 2020 &nbsp;
                  <a href="https://cdot.senecacollege.ca/">
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
