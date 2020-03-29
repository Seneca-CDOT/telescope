import React from 'react';
<<<<<<< HEAD

import PageBase from './PageBase';

const About = () => {
  return <PageBase title="About"></PageBase>;
=======
import { Link } from 'gatsby';
import Header from '../components/Header';

const About = () => {
  return (
    <div>
      <Header />
      <Link to="/blog/my-first-post">my-first-post</Link>
    </div>
  );
>>>>>>> cdfb9ba... getting started with markdown
};

export default About;
