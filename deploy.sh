#!/usr/bin/env bash
# Deploy LifeQuest: bump SW cache, push to GitHub Pages, and upload static files to the Oracle server (IP from server.env).
set -e; cd "$(dirname "$0")"; source ./server.env
sed -i -E "s/const C='boji-v[0-9]+'/const C='boji-v$(date +%s)'/" sw.js
git add -A && git commit -qm "${1:-update $(date '+%F %T')}" || true
git push -q origin main && echo "GitHub Pages → https://kofcode.github.io/lifequest/"
tar --exclude=shots --exclude=.git --exclude=server --exclude=server.env --exclude='*.sh' --exclude=.gitignore -czf /tmp/lq-static.tgz .
K="-i ${SSH_KEY:-/home/box/.ssh/oci_lf} -o ConnectTimeout=10"
scp -q $K /tmp/lq-static.tgz ubuntu@$IP:/tmp/lq-static.tgz
ssh $K ubuntu@$IP 'sudo rm -rf /var/www/lifequest/* && sudo tar -xzf /tmp/lq-static.tgz -C /var/www/lifequest && sudo chmod -R a+rX /var/www/lifequest && rm /tmp/lq-static.tgz'
echo "Oracle → https://${IP//./-}.sslip.io/lifequest/"
