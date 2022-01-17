import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

// Make sure we get a consistent date regardless of when the test is run
const mockDate = new Date('2022-01-03T18:30:11.041Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
Date.now = jest.fn(() => mockDate.getTime());

// Auto-hoisting of jest.mock calls is currently not working https://github.com/vercel/next.js/discussions/31152
// So we have to import AboutFooter after jest.mock
jest.mock(
  './GitHubContributorCard',
  () =>
    function MockGitHubCard() {
      return <div>GitHubContributorCard</div>;
    }
);

it('renders correctly', () => {
  // eslint-disable-next-line global-require
  const AboutFooter = require('./AboutFooter').default;
  const { asFragment } = render(<AboutFooter />);
  expect(asFragment()).toMatchSnapshot();
});
