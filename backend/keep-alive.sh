#!/bin/bash

# Self-Ping Script for Render.com
# Prevents the free tier service from sleeping by pinging every 10 minutes
# Deploy this as a GitHub Action or external cron job

BACKEND_URL="https://your-app-name.onrender.com/api/ping"
INTERVAL=600  # 10 minutes in seconds

echo "Starting self-ping service for Kishan Mitra Backend"
echo "Target: $BACKEND_URL"
echo "Interval: $INTERVAL seconds"

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "[$TIMESTAMP] ✓ Ping successful - Status: $HTTP_CODE"
        echo "Response: $BODY"
    else
        echo "[$TIMESTAMP] ✗ Ping failed - Status: $HTTP_CODE"
    fi
    
    sleep $INTERVAL
done
