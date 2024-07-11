cd /home/ubuntu/wagu-front
aws s3 cp s3://wagu-front-bucket/$GITHUB_SHA.zip $GITHUB_SHA.zip
unzip -o $GITHUB_SHA.zip
/home/ubuntu/.nvm/versions/node/v20.15.1/bin/npm install
/home/ubuntu/.nvm/versions/node/v20.15.1/bin/npm run build