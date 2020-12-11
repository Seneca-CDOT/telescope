import styles from '../../styles/Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.header_logo}>
        <Link href="/">
          <img src="/logo.svg" alt="logo" className={styles.logo} />
        </Link>
      </div>

      <div className={styles.header_navigation}>
        <div>
          <Link href="/search">
            <a>
              <img src="/search.svg" alt="search" className={styles.search} />
            </a>
          </Link>
        </div>
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
      </div>
    </div>
  );
}
