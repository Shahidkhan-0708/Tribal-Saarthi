
import os, sys
import xml.etree.ElementTree as ET

mockups_dir = os.path.join(os.getcwd(), 'docs', 'ui-mockups')
errors = 0
checked = 0

for root, dirs, files in os.walk(mockups_dir):
    for f in files:
        if f.endswith('.svg'):
            checked += 1
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, mockups_dir)
            try:
                tree = ET.parse(full_path)
                root_tag = tree.getroot().tag
                if not root_tag.endswith('svg'):
                    raise ValueError(f"Root tag is not svg: {root_tag}")
            except Exception as e:
                print(f"❌ FAIL: {rel_path}: {e}")
                errors += 1

print(f"\nVerified {checked} SVG files across docs/ui-mockups/")
if errors > 0:
    print(f"[FAIL] Total XML Errors: {errors}")
    sys.exit(1)
else:
    print("[PASS] 100% Zero XML Errors! All files are strictly valid XML.")
