// @vitest-environment jsdom
import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { DemoTour } from './DemoTour';
import { useSession } from '@/store/session';

afterEach(cleanup);
const targets: Record<string, string> = { '/student': 'student-profile', '/student/discovery': 'eligibility-audit', '/student/wallet': 'document-wallet', '/officer/testing': 'sabotage-switchboard', '/officer/coverage': 'coverage-gap' };
function Harness() {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  return <><section data-demo={targets[location.pathname]}>Target</section>{open && <DemoTour onClose={() => setOpen(false)} />}</>;
}
it('navigates, changes persona, highlights and scrolls all five targets, then cleans up', () => {
  const scroll = vi.fn();
  HTMLElement.prototype.scrollIntoView = scroll;
  render(<MemoryRouter initialEntries={['/student']}><Harness /></MemoryRouter>);
  for (const [index, target] of Object.values(targets).entries()) {
    expect(document.querySelector('.demo-tour-target')?.getAttribute('data-demo')).toBe(target);
    expect(useSession.getState().user?.role).toBe(index < 3 ? 'student' : 'nodal');
    if (index < 4) fireEvent.click(screen.getByRole('button', { name: 'Next demo beat' }));
  }
  expect(scroll).toHaveBeenCalledTimes(5);
  fireEvent.click(screen.getByRole('button', { name: 'Close demo tour' }));
  expect(document.querySelector('.demo-tour-target')).toBeNull();
});
