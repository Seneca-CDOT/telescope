import { render, cleanup } from '@testing-library/react';
import AboutFooter from './AboutFooter';

afterEach(cleanup);

jest.mock(
  './GitHubContributorCard',
  () =>
    function MockGitHubCard() {
      return <div>GitHubContributorCard</div>;
    }
);

it('renders correctly', () => {
  const { asFragment } = render(<AboutFooter />);
  expect(asFragment()).toMatchSnapshot();
});
