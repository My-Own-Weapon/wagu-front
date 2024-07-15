export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.15.1/bin

cd /home/ubuntu/wagu-front

# 아래의 코드를 ec2 터미널에서 안된다면 스크립트를 추가해서 build 하기이전에 권한을 얻도록 수정하라.
# # 프로젝트 디렉토리와 node_modules 디렉토리에 적절한 권한 부여
# sudo chown -R ubuntu:ubuntu /home/ubuntu/wagu-front
# sudo chmod -R u+rw /home/ubuntu/wagu-front

# # npm 관련 디렉토리 권한 수정
# sudo chown -R ubuntu:ubuntu /home/ubuntu/.npm
# sudo chmod -R u+rw /home/ubuntu/.npm


/home/ubuntu/.nvm/versions/node/v20.15.1/bin/npm install
/home/ubuntu/.nvm/versions/node/v20.15.1/bin/npm run build