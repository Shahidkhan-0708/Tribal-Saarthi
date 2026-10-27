import fs from 'node:fs';

const appJs = fs.readFileSync('frontend/assets/app.js', 'utf8');
const match = appJs.match(/var ICONS = \{([\s\S]*?)\n  \};/);
if (!match) throw new Error('Could not find ICONS in app.js');

const iconsRaw = match[1];
const iconLines = iconsRaw.split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .map(line => {
    const parts = line.match(/^(\w+):\s*'([\s\S]*?)',?$/);
    if (!parts) return null;
    return `  '${parts[1]}': '${parts[2]}',`;
  })
  .filter(Boolean)
  .join('\n');

const tsCode = `import React from 'react';

export const ICONS: Record<string, string> = {
${iconLines}
};

export type IconName = keyof typeof ICONS | 'bookOpen' | string;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'i', size, style, ...props }) => {
  const pathHtml = ICONS[name] || ICONS.help;
  const customStyle: React.CSSProperties = {
    ...style,
    ...(size ? { width: size, height: size } : {}),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={customStyle}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: pathHtml }}
      {...props}
    />
  );
};
`;

fs.writeFileSync('src/components/common/Icon.tsx', tsCode, 'utf8');
console.log('Successfully generated src/components/common/Icon.tsx');
