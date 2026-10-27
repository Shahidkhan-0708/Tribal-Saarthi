// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './index';
import { useSession } from '@/store/session';
import { USERS } from '@/data/coverage';

afterEach(cleanup);
it('switches every seeded persona, role and navigation', () => {
  render(<MemoryRouter initialEntries={['/student']}><Layout><p>Demo</p></Layout></MemoryRouter>);
  expect(screen.queryByText('Live Sync')).toBeNull();
  expect(screen.queryByText('Offline Mode')).toBeNull();
  expect(screen.getByText('Local demo - no offline sync')).toBeTruthy();
  for (const persona of USERS) {
    fireEvent.change(screen.getByLabelText('Demo persona'), { target: { value: persona.id } });
    expect(useSession.getState().user).toEqual(persona);
    expect(screen.getByText(`${persona.role} Account`)).toBeTruthy();
    expect(screen.getAllByText(persona.name).length).toBeGreaterThan(0);
    const navigation = within(screen.getByRole('navigation', {name: persona.role === 'student' ? 'Scholar navigation' : 'Officer navigation'}));
    expect(navigation.getByRole('link', {name: persona.role === 'student' ? 'Help and Saarthi' : 'Decision history'}).getAttribute('href')).toBe(persona.role==='student'?'/student/grievance':'/officer/audit');
    expect(navigation.getByRole('link', {name: persona.role === 'student' ? 'My documents' : 'Coverage gaps'}).getAttribute('href')).toBe(persona.role === 'student' ? '/student/wallet' : '/officer/coverage');
  }
  useSession.getState().login('usr_inst_1');
  expect(useSession.getState().user?.id).toBe('usr_admin');
}, 15000);

it('renders mobile navigation button and opens drawer on small screens', () => {
  useSession.getState().login('usr_asha');
  render(<MemoryRouter initialEntries={['/student']}><Layout><p>Demo</p></Layout></MemoryRouter>);
  const menuButton = screen.getByLabelText('Navigation menu');
  expect(menuButton).toBeTruthy();
  fireEvent.click(menuButton);
  expect(screen.getByLabelText('Close navigation menu')).toBeTruthy();
  // Nav links are accessible inside the opened drawer
  expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  fireEvent.click(screen.getByLabelText('Close navigation menu'));
});
