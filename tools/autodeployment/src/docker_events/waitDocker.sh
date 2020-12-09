# This script listens to docker events and will report only the following events:
# START, UNPAUSE and RESTART.
# The result of these actions is we received a JSON object with information about
# the container whenever it starts for any reason.

#!/bin/bash

docker events --format '{{json .}}' --filter 'event=start' --filter 'event=unpause' --filter 'event=restart' |
while read event;
do
    echo ${event}
    pkill -P $$
done
