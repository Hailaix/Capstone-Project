import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom'

test('Smoke for welcome', () => {
  render(<MemoryRouter>
    <App />
  </MemoryRouter>);
  const welcome = screen.getByText("Welcome to Bookly!");
  expect(welcome).toBeInTheDocument();
});
