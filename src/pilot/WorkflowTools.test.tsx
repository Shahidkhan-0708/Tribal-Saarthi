// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {AccountTools,OperationsTools,InstitutionTools,OfficerNoteForm,SourceHealthTools,type Work} from './WorkflowTools';
import DataPages from './DataPages';
import type {PilotSnapshot} from './types';
import * as api from './api';

vi.mock('./api',()=>({listAccounts:vi.fn(),manageAccount:vi.fn(),selectPage:vi.fn(),invalidateCatalog:vi.fn(),operationsStatus:vi.fn(),sourceHealth:vi.fn()}));
const run:Work=async task=>{await task();};
const application={id:'app-1',version:7,data:{studentId:'student-1',schemeId:'scheme-1',academicYear:'2026-27',status:'sanctioned' as const,documentIds:[]}};
const institution={id:'college-1',version:3,data:{name:'Test college',state:'State',district:'District',active:true,inSchemeBasket:true}};
const snapshot={account:{id:'admin-1',role:'admin'},institutions:[institution],configurationHistory:[{id:'history-1',version:1,data:{kind:'institutions',entityId:institution.id,configurationVersion:2,createdAt:'2026-10-18',config:{name:'Previous college'}}}],applications:[application]} as unknown as PilotSnapshot;
afterEach(()=>{cleanup();vi.clearAllMocks();});

it('shows administrator job failures and backup recovery metadata',async()=>{
 vi.mocked(api.operationsStatus).mockResolvedValue([{id:'job-email',kind:'emails',status:'succeeded',startedAt:new Date().toISOString(),detail:{code:'email_provider_not_configured',processed:0}},{id:'job-1',kind:'backup',status:'failed',startedAt:new Date().toISOString(),detail:{code:'backup_upload_failed'}},{id:'job-2',kind:'backup',status:'succeeded',startedAt:new Date().toISOString(),detail:{code:'backup_verified',tables:52,objects:15,bytes:1000,backupPrefix:'2026-10-18/reference'}}]);
 render(<OperationsTools run={run} disabled={false} />);fireEvent.click(screen.getByText('Refresh operation status'));
 await screen.findByText(/backup_upload_failed/);expect(screen.getByText(/email processor: waiting for provider credentials/)).toBeTruthy();expect(screen.getByText('52 tables, 15 private objects, 1000 bytes encrypted.')).toBeTruthy();expect(screen.getByText('Recovery reference: 2026-10-18/reference')).toBeTruthy();
});

it('records a simulated connector outage through the server command',async()=>{
 const command=vi.fn(async()=>{});
 vi.mocked(api.sourceHealth).mockResolvedValue({identity:true});
 render(<SourceHealthTools run={run} command={command} disabled={false} />);
 await screen.findByText('Available');
 fireEvent.change(screen.getByLabelText('Simulated status'),{target:{value:'down'}});
 fireEvent.click(screen.getByText('Save connector status'));
 await waitFor(()=>expect(command).toHaveBeenCalledWith('set_source_health',{source:'identity',up:false}));
});
it('sends notes with the versioned application target online and through the shared offline command',async()=>{
 const command=vi.fn(async()=>{});
 render(<OfficerNoteForm application={application} run={run} command={command} disabled={false} />);
 fireEvent.change(screen.getByLabelText('Internal officer note'),{target:{value:'Review the submitted evidence'}});
 fireEvent.click(screen.getByText('Save note'));
 await waitFor(()=>expect(command).toHaveBeenCalledWith('add_note',{body:'Review the submitted evidence'},application));
});
it('uses reasoned versioned deactivation and displays institution history',async()=>{
 const command=vi.fn(async()=>{});
 render(<InstitutionTools snapshot={snapshot} run={run} command={command} disabled={false} />);
 expect(screen.queryByLabelText('Active institution')).toBeNull();
 expect(screen.getByText(/Previous college/)).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Institution deactivation reason'),{target:{value:'No longer in the pilot cohort'}});
 fireEvent.click(screen.getByText('Deactivate institution'));
 await waitFor(()=>expect(command).toHaveBeenCalledWith('deactivate_institution',{reason:'No longer in the pilot cohort'},institution));
});
it('does not reactivate an inactive institution when only its metadata is saved',async()=>{
 const command=vi.fn(async()=>{}),inactive={...institution,version:4,data:{...institution.data,active:false}};
 render(<InstitutionTools snapshot={{...snapshot,institutions:[inactive]}} run={run} command={command} disabled={false} />);
 expect(screen.queryByText('Deactivate institution')).toBeNull();
 fireEvent.click(screen.getAllByText('Save institution')[0]);
 await waitFor(()=>expect(command).toHaveBeenLastCalledWith('save_institution',expect.objectContaining({active:false}),inactive));
 fireEvent.click(screen.getByLabelText('Reactivate institution'));
 fireEvent.click(screen.getAllByText('Save institution')[0]);
 await waitFor(()=>expect(command).toHaveBeenLastCalledWith('save_institution',expect.objectContaining({active:true}),inactive));
});
it('refreshes the shared snapshot after account changes so privacy reviews use current versions',async()=>{
 const account={id:'student-1',version:5,name:'Test student',email:'student@example.org',role:'student',active:true};
 vi.mocked(api.listAccounts).mockResolvedValue({items:[account],page:0,hasMore:false} as Awaited<ReturnType<typeof api.listAccounts>>);
 const refresh=vi.fn(async()=>{});
 render(<AccountTools snapshot={snapshot} run={run} disabled={false} refresh={refresh} />);
 fireEvent.click(await screen.findByText('Save account access'));
 await waitFor(()=>expect(refresh).toHaveBeenCalledOnce());
 expect(api.manageAccount).toHaveBeenCalledWith('manage_account',expect.objectContaining({active:true}),{id:account.id,version:account.version});
});
it('shows paged related records and loads their parent even when it is outside the current application page',async()=>{
 const refresh=vi.fn(async()=>{}),navigate=vi.fn();
 const notes=[{id:'note-1',version:1,data:{applicationId:'another-app',body:'A note on the next page',createdAt:'2026-10-18'}}];
 render(<DataPages snapshot={{...snapshot,notes:notes as PilotSnapshot['notes'],pages:{applications:{page:0,hasMore:false,search:'',ids:['app-1']},notes:{page:1,hasMore:true,search:'',ids:['note-1']}}}} run={run} refresh={refresh} disabled={false} navigate={navigate} />);
 fireEvent.change(screen.getByLabelText('Record list'),{target:{value:'notes'}});
 expect(screen.getByText('A note on the next page')).toBeTruthy();
 fireEvent.click(screen.getByText('Open related application'));
 await waitFor(()=>expect(navigate).toHaveBeenCalledWith('applications'));
 expect(api.selectPage).toHaveBeenCalledWith('applications',0,'another-app');expect(refresh).toHaveBeenCalledOnce();
});
it('never renders context rows outside the selected page and sends search/pagination to the selected dataset',async()=>{
 const refresh=vi.fn(async()=>{});
 render(<DataPages snapshot={{...snapshot,applications:[application,{...application,id:'context-app'}],pages:{applications:{page:0,hasMore:true,search:'',ids:['app-1']}}}} run={run} refresh={refresh} disabled={false} navigate={vi.fn()} />);
 expect(screen.queryByText('Reference context-app')).toBeNull();
 fireEvent.change(screen.getByLabelText('Search records'),{target:{value:'reference'}});
 fireEvent.click(screen.getByText('Search selected list'));
 await waitFor(()=>expect(api.selectPage).toHaveBeenCalledWith('applications',0,'reference'));
 fireEvent.click(screen.getByText('Next record page'));
 await waitFor(()=>expect(api.selectPage).toHaveBeenCalledWith('applications',1,''));
});
it('hides unsupported family search and preserves family pagination',()=>{
 render(<DataPages snapshot={{...snapshot,account:{...snapshot.account,role:'family'},pages:{applications:{page:0,hasMore:true,search:'',ids:['app-1']}}}} run={run} refresh={vi.fn(async()=>{})} disabled={false} navigate={vi.fn()} />);
 expect(screen.queryByLabelText('Search records')).toBeNull();
 expect(screen.queryByText('Refresh catalogue now')).toBeNull();
 expect((screen.getByText('Next record page') as HTMLButtonElement).disabled).toBe(false);
});
it('renders imported baseline provenance from the selected page',()=>{
 const baselines=[{id:'baseline-1',version:1,data:{state:'State',district:'District',academicYear:'2026-27',population:'pilot enrolled ST students',enrolled:42,sourceUrl:'https://example.org/source',importedAt:'2026-10-18',synthetic:false}}];
 render(<DataPages snapshot={{...snapshot,baselines,pages:{baselines:{page:0,hasMore:false,search:'',ids:['baseline-1']}}}} run={run} refresh={vi.fn(async()=>{})} disabled={false} navigate={vi.fn()} />);
 expect(screen.getByText('enrolled: 42')).toBeTruthy();expect(screen.getByText(/Imported baseline - source: https/)).toBeTruthy();
});
