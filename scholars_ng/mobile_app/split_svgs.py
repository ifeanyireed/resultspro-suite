import xml.etree.ElementTree as ET
import re
import os
import sys

def process_svg(filename, base_name):
    # Register namespaces
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    
    tree = ET.parse(filename)
    root = tree.getroot()
    
    # Remove namespace from tag for easy finding, or use dict
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    
    width_str = root.attrib.get('width', '1000').replace('px', '')
    height_str = root.attrib.get('height', '1000').replace('px', '')
    width = float(width_str)
    height = float(height_str)
    
    quadrants = [[], [], [], []]
    
    bg_path_found = False
    
    for path in root.findall('.//svg:path', ns):
        d = path.attrib.get('d', '')
        transform = path.attrib.get('transform', '')
        
        # Check if it's the background path
        if not bg_path_found and path.attrib.get('fill') == '#FEFEFE':
            # Background usually starts at 0,0 and spans width/height
            if 'C' in d and str(int(width)) in d and str(int(height)) in d:
                bg_path_found = True
                continue
                
        dx, dy = 0.0, 0.0
        m = re.search(r'translate\(([^,]+),([^)]+)\)', transform)
        if m:
            dx = float(m.group(1))
            dy = float(m.group(2))
            
        numbers = [float(x) for x in re.findall(r'-?\d+\.?\d*', d)]
        if not numbers:
            continue
            
        xs = numbers[0::2]
        ys = numbers[1::2]
        
        min_x, max_x = min(xs), max(xs)
        min_y, max_y = min(ys), max(ys)
        
        cx = dx + (min_x + max_x) / 2
        cy = dy + (min_y + max_y) / 2
        
        if cx < width / 2 and cy < height / 2:
            q = 0 # Top Left
        elif cx >= width / 2 and cy < height / 2:
            q = 1 # Top Right
        elif cx < width / 2 and cy >= height / 2:
            q = 2 # Bottom Left
        else:
            q = 3 # Bottom Right
            
        quadrants[q].append(path)
        
    for i, paths in enumerate(quadrants):
        if not paths:
            continue
        
        # Create a new SVG
        new_root = ET.Element('svg', {
            'version': '1.1',
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': str(width / 2),
            'height': str(height / 2),
            'viewBox': f"{0 if i%2==0 else width/2} {0 if i<2 else height/2} {width/2} {height/2}"
        })
        
        for path in paths:
            new_root.append(path)
            
        out_filename = f"{base_name}_{i+1}.svg"
        ET.ElementTree(new_root).write(out_filename, encoding='UTF-8', xml_declaration=True)
        print(f"Created {out_filename} with {len(paths)} paths.")

for f in ['monsters1.svg', 'monsters2.svg', 'monsters3.svg']:
    if os.path.exists(f):
        print(f"Processing {f}...")
        process_svg(f, f.replace('.svg', ''))
        
