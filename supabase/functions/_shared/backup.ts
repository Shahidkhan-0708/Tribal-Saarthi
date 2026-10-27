export async function backupKey(encoded:string) {
 if(!/^[0-9a-f]{64}$/.test(encoded))throw new Error('Backup encryption key must contain 32 random bytes');
 return crypto.subtle.importKey('raw',Uint8Array.from(encoded.match(/../g)!,v=>parseInt(v,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);
}
export async function sealBackup(bytes:Uint8Array,key:CryptoKey,context:string) {
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode(context)},key,new Uint8Array(bytes));
 const result=new Uint8Array(13+encrypted.byteLength);result[0]=1;result.set(iv,1);result.set(new Uint8Array(encrypted),13);return result;
}
export async function openBackup(bytes:Uint8Array,key:CryptoKey,context:string) {
 if(bytes.length<29 || bytes[0]!==1)throw new Error('Unsupported backup envelope');
 return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(1,13),additionalData:new TextEncoder().encode(context)},key,bytes.slice(13)));
}
export async function backupHash(bytes:Uint8Array) {return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new Uint8Array(bytes))),n=>n.toString(16).padStart(2,'0')).join('');}
