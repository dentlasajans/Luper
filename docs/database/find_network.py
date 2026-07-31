import json

file_path = r'C:\Luper\docs\database\security.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

network_related = []
for item in data:
    desc = item.get('description', '').lower()
    title = item.get('title', '').lower()
    tags = [t.lower() for t in item.get('tags', [])]
    
    # We want to identify if it's REALLY network latency.
    # Look for: "ping", "ağ", "network", "internet", "paket", "gecikme" (if combined with network context)
    is_network = any(word in desc for word in ['ağ ', ' ağ', 'ping', 'network', 'paket', 'smb', 'rdp', 'tcp', 'udp', 'wi-fi', 'ethernet']) or \
                 any(word in title for word in ['ağ', 'ping', 'network', 'smb', 'rdp']) or \
                 any(word in tags for word in ['network', 'smb', 'rdp'])
                 
    if is_network:
        network_related.append(f"{item['id']} - {item['title']}")

with open('output.txt', 'w', encoding='utf-8') as f:
    for n in network_related:
        f.write(n + '\n')
