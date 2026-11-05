#!/bin/bash
# Runs on the server (as ubuntu with sudo). Expects files in /tmp/lq/.
set -e; S=/tmp/lq
B=/root/backup-lifequest-$(date +%Y%m%d-%H%M%S); sudo mkdir -p $B; sudo cp -a /etc/nginx/sites-available/listingforge /etc/nginx/sites-available/listingforge-tls $B/; echo backup=$B
id lifequest >/dev/null 2>&1 || sudo useradd --system --no-create-home --shell /usr/sbin/nologin lifequest
sudo install -d -o root -g lifequest -m 750 /etc/lifequest
[ -f $S/token ] && { sudo install -o lifequest -g lifequest -m 600 $S/token /etc/lifequest/token; rm -f $S/token; }
sudo install -d -o lifequest -g lifequest -m 700 /var/lib/lifequest; sudo install -d -m 755 /opt/lifequest
sudo install -m 644 $S/lifequest_api.py /opt/lifequest/; sudo install -m 644 $S/lifequest-api.service /etc/systemd/system/
sudo mkdir -p /var/www/lifequest; sudo rm -rf /var/www/lifequest/*; sudo tar -xzf $S/static.tgz -C /var/www/lifequest; sudo chown -R root:root /var/www/lifequest; sudo chmod -R a+rX /var/www/lifequest
sudo systemctl daemon-reload; sudo systemctl enable lifequest-api >/dev/null 2>&1; sudo systemctl restart lifequest-api
for f in listingforge listingforge-tls; do P=/etc/nginx/sites-available/$f
  sudo grep -q "LifeQuest (added)" $P || sudo python3 -c "
import sys;p=sys.argv[1];loc=open(sys.argv[2]).read();s=open(p).read();i=s.rstrip().rfind('}');open(p,'w').write(s[:i]+loc+s[i:])" $P $S/nginx-lifequest.conf
done
if sudo nginx -t; then sudo systemctl reload nginx; echo RELOADED; else sudo cp -a $B/listingforge $B/listingforge-tls /etc/nginx/sites-available/; echo RESTORED; exit 1; fi
