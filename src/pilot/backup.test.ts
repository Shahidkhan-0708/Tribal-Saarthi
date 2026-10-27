import {expect,it} from 'vitest';
import {backupHash,backupKey,openBackup,sealBackup} from '../../supabase/functions/_shared/backup';
const bytes=new TextEncoder().encode('Private database and document bytes');
it('encrypts recoverable private bytes with a fresh nonce and binds the object path',async()=>{
 const key=await backupKey('12'.repeat(32)),a=await sealBackup(bytes,key,'project/backup/database.bin'),b=await sealBackup(bytes,key,'project/backup/database.bin');
 expect(a).not.toEqual(b);expect(Array.from(await openBackup(a,key,'project/backup/database.bin'))).toEqual(Array.from(bytes));
 await expect(openBackup(a,key,'project/another-object')).rejects.toThrow();
});
it('rejects a wrong key, corrupted ciphertext and unsupported envelopes',async()=>{
 const key=await backupKey('12'.repeat(32)),wrong=await backupKey('34'.repeat(32)),encrypted=await sealBackup(bytes,key,'context');
 await expect(openBackup(encrypted,wrong,'context')).rejects.toThrow();
 encrypted[encrypted.length-1]^=1;await expect(openBackup(encrypted,key,'context')).rejects.toThrow();
 await expect(openBackup(new Uint8Array(30),key,'context')).rejects.toThrow('Unsupported');
});
it('rejects weak/malformed keys and uses SHA-256 integrity checks',async()=>{
 await expect(backupKey('short')).rejects.toThrow();await expect(backupKey('zz'.repeat(32))).rejects.toThrow();
 expect(await backupHash(new TextEncoder().encode('abc'))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
