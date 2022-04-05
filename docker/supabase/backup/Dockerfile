FROM alpine:3.15

# Install the Postgres client utilities
RUN apk add --no-cache postgresql14-client

WORKDIR /backup-scripts

COPY ./restore-backup.sh ./

# Create directory to hold the database dumps
RUN mkdir /var/opt/pg_dumps

CMD ["crond", "-f", "-l", "8"]
