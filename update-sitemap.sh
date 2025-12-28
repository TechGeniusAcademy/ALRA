#!/bin/bash
# Script to update sitemap lastmod dates

SITEMAP_FILE="client/public/sitemap.xml"
CURRENT_DATE=$(date +%Y-%m-%d)

echo "Updating sitemap with current date: $CURRENT_DATE"

# Update all lastmod tags with current date
sed -i "s|<lastmod>[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}</lastmod>|<lastmod>$CURRENT_DATE</lastmod>|g" "$SITEMAP_FILE"

echo "Sitemap updated successfully!"
echo "Don't forget to rebuild and deploy:"
echo "  cd client && npm run build"
