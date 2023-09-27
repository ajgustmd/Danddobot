"""
import os
import pwd

id = pwd.getpwnam(user)

os.setuid(id.pw_uid)
os.setgid(id.pw_gid)
"""

import subprocess
import sys

# ServerDir 은 start-server.sh 파일이 있는 폴더를 말함

"""
user = "pz_test"
sh_path = "/home/pz_test/pzserver/restart.sh"
log_path = "/home/pz_test/Zomboid/server-console.txt"

ServerDir = "/home/pz_test/pzserver"
ServerName = "restarttest"
screenSession = "pz_test"
"""

"""
user = "pz_tarkov"
sh_path = "/home/pz_tarkov/restart.sh"
log_path = "/home/pz_tarkov/Zomboid/server-console.txt"

ServerDir = "/home/pz_tarkov"
ServerName = "pz_tarkov"
screenSession = "pz_tarkov"
"""
sh_path = "/home/dev/DanddoBot/restart.sh"

user = "pz_danddo"

# you can use './server | tee -a log.txt' if the server program doesn't provide realtime logging file
log_path = "/home/pz_danddo/Zomboid/server-console.txt"

ServerDir = "/home/pz_danddo"
ServerName = "danddo"
screenSession = "pz_danddo"

print("SERVER_STARTED")
sys.stdout.flush()
f = subprocess.Popen(["bash", sh_path, ServerDir, ServerName, screenSession], user=user, group=user)
print("after")
sys.stdout.flush()

# create log_path file if it doesn't exist
log_p = subprocess.Popen(['tail', '-f', log_path], user=user, group=user, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
line = ""
isServerOpened = False

# for debug
#with open("testpy.txt", 'w') as db:

while not isServerOpened:
    testline = log_p.stdout.readline().decode("utf-8")
    line += testline
    #line += log_p.stdout.readline().decode("utf-8")
    #db.write(testline + ";")
    
    loglines = line.split('\n')
    line = loglines[-1]
    loglines = loglines[:-1]
    for log in loglines:
        if "SERVER STARTED" in log:
            isServerOpened = True
            print("SERVER_STARTED")
            sys.stdout.flush()
            break

"""
# To send data to node
print(data)
sys.stdout.flush()
"""
