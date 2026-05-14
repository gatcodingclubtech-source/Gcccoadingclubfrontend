import sys

def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    import re
    # Simplified tag finder for div and section
    tags = re.findall(r'<(div|section|motion\.div)|</(div|section|motion\.div)>', content)
    
    line_map = content.splitlines()
    
    # We need to track line numbers. re.finditer is better.
    matches = re.finditer(r'<(div|section|motion\.div)|</(div|section|motion\.div)>', content)
    
    stack = []
    for m in matches:
        tag = m.group(1) or m.group(2)
        is_closing = m.group(0).startswith('</')
        line_no = content.count('\n', 0, m.start()) + 1
        
        if not is_closing:
            stack.append((tag, line_no))
        else:
            if not stack:
                print(f"Error: Found closing tag </{tag}> at line {line_no} but stack is empty")
                continue
            last_tag, last_line = stack.pop()
            if last_tag != tag:
                print(f"Error: Mismatched tag. Found </{tag}> at line {line_no}, expected </{last_tag}> from line {last_line}")
    
    while stack:
        tag, line = stack.pop()
        print(f"Error: Unclosed tag <{tag}> from line {line}")

if __name__ == "__main__":
    check_balance(sys.argv[1])
