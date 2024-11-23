#!/bin/bash

# Build the application
npm run build

# Ensure PWA assets are copied correctly
cp -r dist/* .vercel/output/static/

# Create routes.json for better PWA support
echo '{
  "version": 3,
  "routes": [
    {
      "src": "^/service-worker.js$",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "^/manifest.json$",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "^/icons/.*",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    }
  ]
}' > .vercel/output/config.json
