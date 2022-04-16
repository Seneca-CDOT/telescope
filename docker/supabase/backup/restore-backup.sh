#!/bin/sh

# Usage of the script:
#
# ./restore-backup.sh <backup-file>
# e.g.
# ./restore-backup.sh /home/user/backups/Apr-02-2022-backup.dump

BACKUP_FILE="$1"

# The command may not drop and recreate the
# database if you do not close all connections
# available to it
#
# Most of the time, it is safe to get a few errors
# because the script will try to create tables that
# already exist. However, to avoid any weird
# complications, it is recommended that you drop and
# recreate the database. If you are using this,
# we already have backups, so you shouldn't worry
# too much if you drop the database.
pg_restore --format=custom \
	   --clean \
	   --if-exists \
	   --enable-row-security \
	   --disable-triggers \
	   --dbname="host=$PG_HOST_NAME port=$PG_HOST_PORT dbname=$PG_DB_NAME user=$PG_USER_NAME password=$PG_USER_PASSWORD" < "$BACKUP_FILE"
