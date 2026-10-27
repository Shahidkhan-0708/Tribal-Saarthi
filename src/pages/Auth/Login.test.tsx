// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login';
import { useSession } from '@/store/session';
import { AadhaarOtpModal } from '@/components/common/AadhaarOtpModal';

beforeEach(() => {
  localStorage.clear();
  useSession.getState().logout();
});
afterEach(cleanup);

it('Test Case 1.1: blocks submission and shows red error state citing format rule ^\\d{12}$ on invalid Aadhaar length/format', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const input = screen.getByLabelText(/12-digit Aadhaar/i);
  const submitBtn = screen.getByRole('button', { name: /Get Aadhaar OTP/i }) as HTMLButtonElement;

  // Type 5 digits
  fireEvent.change(input, { target: { value: '12345' } });
  const alertEl = screen.getByRole('alert');
  expect(alertEl.textContent).toContain('^\\d{12}$');
  expect(submitBtn.disabled).toBe(true);

  // Type text characters
  fireEvent.change(input, { target: { value: 'ABCD1234EFGH' } });
  expect(screen.getByRole('alert').textContent).toMatch(/numeric digits only/i);
  expect(submitBtn.disabled).toBe(true);

  // Type valid 12-digit number
  fireEvent.change(input, { target: { value: '541288904821' } });
  expect(screen.queryByRole('alert')).toBeNull();
  expect(submitBtn.disabled).toBe(false);
});

it('Test Case 1.2: catches mock UIDAI FAILED response on incorrect OTP (999999), clears boxes and does not authenticate', async () => {
  let successCalled = false;
  render(
    <AadhaarOtpModal
      open={true}
      onClose={() => {}}
      onSuccess={() => {
        successCalled = true;
      }}
      aadhaarLast4="4821"
    />
  );

  const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
  expect(inputs).toHaveLength(6);

  // Enter incorrect 6-digit OTP (999999)
  inputs.forEach((input) => fireEvent.change(input, { target: { value: '9' } }));
  fireEvent.click(screen.getByRole('button', { name: /Verify & Proceed/i }));

  await waitFor(() => {
    expect(screen.getByRole('alert').textContent).toContain('Wrong OTP. Please retry');
  });

  // Verify that all 6 boxes were cleared and user was NOT authenticated
  inputs.forEach((input) => {
    expect(input.value).toBe('');
  });
  expect(successCalled).toBe(false);

  // Now enter authorized demo OTP 123456
  const digits = ['1', '2', '3', '4', '5', '6'];
  inputs.forEach((input, i) => fireEvent.change(input, { target: { value: digits[i] } }));
  fireEvent.click(screen.getByRole('button', { name: /Verify & Proceed/i }));

  await waitFor(() => {
    expect(successCalled).toBe(true);
  });
});
