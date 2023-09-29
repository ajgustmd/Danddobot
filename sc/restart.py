
import subprocess
import sys

# ServerDir 은 start-server.sh 파일이 있는 폴더를 말함

sh_path = sys.argv[1]

# you can use './server | tee -a log.txt' if the server program doesn't provide realtime logging file

user = sys.argv[2]
dir = sys.argv[3]
session = sys.argv[4]
servername = sys.argv[5]
log = sys.argv[6]

f = subprocess.Popen(["bash", sh_path, dir, servername, session], user=user, group=user)

# create log_path file if it doesn't exist
logtail = subprocess.Popen(['tail', '-f', log], user=user, group=user, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
isServerOpened = False

while not isServerOpened:
    line = logtail.stdout.readline().decode("utf-8") 
    if "SERVER STARTED" in line:
        isServerOpened = True
        print("SERVER_STARTED")
        sys.stdout.flush()
        break

"""
# To send data to node
print(data)
sys.stdout.flush()
"""

"""
import os
import pwd

id = pwd.getpwnam(user)

os.setuid(id.pw_uid)
os.setgid(id.pw_gid)
"""

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