import termios, fcntl, sys, os
import threading, Queue
import urllib,urllib2, requests
import socket,struct,fcntl
import logging
import datetime,time

# pip install evdev
from evdev import InputDevice
from select import select
from logging.handlers import RotatingFileHandler

log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')
my_handler = RotatingFileHandler('/home/pi/logs/iot.log', mode='a', maxBytes=124, backupCount=2, encoding=None, delay=0)
my_handler.setFormatter(log_formatter)
my_handler.setLevel(logging.DEBUG)

app_log = logging.getLogger('root')
app_log.setLevel(logging.DEBUG)

app_log.addHandler(my_handler)

# look for a /dev/input/by-id/usb...kbd or something similar
DEVICE = "/dev/input/by-id/usb-13ba_Barcode_Reader-event-kbd"

dev = InputDevice(DEVICE)
url = 'https://www.intellifortsolutions.com/school/tagpost.php'

# The worker thread gets jobs off the queue.
def worker():
    app_log.debug('Running worker')
    while 1:
        try:
            arg = q.get(block=False)
        except Queue.Empty:
            time.sleep(0.01)
        except:
            time.sleep(10)
            app_log.debug('Exception in processing tag. sleeping for 10 sec... beofore retry')
        else:
            try:
                #app_log.debug('Connection at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                values = { 'tags' : arg, 'school':'test', 'auth': 'test' }
                data = urllib.urlencode(values)
                req = urllib2.Request(url, data)
                response = urllib2.urlopen(req)
            except requests.exceptions.Timeout:
                app_log.debug('Connection Error at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                q.put(arg)
                time.sleep(10)
            except:
                app_log.debug('Connection Error at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                q.put(arg)
                time.sleep(60)

def kb2handler():
    tagno = ''
    while 1:
        r, w, x = select([dev], [], [])
        for event in dev.read():
            if event.type==1 and event.value==1:
               if event.code == 28:
                   app_log.debug( datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") +',' +tagno )
                   q.put(tagno)
                   tagno = '';
            else:
                if 11 == event.code:
                    kcode = 0
                else:
                    kcode = event.code - 1
                    tagno = tagno + str(kcode)

# Create queue
q = Queue.Queue()

# Start http 5 workers
t = threading.Thread(target=worker, name='http worker ')
t.start()

# create kb worker : usb-13ba_Barcode_Reader-event-kbd
t2 = threading.Thread(target=kb2handler, name='kb worker')
t2.start()

# Give threads time to run
values = { 'school' : 'test', 'auth' : 'test' , 'host' : socket.gethostbyname(socket.gethostname())}
data = urllib.urlencode(values)
req = urllib2.Request('https://www.intellifortsolutions.com/school/tagreaderinfo.php', data)
response = urllib2.urlopen(req)

app_log.debug( 'Main thread sleeping :: ' )

time.sleep(500)

