#!/bin/sh
cd /home/pi/pivot/

# Step 1: Update local code

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

# Step 2: Start IOT
python -tt servicecontainer.py

# Step 3: Finish .....
