#!/bin/bash

# Function to fix single-slash comments in a file
fix_comments() {
    local file="$1"
    # Replace single-slash comments with double-slash
    sed -i 's/^\([[:space:]]*\)\/\([[:space:]]\)/\1\/\/\2/g' "$file"
}

# Process all TypeScript files in scaffold-eth directory
find components/scaffold-eth -type f \( -name "*.tsx" -o -name "*.ts" \) | while read -r file; do
    fix_comments "$file"
done
