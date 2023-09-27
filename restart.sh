# ServerDir="/home/pz_test/pzserver"
# ServerName="restarttest"
# username="pz_test"
# screenSession=$username

ServerDir=$1
ServerName=$2
screenSession=$3

# 서버가 돌고있는지 먼저 판단
isProcessRunning=$(ps a | grep -v 'grep' | grep -c "ProjectZomboid64 -servername $ServerName")

if [ $isProcessRunning -eq 1 ]
then
	echo "server restart in 10 sec"
	screen -S $screenSession -X stuff 'servermsg "서버가 10초 뒤 재시작됩니다"\r'
	sleep 5s	
	screen -S $screenSession -X stuff 'servermsg 5\r'
	sleep 1s
	screen -S $screenSession -X stuff 'servermsg 4\r'
	sleep 1s
	screen -S $screenSession -X stuff 'servermsg 3\r'
	sleep 1s
	screen -S $screenSession -X stuff 'servermsg 2\r'
	sleep 1s
	screen -S $screenSession -X stuff 'servermsg 1\r'
	sleep 1s
	screen -S $screenSession -X stuff 'quit\r'
	sleep 10s
elif [ $isProcessRunning -gt 1 ]
then
	echo "Processing Server Count is greater that 1. Something must be wrong"
else
	echo "server is not running. server will start"
fi
if [ $isProcessRunning -le 1 ]
then
	screen -S $screenSession -X stuff "cd ${ServerDir}\r"
	screen -S $screenSession -X stuff "./start-server.sh -servername ${ServerName}\r"
	sleep 1s
	echo "server pid : $(pgrep -f "ProjectZomboid64 -servername ${ServerName}")"
fi
