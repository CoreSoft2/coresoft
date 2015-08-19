import os,subprocess as sub
p = sub.Popen('./main.sh',shell=True, stdout=sub.PIPE).stdout
while 1:
        line = p.readline()
        if not line: break
        print line               