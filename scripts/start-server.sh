#!/bin/bash
cd /home/ubuntu/wagu-front
pm2 reload ecosystem.config.js --env production
pm2 save