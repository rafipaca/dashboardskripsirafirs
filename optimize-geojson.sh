# Script to optimize GeoJSON file
#!/bin/bash

echo "Installing mapshaper if not already installed..."
npm install -g mapshaper

echo "Creating optimized GeoJSON file..."
# Create a simplified version of the GeoJSON (10% of original detail)
mapshaper public/data/rbipulaujawageojson.geojson -simplify 10% -o public/data/rbipulaujawageojson.min.geojson

# Create even more simplified version as fallback (5% of original detail)
mapshaper public/data/rbipulaujawageojson.geojson -simplify 5% -o public/data/rbipulaujawageojson.tiny.geojson

echo "Optimization complete!"
echo "Original file size:"
du -h public/data/rbipulaujawageojson.geojson
echo "Optimized file size:"
du -h public/data/rbipulaujawageojson.min.geojson
echo "Tiny file size:"
du -h public/data/rbipulaujawageojson.tiny.geojson 