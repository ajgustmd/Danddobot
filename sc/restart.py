
import subprocess
import sys

# ServerDir 은 start-server.sh 파일이 있는 폴더를 말함

sh_path = "/home/dev/DanddoBot/restart.sh" # 게임에 따라 결정

user = "pz_danddo"

# you can use './server | tee -a log.txt' if the server program doesn't provide realtime logging file
log_path = "/home/pz_danddo/Zomboid/server-console.txt" # 게임에 따라 없을 수 있음, 다만 디폴트 설정 할만 함

ServerDir = "/home/pz_danddo"
ServerName = "danddo" # 게임에 따라 없을 수 있음, 다만 디폴트 설정 할만 함
screenSession = "pz_danddo"

f = subprocess.Popen(["bash", sh_path, ServerDir, ServerName, screenSession], user=user, group=user)

# create log_path file if it doesn't exist
log = subprocess.Popen(['tail', '-f', log_path], user=user, group=user, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
isServerOpened = False

while not isServerOpened:
    line = log.stdout.readline().decode("utf-8") 
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