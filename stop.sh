#!/bin/bash

# SplitSquad Stop Script

echo "Stopping SplitSquad..."
pkill -f "node.*index.js" 2>/dev/null
sleep 1

# Verify stopped
if pgrep -f "node.*index.js" > /dev/null; then
  echo "Force stopping..."
  pkill -9 -f "node.*index.js" 2>/dev/null
fi

echo "SplitSquad stopped."
echo "Server logs: /tmp/splitsquad.log"
echo "Nginx logs: sudo tail -f /var/log/nginx/access.log"
