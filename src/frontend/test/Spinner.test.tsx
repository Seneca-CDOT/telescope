import { render, screen } from '@testing-library/react';
import Spinner from '../src/components/Spinner/Spinner';

describe('Tests Spinner component', () => {
  beforeEach(() => {
    render(<Spinner />);
  });
  test('Renders without errors', async () => {
    const spinner = await screen.findAllByTestId('spinner-wrapper');
    expect(spinner.length).toBe(1);
  });
  test('Renders CircularProgress component', async () => {
    const circularProcess = await screen.findAllByTestId('circular-process');
    expect(circularProcess.length).toBe(1);
  });
});
