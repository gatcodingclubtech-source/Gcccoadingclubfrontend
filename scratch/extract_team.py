import json
import re

with open(r'd:\gcc stuff\Gcccoadingclubfrontend\scratch\team_code_raw.json', 'r', encoding='utf-16') as f:
    content = f.read()

# Find the ReplacementContent using regex since the JSON might be malformed due to truncation in my previous view
# Actually, I'll try to parse it as JSON first.
try:
    data = json.loads(content)
    # The logs might have truncated the JSON itself if it's too large? 
    # No, overview.txt should have the whole line.
    chunks = data['tool_calls'][0]['args']['ReplacementChunks']
    # chunks is a string that looks like a JSON array
    chunks_data = json.loads(chunks)
    code = chunks_data[0]['ReplacementContent']
    
    with open(r'd:\gcc stuff\Gcccoadingclubfrontend\scratch\restored_team.jsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully extracted team code!")
except Exception as e:
    print(f"Error: {e}")
    # Try regex as fallback
    match = re.search(r'"ReplacementContent":"(.*?)"(?=,"StartLine"|,"EndLine"|\])', content)
    if match:
        code = match.group(1).encode().decode('unicode_escape')
        with open(r'd:\gcc stuff\Gcccoadingclubfrontend\scratch\restored_team.jsx', 'w', encoding='utf-8') as f:
            f.write(code)
        print("Successfully extracted team code via regex!")
    else:
        print("Failed to extract team code via regex.")
