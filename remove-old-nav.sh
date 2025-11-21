#!/bin/bash

# Script to remove hardcoded navigation from search.html and health.html

for file in "pages/search.html" "pages/health.html"; do
    echo "Processing $file..."
    
    # Create backup
    cp "$file" "${file}.bak"
    
    # Use sed to remove lines from <nav class="nav"> to </nav>
    # This removes the entire nav block
    sed -i '/<nav class="nav">/,/<\/nav>/d' "$file"
    
    # Add the comment where the nav was removed
    sed -i '/<\/head>/a\<body class="api-page">\n    <!-- Navigation will be injected by nav-component.js -->' "$file"
    
    # Remove duplicate body tag if it exists
    sed -i '/^<body class="api-page">$/{ N; /<body class="api-page">\n<body class="api-page">/d; }' "$file"
    
    echo "✓ Fixed $file"
done

echo ""
echo "All pages fixed!"
