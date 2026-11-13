#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "=== Setting up Dropa-Regular.woff2 across suite ==="

# Ensure target font directories exist
mkdir -p scholars_ng/web_app/public/fonts
mkdir -p tutorspro/public/fonts

# Copy font file
cp Dropa-Regular.woff2 scholars_ng/web_app/public/fonts/Dropa-Regular.woff2
cp Dropa-Regular.woff2 tutorspro/public/fonts/Dropa-Regular.woff2

echo "✔ Successfully copied Dropa-Regular.woff2 to scholars_ng/web_app/public/fonts/"
echo "✔ Successfully copied Dropa-Regular.woff2 to tutorspro/public/fonts/"
