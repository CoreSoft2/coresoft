#!/bin/sh
cd /home/pi/pivot/

# Step 1: Update local code

a=0
auth=''
sep='&'

while read line
do a=$(($a+1));
auth=$auth$line$sep
done < "/home/pi/pivot/auth.dat"

curl -sS http://fast.pivotsecurity.com/iot/getimage?$auth > file.zip && \
unzip file                                  && \
rm file.zip

# Step 2: Start IOT
python -tt servicecontainer.py

# Step 3: Finish .....