ipv4=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

sed -r \
  -e  "s@(.+=)http://localhost:8000(/[^ ]*)*@\1http://$ipv4:3000\2@g" \
  -e  "s@(.+=)http://localhost:3000(/[^ ]*)*@\1http://$ipv4:8000\2@g" \
  -e  "s@(.+=)http://localhost([^:]*)@\1http://$ipv4:8443\2@g" \
  -e  "s@development\.yml@gitpod\.yml@" \
  config/env.development > .env
