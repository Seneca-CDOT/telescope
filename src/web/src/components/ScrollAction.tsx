import { ReactElement, MouseEvent } from 'react';

type ScrollActionProps = {
  children: ReactElement;
};

const ScrollAction = ({ children }: ScrollActionProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const isMobile = window.innerWidth <= 1065;
    const doc = event.currentTarget.ownerDocument || document;
    const selector = '#back-to-top-anchor';
    const anchor = doc.querySelector(selector);
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
