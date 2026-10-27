// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { NotificationsAdmin } from './NotificationsAdmin';
import { useData } from '@/store/data';

beforeEach(() => useData.getState().resetDemo());
afterEach(cleanup);
it.each(['all', 'district', 'deficiency'])('previews and sends the exact %s audience', (audience) => {
  render(<NotificationsAdmin />);
  if (audience === 'district') fireEvent.click(screen.getByRole('button', { name: /High-Gap District/ }));
  if (audience === 'deficiency') fireEvent.click(screen.getByRole('button', { name: /Pending Deficiencies/ }));
  const expected = audience === 'all' ? ['stu_asha', 'stu_mohan', 'stu_sunita'] : audience === 'district' ? ['stu_asha'] : ['stu_mohan'];
  expect(screen.getByText(`${expected.length} students`)).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Notice title'), { target: { value: 'Camp' } });
  fireEvent.change(screen.getByLabelText('Message content'), { target: { value: 'Please attend.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send in-app broadcast' }));
  const notices = useData.getState().notifications.filter((n) => n.title === '[DEMO NOTICE] Camp');
  expect(notices.map((n) => n.userId).sort()).toEqual(expected.sort());
  expect(notices.every((n) => n.channel === 'in_app')).toBe(true);
  expect(screen.getByText(`Created ${expected.length} in-app notices. SMS and IVR are not sent in this demo.`)).toBeTruthy();
});
