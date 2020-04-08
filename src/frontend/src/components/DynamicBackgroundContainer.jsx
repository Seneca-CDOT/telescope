import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundSize: 'cover',
    transition: 'opacity 1s ease-in-out',
    position: 'absolute',
    height: '100vh',
    width: '100%',
    top: 0,
  },
  child: {
    transition: 'opacity 1s ease-in-out',
  },
}));

export default function DynamicBackgroundContainer(props) {
  const [backgroundImgSrc, setBackgroundImgSrc] = useState('');
  const [transitionBackground, setTransitionBackground] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    async function getBackgroundImgSrc() {
      // Uses https://unsplash.com/collections/1538150/milkyway collection
      /* Other Options:
        - https://unsplash.com/collections/291422/night-lights
        */

      // Ensure we are using an image which fits correctly to user's viewspace
      const dimensions = `${window.innerWidth}x${window.innerHeight}`;
      console.log(dimensions);
      const response = await fetch(`https://source.unsplash.com/collection/894/${dimensions}`);

      if (response.status !== 200) {
        setBackgroundImgSrc('../../images/hero-banner.png');
        setTransitionBackground(false);
        throw new Error(response.statusText);
      }

      setBackgroundImgSrc(response.url);
      setTransitionBackground(false);
    }

    getBackgroundImgSrc();
  }, []);

  return (
    <div>
      <div
        className={classes.background}
        style={{
          backgroundImage: `url(${backgroundImgSrc})`,
          opacity: transitionBackground ? 0 : 0.45,
        }}
      ></div>
      <div
        className={classes.child}
        style={{
          opacity: transitionBackground ? 0 : 0.85,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
