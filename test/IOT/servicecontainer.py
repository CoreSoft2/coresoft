import os,subprocess as sub
p = sub.Popen('./main.sh',shell=True, stdout=sub.PIPE).stdout
while 1:
        line = p.readline()
        if not line: break
        try:
            data = urllib.urlencode({'deviceid':'000000008f6f34db', 'apikey':'a66e4c70-46a6-11e5-b9e2-0375f0e0ccdb','apisecret':'bbbb','error':line })
            fullurl =  'http://fast.pivotsecurity.com/iot/adderror?' + data
            response = urllib2.urlopen(fullurl)
                
        except requests.exceptions.Timeout:
            app_log.debug('Connection Error at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            q.put(arg)
            time.sleep(10)
        except:
            app_log.debug('Connection Error at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            q.put(arg)
            time.sleep(30)
