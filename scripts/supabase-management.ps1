if (-not ('TaskSupabaseCredential' -as [type])) {
  Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class TaskSupabaseCredential {
  [StructLayout(LayoutKind.Sequential)] struct Credential {
    public uint Flags, Type;
    public IntPtr TargetName, Comment;
    public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public uint CredentialBlobSize;
    public IntPtr CredentialBlob;
    public uint Persist, AttributeCount;
    public IntPtr Attributes, TargetAlias, UserName;
  }
  [DllImport("advapi32.dll", EntryPoint="CredReadW", CharSet=CharSet.Unicode, SetLastError=true)]
  static extern bool Read(string target, uint type, uint flags, out IntPtr result);
  [DllImport("advapi32.dll")] static extern void CredFree(IntPtr value);
  public static string Load() {
    foreach (var target in new [] {"Supabase CLI:supabase", "Supabase CLI:access-token"}) {
      IntPtr ptr;
      if (!Read(target, 1, 0, out ptr)) continue;
      try {
        var cred = (Credential)Marshal.PtrToStructure(ptr, typeof(Credential));
        var bytes = new byte[cred.CredentialBlobSize];
        Marshal.Copy(cred.CredentialBlob, bytes, 0, bytes.Length);
        return Encoding.UTF8.GetString(bytes);
      } finally { CredFree(ptr); }
    }
    throw new Exception("Saved Supabase CLI credential unavailable");
  }
}
'@
}
function Invoke-TaskSupabaseApi {
  param([string]$Method, [string]$Path, $Body)
  if ($Path -notmatch '^/v1/(projects|organizations)(/|$)') { throw 'Invalid Management API path' }
  $taskApiToken = [TaskSupabaseCredential]::Load()
  try {
    $taskApiArgs = @{Uri=('https://api.supabase.com' + $Path); Method=$Method; Headers=@{Authorization=('Bearer ' + $taskApiToken)}; ContentType='application/json'; ErrorAction='Stop'; TimeoutSec=30}
    if ($Body -is [hashtable] -and $Body.ContainsKey('query')) {
      # Get-Content adds provider metadata; send a plain SQL string instead.
      $Body['query'] = ([string]$Body['query']).TrimEnd()
    }
    if ($null -ne $Body) { $taskApiArgs.Body = ($Body | ConvertTo-Json -Depth 20 -Compress) }
    Invoke-RestMethod @taskApiArgs
  } finally { $taskApiToken = $null }
}
