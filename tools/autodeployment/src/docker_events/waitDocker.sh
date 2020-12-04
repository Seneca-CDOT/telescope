#!/bin/bash

docker events --format '{{json .}}' --filter 'event=start' --filter 'event=unpause' --filter 'event=restart' |
while read event;
do
    echo ${event}
    pkill -P $$
done
