import {useEffect,useState} from 'react';
interface InstallEvent extends Event {prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>}
let pending:InstallEvent|null=null;
export default function InstallPilot(){
 const [prompt,setPrompt]=useState<InstallEvent|null>(pending),[installed,setInstalled]=useState(matchMedia('(display-mode: standalone)').matches),[message,setMessage]=useState('');
 useEffect(()=>{
  const ready=(event:Event)=>{event.preventDefault();pending=event as InstallEvent;setPrompt(pending);};
  const done=()=>{setInstalled(true);pending=null;setPrompt(null);};
  window.addEventListener('beforeinstallprompt',ready);window.addEventListener('appinstalled',done);
  return()=>{window.removeEventListener('beforeinstallprompt',ready);window.removeEventListener('appinstalled',done);};
 },[]);
 if(installed)return null;
 return <aside className="pilot-install" aria-label="Install pilot app">{prompt ? <button onClick={()=>void (async()=>{try{await prompt.prompt();const choice=await prompt.userChoice;setMessage(choice.outcome==='accepted'?'Installation requested. Your browser will confirm completion.':'Installation dismissed; you can keep using the website.');}catch{setMessage('Use your browser menu to install the app.');}finally{pending=null;setPrompt(null);}})()}>Install Saarthi app</button> : <details><summary>Install on your device</summary><p>Open your browser menu and choose Install app or Add to Home Screen. On iPhone/iPad, use Safari Share, then Add to Home Screen. Availability depends on your browser.</p><p>Only drafts, uploads, grievances and notes work offline. Submission, decisions and payments require a connection. Notifications appear in-app after refresh; push is not enabled.</p></details>}<p role="status">{message}</p></aside>;
}
