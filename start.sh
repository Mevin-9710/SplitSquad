#!/bin/bash

# SplitSquad Production Startup Script
# Uses Nginx reverse proxy with Cloudflare SSL

cd /home/mevin/SplitSquad

# Kill existing instances
pkill -f "node.*index.js" 2>/dev/null
sleep 2

# Start Node.js server
echo "Starting SplitSquad server..."
setsid node /home/mevin/SplitSquad/src/index.js > /tmp/splitsquad.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Wait for server to be ready
echo "Waiting for server to start..."
for i in {1..10}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  sleep 1
done

# Check Nginx status
if systemctl is-active --quiet nginx; then
  echo "Nginx is running"
else
  echo "Starting Nginx..."
  sudo systemctl start nginx
fi

# Display status
echo ""
echo "========================================="
echo "  SplitSquad is running!"
echo "  Server: http://localhost:3000"
echo "  Public: https://splitsquad.qzz.io"
echo "========================================="
echo ""
echo "To stop: ./stop.sh"
echo "Logs: tail -f /tmp/splitsquad.log"
echo "Nginx logs: sudo tail -f /var/log/nginx/access.log"
