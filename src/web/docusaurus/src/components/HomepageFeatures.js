import React from 'react';
import styles from './HomepageFeatures.module.css';

const TelescopeBG = [
  {
    alt: 'Telescope on the foreground',
    Svg: require('../../static/img/home_page/telescope_0.svg').default,
    layer: 0,
  },
  {
    alt: 'Mountains at the front',
    Svg: require('../../static/img/home_page/mountains_1.svg').default,
    layer: -1,
  },
  {
    alt: 'Mountains at the back',
    Svg: require('../../static/img/home_page/mountains_2.svg').default,
    layer: -2,
  },
  {
    alt: 'Planet in the sky',
    Svg: require('../../static/img/home_page/planet_3.svg').default,
    layer: -3,
  },
  {
    alt: 'Dark skies with stars in the background',
    Svg: require('../../static/img/home_page/sky_4.svg').default,
    layer: -4,
  },
];

function Feature({ Svg, title, layer }) {
  return <Svg className={styles.featureSvg} style={{ zIndex: layer }} alt={title} />;
}

export default function HomepageFeatures() {
  return (
    <div className={styles.telArt}>
      {TelescopeBG.map((props, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Feature key={idx} {...props} />
      ))}
    </div>
  );
}
