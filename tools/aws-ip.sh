ipv4=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

echo '\n\nAPI_URL=http://'$ipv4':3000' >> ../telescope/.env
