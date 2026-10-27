// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,beforeEach,expect,it} from 'vitest';
import {GrievancePage} from './Grievance';
import {useData} from '@/store/data';
import {useSession} from '@/store/session';
import {dbRead} from '@/lib/db';
import type {Grievance} from '@/types';

beforeEach(()=>{useData.getState().resetDemo();useData.setState({grievances:[]});useData.getState().createGrievance('stu_asha','Document','Asha ticket','Asha details');useData.getState().createGrievance('stu_sunita','Payment','Sunita ticket','Sunita details');});
afterEach(cleanup);
it('shows the whole demo queue to officers and persists resolution',()=>{
 useSession.getState().login('usr_verma');render(<GrievancePage />);
 expect(screen.getByText('Asha ticket')).toBeTruthy();expect(screen.getByText('Sunita ticket')).toBeTruthy();
 expect(screen.queryByText('Submit grievance & get reference ID')).toBeNull();
 fireEvent.click(screen.getAllByText('Mark resolved')[0]);
 expect(dbRead<Grievance[]>('grievances',[]).filter(g=>g.status==='resolved')).toHaveLength(1);
 expect(screen.getAllByText('Mark resolved')).toHaveLength(1);
});
it('keeps students on their own grievances without officer controls',()=>{
 useSession.getState().login('usr_asha');render(<GrievancePage />);
 expect(screen.getByText('Asha ticket')).toBeTruthy();expect(screen.queryByText('Sunita ticket')).toBeNull();expect(screen.queryByText('Mark resolved')).toBeNull();
});
