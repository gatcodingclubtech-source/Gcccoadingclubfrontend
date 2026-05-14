const fs = require('fs');
let content = fs.readFileSync(process.argv[2], 'utf8');

// Remove self-closing tags
content = content.replace(/<[a-zA-Z0-9.]+\b[^>]*\/>/g, (match) => ' '.repeat(match.length));

const matches = content.matchAll(/<([a-zA-Z0-9.]+)\b|<\/([a-zA-Z0-9.]+)\s*>/g);
const stack = [];

for (const m of matches) {
    const tag = m[1] || m[2];
    const isClosing = m[0].startsWith('</');
    const lineNo = content.substring(0, m.index).split('\n').length;

    console.log(`${lineNo}: ${isClosing ? '</' : '<'}${tag}>`);

    if (!isClosing) {
        stack.push({ tag, lineNo });
    } else {
        if (stack.length === 0) {
            console.log(`Error: Found closing tag </${tag}> at line ${lineNo} but stack is empty`);
            continue;
        }
        const last = stack.pop();
        if (last.tag !== tag) {
            console.log(`Error: Mismatched tag. Found </${tag}> at line ${lineNo}, expected </${last.tag}> from line ${last.lineNo}`);
            stack.push(last);
        }
    }
}
