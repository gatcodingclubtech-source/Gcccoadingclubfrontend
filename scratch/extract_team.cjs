const fs = require('fs');

try {
    let content = fs.readFileSync('d:\\gcc stuff\\Gcccoadingclubfrontend\\scratch\\team_code_raw.json', 'utf16le');
    // Remove BOM
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

    // Look for ReplacementContent and capture everything until the next key or end of object
    // Since it's a JSON string, we need to handle escaped quotes
    const startMarker = '"ReplacementContent":"';
    const startIndex = content.indexOf(startMarker);
    if (startIndex !== -1) {
        let codePart = content.slice(startIndex + startMarker.length);
        // Find the end of the string. It ends with a " followed by , or } or ]
        // But the string itself can contain escaped quotes \"
        let endIndex = -1;
        for (let i = 0; i < codePart.length; i++) {
            if (codePart[i] === '"' && codePart[i-1] !== '\\') {
                // Check if it's followed by , or } or ]
                const next = codePart[i+1];
                if (next === ',' || next === '}' || next === ']') {
                    endIndex = i;
                    break;
                }
            }
        }
        
        if (endIndex !== -1) {
            let code = codePart.slice(0, endIndex);
            // Unescape
            code = code.replace(/\\n/g, '\n')
                       .replace(/\\r/g, '\r')
                       .replace(/\\t/g, '\t')
                       .replace(/\\"/g, '"')
                       .replace(/\\\\/g, '\\');
            
            fs.writeFileSync('d:\\gcc stuff\\Gcccoadingclubfrontend\\scratch\\restored_team.jsx', code);
            console.log("Successfully extracted team code via manual parsing!");
        } else {
            console.log("Could not find end of ReplacementContent");
        }
    } else {
        console.log("Could not find ReplacementContent start");
    }
} catch (e) {
    console.log("Error: " + e.message);
}
