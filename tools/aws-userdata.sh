#!/bin/bash
# Install Docker
yum update -y
amazon-linux-extras install docker
sudo service docker start
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install docker-compose
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
yum install -y nodejs

# Install pnpm
npm install -g pnpm

# Install git
yum install -y git

# Install GitHub CLI
sudo yum install -y https://github.com/cli/cli/releases/download/v2.5.1/gh_2.5.1_linux_amd64.rpm
