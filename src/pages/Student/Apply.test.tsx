// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Apply } from './Apply';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { dbRead, dbWrite } from '@/lib/db';

beforeEach(()=>{ localStorage.clear(); useData.getState().resetDemo(); useSession.getState().login('usr_asha'); });
afterEach(cleanup);
it('saves only a local draft before final submission',()=>{
  const scheme=useData.getState().schemes[0];
  const count=useData.getState().applications.length;
  render(<MemoryRouter initialEntries={[`/student/application/new?scheme=${scheme.id}`]}><Apply/></MemoryRouter>);
  fireEvent.click(screen.getByRole('button',{name:'Save draft'}));
  expect(dbRead('application_drafts_stu_asha',{})).toEqual({[scheme.id]:{}});
  expect(useData.getState().applications).toHaveLength(count);
});
it('rejects a saved draft containing another student’s documents',()=>{
  const data=useData.getState(), scheme=data.schemes[0];
  const foreign=data.documents.find(d=>d.studentId!=='stu_asha')!;
  dbWrite('application_drafts_stu_asha',{[scheme.id]:Object.fromEntries(scheme.requiredDocs.map(t=>[t,foreign.id]))});
  render(<MemoryRouter initialEntries={[`/student/application/new?scheme=${scheme.id}&step=3`]}><Apply/></MemoryRouter>);
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button',{name:'Submit application'}));
  expect(screen.getByRole('status').textContent).toContain('Choose a document for each requirement');
  expect(useData.getState().applications).toHaveLength(data.applications.length);
});
it('submits the selected owned document versions after all three steps',()=>{
  const data=useData.getState(), docs=data.documents.filter(d=>d.studentId==='stu_asha');
  const scheme=data.schemes.find(s=>s.requiredDocs.every(type=>docs.some(d=>d.type===type)))!;
  expect(scheme).toBeTruthy();
  useData.setState({applications:[]});
  render(<MemoryRouter initialEntries={[`/student/application/new?scheme=${scheme.id}`]}><Apply/></MemoryRouter>);
  fireEvent.click(screen.getByRole('button',{name:'Continue to documents'}));
  const selected=scheme.requiredDocs.map(type=>docs.find(d=>d.type===type)!.id);
  screen.getAllByRole('combobox').forEach((select,index)=>fireEvent.change(select,{target:{value:selected[index]}}));
  fireEvent.click(screen.getByRole('button',{name:'Check your answers'}));
  fireEvent.click(screen.getByRole('button',{name:'Submit application'}));
  expect(useData.getState().applications).toHaveLength(0);
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button',{name:'Submit application'}));
  expect(useData.getState().applications).toHaveLength(1);
  expect(useData.getState().applications[0].documentIds).toEqual(selected);
});
