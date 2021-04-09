import { ReactElement, MouseEvent } from 'react';

type ScrollActionProps = {
  children: ReactElement;
};

const ScrollAction = ({ children }: ScrollActionProps) => {
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const doc = event.currentTarget.ownerDocument || document;
    const selector = '#posts-anchor';
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
