#!/bin/bash

# SplitSquad Stop Script

echo "Stopping SplitSquad..."

# Stop Express
pkill -f "node.*index.js" 2>/dev/null
# Stop Next.js
pkill -f "next start" 2>/dev/null
sleep 1

# Verify stopped
if pgrep -f "node.*index.js" > /dev/null; then
  echo "Force stopping Express..."
  pkill -9 -f "node.*index.js" 2>/dev/null
fi
if pgrep -f "next start" > /dev/null; then
  echo "Force stopping Next.js..."
  pkill -9 -f "next start" 2>/dev/null
fi

echo "SplitSquad stopped."
echo "Express logs: /tmp/splitsquad.log"
echo "Next.js logs: /tmp/splitsquad-next.log"
echo "Nginx logs: sudo tail -f /var/log/nginx/access.log"
