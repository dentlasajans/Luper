import json

file_path = r'C:\Luper\docs\database\security.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    id = item['id']
    if id in ['phase2_security_tweak_4', 'phase2_security_tweak_6', 'phase2_security_tweak_8', 'phase2_security_tweak_10', 'phase2_security_tweak_12', 'phase2_security_tweak_13', 'phase2_security_tweak_16', 'phase2_security_tweak_17', 'phase2_security_tweak_18']:
        print(f"{id}: {item['title']}")
