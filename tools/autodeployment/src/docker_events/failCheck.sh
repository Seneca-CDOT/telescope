# This script listens to docker events and will report only the following events:
# PAUSE, DIE and STOP.
# The result of these actions is we received a JSON object with information about the container
# whenever it STOPS for any reason.

#!/bin/bash

docker events --format '{{json .}}' --filter 'event=pause' --filter 'event=die' --filter 'event=stop' |
while read event;
do
    echo ${event}
    pkill -P $$
done
