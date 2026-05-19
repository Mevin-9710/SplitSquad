# SplitSquad VPS Deployment

## 1) Server prerequisites
- Ubuntu 22.04+
- Node.js 20+
- Nginx
- PM2

## 2) Persistent paths
- App: `/opt/splitsquad`
- DB: `/opt/splitsquad/data/splitsquad.db`
- Auth/session artifacts: `/opt/splitsquad/.auth`
- Logs: `/opt/splitsquad/logs`

## 3) Environment
Set `.env` with:
- `EVOLUTION_API_URL`
- `EVOLUTION_API_KEY`
- `EVOLUTION_INSTANCE_PREFIX`
- `APP_BASE_URL`
- `DATABASE_PATH`
- `AUTH_SESSION_SECRET`

## 4) Run with PM2
```bash
npm ci
pm2 start src/index.js --name splitsquad
pm2 save
pm2 startup
```

## 5) Nginx reverse proxy
```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 6) TLS
```bash
sudo certbot --nginx -d your-domain.com
```

## 7) Ops checks
- `curl https://your-domain.com/health`
- Restart PM2 and confirm data persists.
- Verify cert renewal timer: `systemctl status certbot.timer`
