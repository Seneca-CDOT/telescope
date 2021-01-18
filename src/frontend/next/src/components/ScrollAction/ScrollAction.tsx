import { ReactChildren, MouseEvent } from 'react';

type ScrollActionProps = {
  children: ReactChildren;
};

const ScrollAction = ({ children }: ScrollActionProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const mobile = window.innerWidth <= 1065;
    const anchor = mobile
      ? (event.currentTarget.ownerDocument || document).querySelector('#back-to-top-anchor-mobile')
      : (event.currentTarget.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div onClick={handleClick} role="presentation">
      {children}
    </div>
  );
};

export default ScrollAction;
