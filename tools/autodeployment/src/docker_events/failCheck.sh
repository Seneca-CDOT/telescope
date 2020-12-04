#!/bin/bash

docker events --format '{{json .}}' --filter 'event=pause' --filter 'event=die' --filter 'event=stop' |
while read event;
do
    echo ${event}
    pkill -P $$
done
