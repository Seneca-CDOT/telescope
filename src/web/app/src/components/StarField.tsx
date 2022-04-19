import { NamedExoticComponent, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { request } from '@octokit/request';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { P5Instance, P5WrapperProps } from 'react-p5-wrapper';

const ReactP5Wrapper = dynamic(
  () => import('react-p5-wrapper').then((mod) => mod.ReactP5Wrapper as any),
  {
    ssr: false,
  }
) as unknown as NamedExoticComponent<P5WrapperProps>;

// The original idea of the process to calculate the position and size of the
// stars is from Daniel Shiffman (http://codingtra.in).
// The original video can be found here: https://youtu.be/17WoOqgXsRM

const P5_WRAPPER_ELEM_ID = 'p5-wrapper';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      width: '70vw',
      [theme.breakpoints.down('xs')]: {
        width: '90vw',
      },
      aspectRatio: '16 / 9',
    },
  };
});

class Star {
  imageGraphic: any;

  p5: P5Instance;

  x: number;

  y: number;

  z: number;

  constructor(profileImage: any, p5: P5Instance) {
    const side = 100;
    const innerCircleRadius = side / 2;

    const starGraphic = p5.createGraphics(side, side);
    starGraphic.image(profileImage, 0, 0, side, side);

    // Inner circle delineates the border of the picture
    starGraphic.noFill();
    starGraphic.strokeWeight(1);
    starGraphic.stroke('black');
    starGraphic.square(0, 0, side, innerCircleRadius);

    // Draw a bigger square that will erase the
    // outside corners
    const strokeWeight = innerCircleRadius * (p5.sqrt(2) - 1) * 2;
    starGraphic.blendMode(starGraphic.REMOVE as typeof starGraphic.ADD);
    starGraphic.stroke(0, 0, 0, 255);
    starGraphic.strokeWeight(strokeWeight);
    starGraphic.square(
      -strokeWeight / 2,
      -strokeWeight / 2,
      side + strokeWeight,
      innerCircleRadius + strokeWeight / 2
    );

    this.imageGraphic = starGraphic;
    this.p5 = p5;
    this.x = p5.random(-p5.width / 2, p5.width / 2);
    this.y = p5.random(-p5.height / 2, p5.height / 2);
    this.z = p5.random(p5.width * 0.1, p5.width * 0.95);
  }

  update(speed: number) {
    const { p5 } = this;

    this.z -= speed;
    if (this.z < 1) {
      this.x = p5.random(-p5.width / 2, p5.width / 2);
      this.y = p5.random(-p5.height / 2, p5.height / 2);
      this.z = p5.random(p5.width * 0.1, p5.width * 0.95);
    }
  }

  draw() {
    const { p5, x, y, z, imageGraphic } = this;

    p5.fill(255);
    p5.noStroke();

    const sx = p5.map(x / z, 0, 1, 0, p5.width);
    const sy = p5.map(y / z, 0, 1, 0, p5.height);

    const r = p5.map(this.z, 0, p5.width, p5.width * 0.09, 0);
    p5.image(imageGraphic, sx, sy, r, r);
  }
}

const sketch = (p5: P5Instance) => {
  const stars: Star[] = [];
  const speed = 3;

  p5.setup = () => {
    const { width, height } = document
      .getElementById(P5_WRAPPER_ELEM_ID)
      ?.getBoundingClientRect() as DOMRect;
    p5.createCanvas(width, height);
  };

  p5.windowResized = () => {
    const { width, height } = document
      .getElementById(P5_WRAPPER_ELEM_ID)
      ?.getBoundingClientRect() as DOMRect;
    p5.resizeCanvas(width, height);
  };

  p5.updateWithProps = (props) => {
    if (props.contributorList) {
      props.contributorList.forEach((urlImage: string) => {
        p5.loadImage(urlImage, (profileImage) => {
          stars.push(new Star(profileImage, p5));
        });
      });
    }
  };

  p5.draw = () => {
    p5.background(0);

    p5.translate(p5.width / 2, p5.height / 2);

    p5.push();
    stars.forEach((star) => {
      star.draw();
      star.update(speed);
    });
    p5.pop();
  };
};

const StarField = () => {
  const [contributorList, setContributorList] = useState(['dummy']);
  const [contributorPage, setContributorPage] = useState(1);
  const classes = useStyles();

  useEffect(() => {
    request('GET /repos/{owner}/{repo}/contributors{?page}', {
      owner: 'Seneca-CDOT',
      repo: 'telescope',
      page: contributorPage,
    })
      .then((res) => {
        const contributorImages = res.data
          .map((contributor: any) => contributor.avatar_url)
          .filter((url: string) => url !== undefined) as string[];

        setContributorList(contributorImages);

        if (contributorImages.length > 0) {
          setContributorPage(contributorPage + 1);
        }

        return null;
      })
      .catch((err) => console.error(err));
  }, [contributorPage]);

  return (
    <div id={P5_WRAPPER_ELEM_ID} className={classes.root}>
      <ReactP5Wrapper sketch={sketch} contributorList={contributorList} />
    </div>
  );
};

export default StarField;
