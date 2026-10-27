// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import InstallPilot from './InstallPilot';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('uses the browser install event and waits for installation confirmation',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:false}));render(<InstallPilot />);
 expect(screen.queryByText('Install Saarthi app')).toBeNull();
 const event=new Event('beforeinstallprompt',{cancelable:true});const prompt=vi.fn(async()=>{});
 Object.assign(event,{prompt,userChoice:Promise.resolve({outcome:'accepted'})});fireEvent(window,event);
 fireEvent.click(screen.getByText('Install Saarthi app'));
 await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('browser will confirm'));
 expect(prompt).toHaveBeenCalledOnce();expect(event.defaultPrevented).toBe(true);
 fireEvent(window,new Event('appinstalled'));expect(screen.queryByLabelText('Install pilot app')).toBeNull();
});
it('keeps the website usable when installation is dismissed',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:false}));render(<InstallPilot />);
 const event=new Event('beforeinstallprompt');Object.assign(event,{prompt:async()=>{},userChoice:Promise.resolve({outcome:'dismissed'})});fireEvent(window,event);fireEvent.click(screen.getByText('Install Saarthi app'));
 await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('dismissed'));
 expect(screen.getByText('Install on your device')).toBeTruthy();
});
