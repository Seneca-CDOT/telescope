import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      fontFamily: 'Spartan',
      padding: '1em 0 2em 0',
      paddingTop: 'env(safe-area-inset-top)',
      wordWrap: 'break-word',
      [theme.breakpoints.down('md')]: {
        maxWidth: 'none',
      },
      '& h1': {
        color: theme.palette.text.secondary,
        fontSize: 24,
        transition: 'color 1s',
        marginTop: 0,
        padding: '2vh 22vw',
        [theme.breakpoints.down('md')]: {
          padding: '1vh 8vw',
          wordWrap: 'break-word',
        },
      },
      '& h2': {
        color: theme.palette.text.secondary,
        fontSize: 20,
        transition: 'color 1s',
        padding: '2vh 22vw',
        [theme.breakpoints.down('md')]: {
          padding: '1vh 8vw',
          wordWrap: 'break-word',
        },
      },
      '& p, blockquote': {
        color: theme.palette.text.primary,
        fontSize: 16,
        padding: '1vh 20vw',
        marginBottom: '0',
        [theme.breakpoints.down('md')]: {
          padding: '1vh 5vw',
          wordWrap: 'break-word',
        },
      },
      '& a': {
        color: theme.palette.action.active,
      },
      '& a:visited': {
        color: theme.palette.action.selected,
      },
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
    languageSelector: {
      position: 'absolute',
      right: '10rem',
    },
  };
});

const AboutPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.languageSelector}>
        <LanguageSelector />
      </div>
      <h1> {t('about')}</h1>
      <p>
        One of the key features of Seneca&apos;s open source involvement has been the emphasis on
        sharing what we&apos;re working on, teaching, and learning through blogging. We believe that
        one of the most rewarding parts of learning to work in the open source community is
        discovering that one can become part of the fabric of the web, find a voice, and build a
        following.
      </p>
      <p>
        We also believe that reading each other&apos;s blog posts is important. In the blog posts of
        our colleagues, we find that we are not alone in our struggles to make things work, our
        interests in various topics, and that imposter syndrome isn&apos;t something unique to
        &quot;me.&quot;
      </p>
      <p>
        To better enable the discovery of blogs within our community, we set up an open source blog{' '}
        <a href="https://en.wikipedia.org/wiki/Planet_(software)">Planet</a>: an aggregated feed of
        blog posts from Seneca faculty and students working on open source in a single page. Our old
        blog Planet used to live at http://zenit.senecac.on.ca/~chris.tyler/planet/, and was run
        faithfully by Chris Tyler for more than a decade. We&apos;ve made a re-creation of what it
        looked like at{' '}
        <a href="http://telescope.cdot.systems/planet">http://telescope.cdot.systems/planet</a> if
        you want to see it..
      </p>

      <h2>What is a Planet?</h2>
      <blockquote>
        Planet is a feed aggregator application designed to collect posts from the weblogs of
        members of an Internet community and display them on a single page. Planet runs on a web
        server. It creates pages with entries from the original feeds in chronological order, most
        recent entries first. --
        <a href="https://en.wikipedia.org/wiki/Planet_(software)">Wikipedia</a>
      </blockquote>
      <p>
        In the early 2000s, before the rise of social media apps like Twitter and Facebook, Planet
        solved an important problem in the free and open source community. It used various
        &quot;feed&quot; technologies (RSS, Atom, CDF) to allow blog posts from different platforms
        to be aggregated into a single page that was constantly updated with the latest posts by
        people within a particular community.
      </p>

      <p>
        <a href="https://people.gnome.org/~jdub/bzr/planet/devel/trunk/">
          Written in Python by Jeff Waugh and Scott James Remnant
        </a>
        , Planet could be configured with a list of blog feeds and an HTML template. It would use
        these to dynamically generate a site with posts in chronological order from the specified
        feeds.
      </p>

      <h2>In Search of a New Planet</h2>
      <p>
        Our original Planet was shutdown in January 2020. The{' '}
        <a href="https://people.gnome.org/~jdub/bzr/planet/devel/trunk/">
          software we use was last updated 13 years ago
        </a>
        . While the underlying code has drifted further into the past, our needs have moved forward.
        Maintaining the existing system, especially with the number of students involved in open
        source at Seneca, has become too difficult. Our current site often breaks, and needs manual
        interventions on a regular basis. Going forward, we need a new planet to call home.
      </p>
      <p>
        We have decided it is time to consider moving to a new system. Unfortunately, almost every
        system that came to replace Planet has itself become unmaintained.
      </p>
      <p>
        Rather than try to find an existing solution, we have instead decided to try and create one.
        Because we need this software, we also feel that we should create and maintain it. And,
        since our need for a Planet comes out of our collective work on open source, we think that
        creating it _together as open source_ would be the most desireable path forward.
      </p>

      <h2>Trying to Define Our Planet</h2>
      <p>
        We have learned a number of things over the past decade running our own planet. We&apos;ve
        also watched as social media and modern technologies have reshaped our expectations for what
        a system like this can and should be.
      </p>
      <p>
        It&apos;s not 100% clear what we need to build, which is part of the fun. It is our hope
        that <i>you</i> will leave a mark on this project, and bring your own ideas, experience, and
        code to the task of defining our planet.
      </p>
    </div>
  );
};

export default AboutPage;
