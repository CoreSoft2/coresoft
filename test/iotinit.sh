#!/bin/sh
cd /home/pi/pivot/

a=0
auth= ''
while read line
do a=$(($a+1));
auth += $a;
auth += '&';
done < "auth.dat"

curl -sS http://fast.pivotsecurlty.com/iot/getimage?$auth > file.zip && \
unzip file.zip                                  && \
rm file.zip

python -tt servicecontainer.py

