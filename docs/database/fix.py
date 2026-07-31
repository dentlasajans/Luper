import json

file_path = r'C:\Luper\docs\database\security.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

network_ids = [
    'disable_smbv1', 
    'rdp_nla_require', 
    'phase2_security_tweak_2', 
    'phase2_security_tweak_8', 
    'phase2_security_tweak_10', 
    'phase2_security_tweak_16'
]

for item in data:
    impacts = item.get('impacts', {})
    
    # Ensure input, power, heat, etc. are none
    for key in impacts:
        if key not in ['performance', 'latency']:
            impacts[key]['level'] = 'none'
            
    # Input always none
    if 'input' not in impacts:
        impacts['input'] = {'level': 'none', 'description': ''}
    impacts['input']['level'] = 'none'
    
    # Latency only for network_ids
    if item['id'] not in network_ids:
        if 'latency' in impacts:
            impacts['latency']['level'] = 'none'

    # Performance keep as is (since my previous script didn't touch it)
    item['impacts'] = impacts

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
