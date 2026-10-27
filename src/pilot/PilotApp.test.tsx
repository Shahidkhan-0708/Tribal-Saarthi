// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BroadcastForm, DraftForm, operationSummary } from './PilotApp';
import type { PilotSnapshot } from './types';
import type { Student } from '@/types';

const student: Student = { id:'student-1',name:'Student',gender:'F',dob:'2000-01-01',aadhaarLast4:'',tribe:'Baiga',isPVTG:true,category:'ST',familyIncome:50000,fatherName:'Parent',domicileState:'State',domicileDistrict:'District A',homeVillage:'Village',language:'en',courseLevel:'undergrad',course:'BA',institutionId:'institution-1',year:'1',familyViewConsent:false };
const scheme: PilotSnapshot['schemes'][number] = { id:'scheme-1',version:1,data:{ id:'scheme-1',name:'Pilot scholarship',shortName:'Pilot',portal:'NSP',ministry:'Pilot',courseLevels:['undergrad'],amount:'₹1,000',benefits:[],deadline:'2027-01-01',requiredDocs:['marksheet'],rules:[{id:'marks',label:'Marks',field:'marks',param:'50%',op:'min',threshold:50}],notes:'',academicYear:'2026-27',active:true,sanctionAmount:1000 } };
afterEach(cleanup);
describe('pilot application forms', () => {
  it('describes offline drafts with scheme names and omits internal IDs and evidence', () => {
    const summary = operationSummary({id:'private-operation-id',userId:'private-user-id',action:'save_draft',payload:{schemeId:scheme.id,academicYear:'2026-27',documentIds:['private-document-id'],evidence:{marks:72}},createdAt:'2026-10-12',status:'queued'},[scheme]);
    expect(summary).toContain('Pilot scholarship');
    expect(summary).toContain('2026-27');
    expect(summary).not.toContain('private-');
    expect(summary).not.toContain('marks');
    expect(summary).not.toContain('scheme-1');
  });
  it('saves an incomplete draft with declared evidence, without fabricated attachment IDs', () => {
    const save=vi.fn(async () => {});
    render(<DraftForm scheme={scheme} student={student} documents={[]} busy={false} save={save} />);
    expect(screen.getByText('Advisory: requirements need attention')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Declared qualifying marks (%)'),{target:{value:'72'}});
    fireEvent.click(screen.getByText('Save draft'));
    expect(save).toHaveBeenCalledWith({schemeId:'scheme-1',academicYear:'2026-27',documentIds:[],evidence:{marks:72}});
  });
  it('counts the chosen deficiency audience and sends its explicit selector', () => {
    const save=vi.fn(async () => {});
    const snapshot={students:[{id:student.id,version:1,data:student},{id:'student-2',version:1,data:{...student,id:'student-2',domicileDistrict:'District B'}}],applications:[{id:'app-1',version:1,data:{studentId:student.id,schemeId:scheme.id,academicYear:'2026-27',status:'deficiency',documentIds:[]}}],deficiencies:[{id:'def-1',version:1,data:{applicationId:'app-1',status:'open'}}]} as unknown as PilotSnapshot;
    render(<BroadcastForm snapshot={snapshot} busy={false} online save={save} />);
    expect(screen.getByText(/Selected audience: 2 student/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Scoped audience'),{target:{value:'deficiency'}});
    expect(screen.getByText(/Selected audience: 1 student/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Title'),{target:{value:'Reminder'}});
    fireEvent.change(screen.getByLabelText('Message'),{target:{value:'Please correct your document.'}});
    fireEvent.click(screen.getByText('Send in-app broadcast'));
    expect(save).toHaveBeenCalledWith({title:'Reminder',body:'Please correct your document.',audience:'deficiency',district:''});
  });
});
