import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Grid, MobileStepper } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { graphql } from 'gatsby';

import PageBase from '../pages/PageBase';
import AboutFooter from '../components/AboutFooter';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    imgPath:
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    imgPath:
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  markdownBody: {
    padding: '2rem',
    fontSize: '16px',
    maxWidth: '785px',
    color: theme.palette.text.primary,
  },
  sticky: {
    position: 'sticky',
    top: '20%',
  },
  carousel: {
    paddingTop: '8rem',
    padding: '4rem',
  },
  img: {
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
    margin: 'auto',
  },
  stepper: {
    iconColor: theme.palette.primary.contrastText,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    backgroundColor: theme.palette.secondary.main,
    boxShadow:
      'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
  },
  footerButton: {
    fontSize: '3rem',
    color: theme.palette.text.primary,
  },
}));

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <PageBase title={frontmatter.title}>
      <Grid container className={classes.root}>
        <Grid container>
          <Grid item xs={12} md={6} className={classes.carousel}>
            <div className={classes.sticky}>
              <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
              >
                {tutorialSteps.map((step, index) => (
                  <div key={step.label}>
                    {Math.abs(activeStep - index) <= 2 ? (
                      <img className={classes.img} src={step.imgPath} alt={step.label} />
                    ) : null}
                  </div>
                ))}
              </AutoPlaySwipeableViews>
              <MobileStepper
                steps={maxSteps}
                position="static"
                variant="dots"
                className={classes.footer}
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="large"
                    className={classes.footerButton}
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowLeft fontSize="large" />
                    ) : (
                      <KeyboardArrowRight fontSize="large" />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="large"
                    className={classes.footerButton}
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight fontSize="large" />
                    ) : (
                      <KeyboardArrowLeft fontSize="large" />
                    )}
                  </Button>
                }
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.markdownBody}>
              <h1>{frontmatter.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </Grid>
        </Grid>
        <AboutFooter />
      </Grid>
    </PageBase>
  );
}

Template.propTypes = {
  data: PropTypes.string,
  markdownRemark: PropTypes.string,
  frontmatter: PropTypes.string,
  html: PropTypes.string,
  title: PropTypes.string,
};

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        slug
        title
      }
    }
  }
`;
