#!/bin/bash
# Get token from vercel MCP connection
echo "Deploying to Vercel team: percysr-4252s-projects"
vercel deploy --prod --yes --name retailperu-analizador-ia 2>&1
