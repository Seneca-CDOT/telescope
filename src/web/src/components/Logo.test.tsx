import TestRenderer from 'react-test-renderer';
import Logo from './Logo';

it('renders correctly', () => {
  const tree = TestRenderer.create(<Logo height={50} width={50} />).toJSON();
  expect(tree).toMatchSnapshot();
});
