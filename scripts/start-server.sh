#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.15.1/bin/pm2

cd /home/ubuntu/wagu-front

pm2 reload ecosystem.config.js --env production
pm2 save