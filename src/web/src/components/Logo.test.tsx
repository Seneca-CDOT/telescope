import { render, cleanup } from '@testing-library/react';
import Logo from './Logo';

afterEach(cleanup);

it('renders correctly', () => {
  const { asFragment } = render(<Logo height={50} width={50} />);
  expect(asFragment()).toMatchSnapshot();
});
