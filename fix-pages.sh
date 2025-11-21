#!/bin/bash

# Fix script imports for all problematic pages

PAGES=(
    "contact.html"
    "analytics.html"
    "upload.html"
    "search.html"
    "health.html"
    "portfolio.html"
)

echo "Fixing script imports on all pages..."

for page in "${PAGES[@]}"; do
    FILE_PATH="/home/guest/aws-to-opensource-local/pretamane-website/pages/$page"
    
    echo "Processing $page..."
    
    # Check if nav-component.js is already there
    if grep -q "nav-component.js" "$FILE_PATH"; then
        echo "  → $page already has nav-component.js, skipping..."
        continue
    fi
    
    # Use sed to add the scripts before </body>
    sed -i '/<\/body>/i\    <script src="/assets/js/nav-component.js"></script>\n    <script src="/assets/js/navigation.js"></script>\n    <!-- Google Identity Services -->\n    <script src="https://accounts.google.com/gsi/client" async defer></script>\n    <script src="/assets/js/google-auth.js"></script>' "$FILE_PATH"
    
    # Remove duplicate navigation.js if it exists
    # This keeps only the first occurrence
    awk '!seen[$0]++ || !/navigation\.js/' "$FILE_PATH" > "${FILE_PATH}.tmp" && mv "${FILE_PATH}.tmp" "$FILE_PATH"
    
    echo "  ✓ Fixed $page"
done

echo ""
echo "All pages fixed successfully!"
