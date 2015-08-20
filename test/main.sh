#!/bin/sh

sudo apt-get -y update
sudo apt-get -y install python-pip python-dev git
sudo apt-get -y install libffi-dev libssl-dev

sudo pip install evdev
sudo pip install requests
sudo pip install urllib3
sudo pip install pyopenssl ndg-httpsclient pyasn1

python -tt main.py

