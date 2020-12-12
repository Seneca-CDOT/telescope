# This script listens to docker events and will report only the following events:
# START, UNPAUSE, RESTART, PAUSE, DIE and STOP.


#!/bin/bash

docker events --format '{{json .}}' --filter 'event=start' --filter 'event=unpause' --filter 'event=restart' --filter 'event=pause' --filter 'event=die' --filter 'event=stop'|
while read event;
do
    echo ${event}
done
