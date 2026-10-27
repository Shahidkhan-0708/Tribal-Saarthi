// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Wallet } from './Wallet';
import { ApplicationPage } from './Application';
import { Apply } from './Apply';
import { CoverageGap } from '@/pages/Officer/CoverageGap';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';

beforeEach(() => {
  localStorage.clear();
  useData.getState().resetDemo();
  useSession.getState().login('usr_asha');
});
afterEach(cleanup);

it('Test Case 2.1: Rapid-click stress test instantly disables "Fetch from DigiLocker" button to prevent duplicate concurrent requests', () => {
  render(
    <MemoryRouter initialEntries={['/student/wallet']}>
      <Wallet />
    </MemoryRouter>
  );

  const fetchBtn = screen.getByRole('button', { name: /Fetch from DigiLocker/i }) as HTMLButtonElement;
  expect(fetchBtn.disabled).toBe(false);

  // First click triggers state machine lock
  fireEvent.click(fetchBtn);
  expect(fetchBtn.disabled).toBe(true);
  expect(fetchBtn.textContent).toContain('in-flight');
});

it('Test Case 2.2: Unsupported file MIME-type drop immediately rejects file and safely discards it', async () => {
  render(
    <MemoryRouter initialEntries={['/student/wallet']}>
      <Wallet />
    </MemoryRouter>
  );

  // Open upload modal
  fireEvent.click(screen.getByRole('button', { name: /Upload document/i }));

  // Create an unsupported .txt or .zip file
  const invalidFile = new File(['dummy test content'], 'certificate_hacked.txt', { type: 'text/plain' });
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  expect(fileInput).toBeTruthy();

  fireEvent.change(fileInput, { target: { files: [invalidFile] } });

  // Verify immediate rejection alert
  await waitFor(() => {
    const alerts = screen.getAllByRole('alert');
    const fileAlert = alerts.find((a) => a.textContent?.includes('Unsupported file format'));
    expect(fileAlert).toBeTruthy();
    expect(fileAlert?.textContent).toContain('certificate_hacked.txt');
    expect(fileAlert?.textContent).toContain('application/pdf, image/png, and image/jpeg');
    expect(fileAlert?.textContent).toContain('safely discarded');
  });
});

it('Matrix Item 2: Fetching missing or deleted document ID (404) handles fallback notice gracefully without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/student/wallet']}>
      <Wallet />
    </MemoryRouter>
  );

  const test404Btn = screen.getByRole('button', { name: /Simulate 404 Missing Document Pull/i });
  fireEvent.click(test404Btn);

  const alertBox = screen.getByRole('alert');
  expect(alertBox.textContent).toContain('DigiLocker Error 404');
  expect(alertBox.textContent).toContain('doc_404_deleted');
  expect(alertBox.textContent).toContain('Safely handled with fallback notice');
});

it('Test Case 3.1: Live infrastructure sabotage on e-District turns progress stepper to amber warning without crash', () => {
  render(
    <MemoryRouter initialEntries={['/student/application']}>
      <ApplicationPage />
    </MemoryRouter>
  );

  // Trigger mid-flight sabotage on e-District API
  const sabotageBtn = screen.getByRole('button', { name: /Sabotage e-District API/i });
  fireEvent.click(sabotageBtn);

  // Progress stepper must gracefully reflect outage as amber warning
  expect(useData.getState().sourceHealth.income).toBe(false);
  const outageAlert = screen.getByRole('alert');
  expect(outageAlert.textContent).toContain('Live Infrastructure Outage Gracefully Handled');
  expect(outageAlert.textContent).toMatch(/State e-District income (source|API) unreachable/i);
  expect(outageAlert.textContent).toContain('Resilience Status: Zero white-screen crash');
});

it('Test Case 3.2: Eligibility Discrepancy Gate flags eligible: false and renders explanation banner when income exceeds limit', () => {
  const data = useData.getState();
  // Set student income to ₹5,00,000 (exceeding PMS ₹2,50,000 cap)
  data.updateStudentIncome('stu_asha', 500000);

  render(
    <MemoryRouter initialEntries={['/student/application/new?scheme=pms_st&step=3']}>
      <Apply />
    </MemoryRouter>
  );

  // Must render prominent NSP Discrepancy Gate explanation banner
  const banner = screen.getByRole('alert');
  expect(banner.textContent).toContain('NSP Eligibility Discrepancy Gate: Ineligible');
  expect(banner.textContent).toContain('₹5,00,000');
  expect(banner.textContent).toContain('≤ ₹2,50,000 / yr');

  // Verify that final submission button is disabled
  const submitBtn = screen.getByRole('button', { name: /Submit application/i }) as HTMLButtonElement;
  expect(submitBtn.disabled).toBe(true);
});

it('Matrix Item 3: Sanction Engine locks DBT payment when a source down block exists', () => {
  const data = useData.getState();
  const app = data.applications[0];

  // Set application to sanctioned status with an active source_down check
  useData.setState({
    applications: data.applications.map((a) =>
      a.id === app.id
        ? {
            ...a,
            status: 'sanctioned',
            signatureUrl: 'data:image/png;base64,mock',
            sanctionedAmount: 35000,
            disbursedAmount: undefined,
          }
        : a
    ),
    verificationLogs: [
      {
        id: 'vl_outage_check',
        applicationId: app.id,
        source: 'income',
        connector: 'e-District (SIMULATED)',
        state: 'source_down',
        reason: 'e-District outage',
        createdAt: new Date().toISOString(),
      },
    ],
  });

  // Attempt to push DBT
  data.pushDbt(app.id);

  // Status must remain sanctioned because workflow locked the dispatch
  const reloaded = useData.getState().applications.find((a) => a.id === app.id)!;
  expect(reloaded.status).toBe('sanctioned');
  expect(reloaded.disbursedAmount).toBeUndefined();
});

it('Matrix Item 4: Demographic dataset filter handles empty array safely with empty state message instead of chart crash', () => {
  render(
    <MemoryRouter initialEntries={['/officer/coverage']}>
      <CoverageGap />
    </MemoryRouter>
  );

  // Switch to empty dataset mode
  const emptyToggle = screen.getByRole('button', { name: /Simulate Empty Dataset/i });
  fireEvent.click(emptyToggle);

  // Clean empty state message is shown without runtime TypeError
  expect(screen.getByText(/No demographic data matching the filter criteria/i)).toBeTruthy();
  expect(screen.getByText(/No demographic district chart available/i)).toBeTruthy();
});
