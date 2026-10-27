export function csv(columns: string[], rows: unknown[][]): string {
  const cell = (value: unknown) => {
    let text = value == null ? '' : String(value);
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g,'""')}"`;
  };
  return [columns,...rows].map(row => row.map(cell).join(',')).join('\r\n');
}
export function download(name: string, text: string, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text],{type:`${type};charset=utf-8`}));
  const link = document.createElement('a'); link.href=url;link.download=name;link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}
