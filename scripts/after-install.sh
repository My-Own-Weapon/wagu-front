cd /home/ubuntu/wagu-front
aws s3 cp s3://wagu-front-bucket/$GITHUB_SHA.zip $GITHUB_SHA.zip
unzip -o $GITHUB_SHA.zip
npm install
npm run build