FROM alpine:latest
WORKDIR "/"

RUN apk add --no-cache --update --verbose logrotate grep bash && rm -rf /var/cache/apk/* /tmp/* /sbin/halt /sbin/poweroff /sbin/reboot

COPY logrotate.conf /etc/logrotate.conf
COPY crond.sh /usr/bin/crond.sh

RUN (echo -e "0   *   *   *   *   echo 'Running Logrotate...' && /usr/sbin/logrotate --verbose /etc/logrotate.conf\n") | crontab - && chmod +x /usr/bin/crond.sh && chmod 644 /etc/logrotate.conf

ENTRYPOINT ["/usr/bin/crond.sh"]
