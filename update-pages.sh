#!/bin/bash

# Script to update all HTML pages to use the navigation component system

PAGES=(
    "services.html"
    "contact.html"
    "analytics.html"
    "upload.html"
    "search.html"
    "health.html"
    "portfolio.html"
)

echo "Updating navigation on all pages to use component system..."

for page in "${PAGES[@]}"; do
    echo "Processing /pages/$page..."
    
    # Create a backup
    cp "/home/guest/aws-to-opensource-local/pretamane-website/pages/$page" "/home/guest/aws-to-opensource-local/pretamane-website/pages/${page}.backup"
    
    # Use Python to update the files since this is complex HTML manipulation
    python3 << EOF
import re

file_path = "/home/guest/aws-to-opensource-local/pretamane-website/pages/$page"

with open(file_path, 'r') as f:
    content = f.read()

# Remove the hardcoded nav section (between <body> and first <header> or <section>)
# Pattern to match the nav element
nav_pattern = r'<body>\s*<nav class="nav">.*?</nav>\s*'
content = re.sub(nav_pattern, '<body>\n    <!-- Navigation will be injected by nav-component.js -->\n\n    ', content, flags=re.DOTALL)

# Add scripts before </body> if not already present
if 'nav-component.js' not in content:
    # Find the closing body tag and add scripts before it
    scripts_to_add = '''    <script src="/assets/js/nav-component.js"></script>
    <script src="/assets/js/navigation.js"></script>
    <!-- Google Identity Services -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script src="/assets/js/google-auth.js"></script>
</body>'''
    
    content = re.sub(r'(\s*)<script[^>]*navigation\.js[^>]*></script>\s*</body>', scripts_to_add, content)
    
    # If no navigation.js was found, just add before </body>
    if 'nav-component.js' not in content:
        content = re.sub(r'</body>', scripts_to_add, content)

with open(file_path, 'w') as f:
    f.write(content)

print(f"Updated {file_path}")
EOF

done

echo "All pages updated successfully!"
echo "Backups created with .backup extension"
