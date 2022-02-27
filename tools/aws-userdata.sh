#!/bin/bash
yum update -y
amazon-linux-extras install docker
sudo service docker start
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose

curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
yum install -y nodejs
npm install -g pnpm
yum install -y git
