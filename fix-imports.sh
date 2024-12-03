#!/bin/bash
for file in $(find components/scaffold-eth -type f -name "*.tsx" -o -name "*.ts"); do
    # First, save comments by replacing // with a unique marker
    sed -i 's/\/\//COMMENT_MARKER/g' "$file"

    # Replace all "~~/" with "../../" in imports
    sed -i 's/from "~~/from "..\/..\//' "$file"
    sed -i "s/from '~~/from '..\/..\//" "$file"

    # Fix any double slashes that might have been created
    sed -i 's/\/\//\//g' "$file"

    # Restore comments
    sed -i 's/COMMENT_MARKER/\/\//g' "$file"
done
