#!/bin/bash

mkdir azagent;cd azagent;curl -fkSL -o vstsagent.tar.gz https://vstsagentpackage.azureedge.net/agent/2.177.1/vsts-agent-linux-x64-2.177.1.tar.gz;tar -zxvf vstsagent.tar.gz; if [ -x "$(command -v systemctl)" ]; then ./config.sh --environment --environmentname "myLinuxVM" --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/manepallirajesh/ --work _work --projectname 'manepallirajesh' --auth PAT --token dvt7mcuefexqqpkuiiqspftnobanyzj4vxswdzvhcrxttg36l6ba --runasservice; sudo ./svc.sh install; sudo ./svc.sh start; else ./config.sh --environment --environmentname "myLinuxVM" --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/manepallirajesh/ --work _work --projectname 'manepallirajesh' --auth PAT --token dvt7mcuefexqqpkuiiqspftnobanyzj4vxswdzvhcrxttg36l6ba; ./run.sh; fi


