import styles from '../../styles/Header.module.css';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);
  function isOpen() {
    document.getElementById('mySide').style.width = '100%';
    document.getElementById('mySide').style.display = 'block';
  }

  return (
    <div className={styles.container}>
      <div className={styles.header_logo}>
        <Link href="/">
          <img
            src="/logo.svg"
            alt="logo"
            className={styles.logo}
            onClick={() => {
              setOpen(false);
            }}
          />
        </Link>
      </div>

      <div>
        <Link href="/search">
          <a>
            <img
              src="/search.svg"
              alt="search"
              className={styles.search}
              onClick={() => {
                setOpen(false);
              }}
            />
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
              setOpen(!open);
            }}
          />
          {/* <img src="/menu.svg" alt="menu" className= {styles.menu_icon} onClick={()=>{isOpen()}} />  */}
          {open ? (
            <div id="mySide" className={styles.sideNav}>
              {/* <section>
                     <hr/> */}
              <div>
                <Link href="/">
                  <a>HOME</a>
                </Link>
                <hr />
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
              {/* </section> */}
              <footer>Footer</footer>
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
}
