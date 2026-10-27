import { describe, expect, it } from 'vitest';
import { answerPilotQuestion } from './PilotAssistant';
import type { PilotSnapshot } from './types';

const snapshot = { account: {id:'student'}, applications:[{id:'app',data:{studentId:'student',schemeId:'s',status:'deficiency'}}],documents:[],schemes:[],deficiencies:[{id:'d1',data:{applicationId:'app',status:'open',documentType:'income_certificate',reason:'Unreadable',deadline:'2026-12-01'}},{id:'d2',data:{applicationId:'app',status:'corrected',documentType:'marksheet',reason:'Wrong date',deadline:'2026-12-02'}}],verifications:[{id:'v1',data:{applicationId:'app',source:'income',state:'source_down',reason:'Registry unavailable',createdAt:'2026-10-12'}}],payments:[{id:'p1',data:{applicationId:'app',amount:100,status:'failed',reason:'SIMULATED outage'}}] } as unknown as PilotSnapshot;
describe('pilot Saarthi context',()=>{
  it('explains every open correction and pending source without claiming rejection or verification',()=>{
    const answer=answerPilotQuestion(snapshot,'why pending?','en');
    expect(answer.text).toContain('Unreadable'); expect(answer.text).toContain('officer review is still required'); expect(answer.text).toContain('Registry unavailable'); expect(answer.references).toEqual(['app','d1','d2','v1']);
  });
  it('labels payments simulated and provides Hindi next steps',()=>{
    expect(answerPilotQuestion(snapshot,'payment','en').text).toContain('SIMULATED payment');
    expect(answerPilotQuestion(snapshot,'सुधार','hi').text).toContain('अधिकारी की जाँच बाकी');
  });
  it('does not include another student’s applications or payments',()=>{
    const other={...snapshot,applications:[...snapshot.applications,{id:'other',version:1,data:{studentId:'someone',schemeId:'private',academicYear:'2026-27',documentIds:[],status:'rejected' as const}}]};
    expect(answerPilotQuestion(other,'status','en').references).not.toContain('other');
  });
});
