#!/bin/bash

# SplitSquad Production Startup Script
# Starts Express (port 3000) + Next.js (port 3001) with Nginx reverse proxy

cd /home/mevin/SplitSquad

# Kill existing instances
pkill -f "node.*index.js" 2>/dev/null
pkill -f "next start" 2>/dev/null
sleep 2

# Start Express server
echo "Starting SplitSquad Express server..."
setsid node /home/mevin/SplitSquad/src/index.js > /tmp/splitsquad.log 2>&1 &
SERVER_PID=$!
echo "Express server started with PID: $SERVER_PID"

# Start Next.js server
echo "Starting Next.js marketing site..."
cd /home/mevin/SplitSquad/site && setsid npx next start -p 3001 > /tmp/splitsquad-next.log 2>&1 &
NEXT_PID=$!
echo "Next.js server started with PID: $NEXT_PID"

# Wait for Express server to be ready
echo "Waiting for Express server..."
for i in {1..10}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "Express server is ready!"
    break
  fi
  sleep 1
done

# Wait for Next.js server to be ready
echo "Waiting for Next.js server..."
for i in {1..10}; do
  if curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/ 2>/dev/null | grep -q '200\|302'; then
    echo "Next.js server is ready!"
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
echo "  Express API: http://localhost:3000"
echo "  Marketing:   http://localhost:3001"
echo "  Public:      https://splitsquad.qzz.io"
echo "========================================="
echo ""
echo "To stop: ./stop.sh"
echo "Express logs: tail -f /tmp/splitsquad.log"
echo "Next.js logs: tail -f /tmp/splitsquad-next.log"
echo "Nginx logs: sudo tail -f /var/log/nginx/access.log"
