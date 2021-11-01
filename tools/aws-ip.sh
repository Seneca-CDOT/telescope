ipv4=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

cp config/env.development config/env.remote

sed -i "s/for Development/for Remote Development/g" config/env.remote
sed -i "s/localhost/$ipv4/g" config/env.remote

cp config/env.remote .env
