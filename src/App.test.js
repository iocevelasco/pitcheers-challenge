import React from 'react';
import '@testing-library/jest-dom';
import {
  render,
  waitForElement,
  fireEvent,
  screen,
} from '@testing-library/react'
import App from './App';

test('render tenants list', async () => {
  render(<App />);

  expect(screen.getByText('Loading...')).toBeTruthy()
  await waitForElement(() => {
    expect(screen.getAllByTestId('tenant-row'))
  }
    , { timeout: 4000 })
});
test('Should show form after click button', async () => {
  render(<App />);
  fireEvent.click(screen.getByText('Add Tenant'))
  expect(screen.getByTestId('form'))
});

test('Should filter by tabs', async () => {
  render(<App />);
  await waitForElement(() => {
    fireEvent.click(screen.getByTestId('tab-0'))
    expect(screen.getByTestId('tenant-row'))
  }
    , { timeout: 4000 })
}); 