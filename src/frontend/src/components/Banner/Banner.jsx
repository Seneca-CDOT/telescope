import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { faArrowAltCircleDown } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
=======
>>>>>>> updated work for banner

import './Banner.css';

const Banner = props => (
  <div className="heroBanner">
    <div className="bannerImg"></div>
    <div className="h1">Telescope</div>
    <div className="icon">
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="far"
        data-icon="arrow-alt-circle-down"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="#335a7e"
          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm-32-316v116h-67c-10.7 0-16 12.9-8.5 20.5l99 99c4.7 4.7 12.3 4.7 17 0l99-99c7.6-7.6 2.2-20.5-8.5-20.5h-67V140c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12z"
        ></path>
      </svg>
    </div>
=======
import banner from '../../images/hero-banner.png';
=======
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';
=======
import { faArrowAltCircleDown } from '@fortawesome/free-regular-svg-icons';
>>>>>>> attempt of styling the button I guess
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
>>>>>>> added arrow button but not styled

import './Banner.css';

const Banner = props => (
  <div className="heroBanner">
    <div className="h1">Telescope</div>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> basic banner, background and text not scaled properly
=======
    <button>
      <FontAwesomeIcon icon={faArrowAltCircleDown} />
    </button>
>>>>>>> added arrow button but not styled
=======
    <div className="button">
      <button className="button" onClick={() => alert('Help')}>
        <FontAwesomeIcon icon={faArrowAltCircleDown} size="5x" color="#335A7E" />
      </button>
    </div>
>>>>>>> attempt of styling the button I guess
  </div>
);

Banner.propTypes = {
  className: PropTypes.string,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  drawerHandler: PropTypes.func,
  scrolled: PropTypes.bool,
>>>>>>> basic banner, background and text not scaled properly
=======
>>>>>>> added arrow button but not styled
};

export default Banner;
