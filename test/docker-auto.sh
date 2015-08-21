
#!/bin/sh


docker stop node

docker rm node

docker rmi node

cd /root/source

rm -fr /root/source/*

git clone https://github.com/CoreSoft2/coresoft.git

mv /root/source/coresoft/* /root/source/

cp /root/source/conf/env/production.js /root/source/conf/env/development.sh

cd ..

docker build -t node .

docker run --name=node --link mongodb:mongodb -i -t -p 3000:3000 -d node

