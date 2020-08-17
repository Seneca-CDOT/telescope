#!/bin/sh

process=crond

# Make sure we react to these signals by running stop() when we see them - for clean shutdown
# And then exiting
trap "stop; exit 0;" SIGTERM SIGINT

stop()
{
  # We're here because we've seen SIGTERM, likely via a Docker stop command or similar
  # Let's shutdown cleanly
  echo "SIGTERM caught, terminating ${process} process(es)..."
  pid=$(pidof ${process})
  kill -TERM $pid > /dev/null 2>&1
  sleep 1
  echo "Terminated."
  exit
}

# This loop runs till until we've started up successfully
while true; do

  # Check if the process is running by recording it's PID (if it's not running $pid will be null):
  pid=$(pidof ${process})

  # If $pid is null, do this to start or restart the process:
  while [ -z "$pid" ]; do
    echo "Displaying /etc/logrotate.conf contents..."
    cat /etc/logrotate.conf
    echo "Displaying logrotate version..."
    /usr/sbin/logrotate --version
    echo "Displaying crond jobs..."
    crontab -l
    echo "Starting ${process} in the background..."
    date
    busybox | head -1
    crond -f -d 6 &
    # Check if the process is now running by recording it's PID (if it's not running $pid will be null):
    pid=$(pidof ${process})

    # If $pid is null, startup failed; log the fact and sleep for 2s
    # We'll then automatically loop through and try again
    if [ -z "$pid" ]; then
      echo "Startup of ${process} failed, sleeping for 2s, then retrying..."
      sleep 2
    fi

  done

  # Break this outer loop once we've started up successfully
  # Otherwise, we'll silently restart
  break

done

while true; do

  # Check if the process is STILL running by recording it's PID (if it's not running $pid will be null):
  pid=$(pidof ${process})
  # If it is not, lets kill our PID1 process (this script) by breaking out of this while loop:
  # This ensures Docker 'see' the failure and handle it as necessary
  if [ -z "$pid" ]; then
    echo "${process} has failed, exiting, so Docker can restart the container..."
    break
  fi

  # If it is, give the CPU a rest
  sleep 1

done


sleep 1
exit 1
