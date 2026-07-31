import { render, screen } from '@testing-library/react';
import App from './App';

describe('app routing', () => {
  it('renders the service center dashboard for the service center route', () => {
    window.history.pushState({}, '', '/servicecenter/dashboard');

    render(<App />);

    expect(screen.getByText(/Service Dashboard/i)).toBeInTheDocument();
  });
});
