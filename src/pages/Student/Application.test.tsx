// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { ApplicationPage } from './Application';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';

beforeEach(() => { useData.getState().resetDemo(); useSession.getState().login('usr_asha'); });
afterEach(cleanup);
it('prints an honestly labelled demo receipt without a fabricated hash or QR', () => {
  render(<ApplicationPage />);
  fireEvent.click(screen.getAllByText('View Acknowledgement Slip')[0]);
  expect(screen.getByText('Local demo receipt · no digital seal or public verification')).toBeTruthy();
  expect(screen.queryByText(/sha256:|Cryptographically Sealed|Tamper-Evident Ledger/)).toBeNull();
  expect(screen.getByText('Print / Save PDF Slip').closest('button')).toBeTruthy();
});
