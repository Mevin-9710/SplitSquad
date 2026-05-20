#!/bin/bash

# SplitSquad Status Script

echo "=== SplitSquad Status ==="
echo ""

# Check server
if pgrep -f "node.*index.js" > /dev/null; then
  echo "✓ Server: Running"
  echo "  Health: $(curl -s http://localhost:3000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/health)"
else
  echo "✗ Server: Not running"
fi

echo ""

# Check tunnel
if pgrep -f "cloudflared" > /dev/null; then
  echo "✓ Tunnel: Running"
  TUNNEL_URL=$(grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' /tmp/cloudflared.log | tail -1)
  if [ -n "$TUNNEL_URL" ]; then
    echo "  URL: $TUNNEL_URL"
  fi
else
  echo "✗ Tunnel: Not running"
fi

echo ""
echo "Commands:"
echo "  Start:  ./start.sh"
echo "  Stop:   ./stop.sh"
echo "  Status: ./status.sh"
echo ""
echo "Logs:"
echo "  Server:  tail -f /tmp/splitsquad.log"
echo "  Tunnel:  tail -f /tmp/cloudflared.log"
