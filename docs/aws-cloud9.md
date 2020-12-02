# Setting up Telescope in AWS Cloud9 IDE

**Disclaimer**: The EC2 instance used in this guide is not within AWS's Free-Tier so please see [EC2 Pricing](https://aws.amazon.com/ec2/pricing/on-demand/) to see if you're comfortable with these costs. Cloud9 has a cost-saving setting to help reduce costs by automatically hibernating after 30 minutes of inactivity. Running Gatsby and Docker in development is CPU intensive so these are the EC2 instances I recommend:

- Minimum: `t2.medium (4 GiB RAM + 2 vCPU)`
- Recommended: `t2.large (8 GiB RAM + 2 vCPU)`

## Prerequisites:

- Create an [AWS Account](https://aws.amazon.com/). You can watch this [part](https://www.youtube.com/watch?v=3hLmDS179YE&t=10552s) of the AWS Certified Cloud Practitioner course on creating an account if you need help.
- Sign into your AWS Account

## Creating your Cloud9 Environment:

1. In the upper-right hand corner of your AWS Management Console, select `US East (Ohio) us-east-2` as your `Region`
2. In the upper-left hand corner of your AWS Management Console, click on `Services`. This is bring up a list of AWS Services, search for `Cloud9`.
3. Click on `Create Environment`

- Step 1 - Name environment:

  Name: `Telescope-Dev` (whatever you want)

  Description (optional):

- Step 2 - Configure settings:

  Environment type: `Create a new EC2 instance for environment (direct access)`

  Instance type: `Other instance type: t2.large (8 GiB RAM + 2 vCPU)`

  Platform: `Ubuntu Server 18.04 LTS`

- Step 3 - Review and click `Create Environment`

It will take a few minutes for AWS to create your new C9 environment

## Installing Redis as a native application:

Enter the following into the C9 terminal:

```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/
```

[Source](https://redis.io/topics/quickstart)

### Verifying Redis installation:

Start the redis-server in a new terminal:

```
$ redis-server
[28550] 01 Aug 19:29:28 # Warning: no config file specified, using the default config. In order to specify a config file use 'redis-server /path/to/redis.conf'
[28550] 01 Aug 19:29:28 * Server started, Redis version 2.2.12
[28550] 01 Aug 19:29:28 * The server is now ready to accept connections on port 6379
... more logs ...
```

Check if Redis is working, enter `redis-cli ping` in another terminal

```
$ redis-cli ping
PONG
```

Delete the `redis-stable` directory and `redis-stable.tar.gz` with

```
rm -rf redis-stable && rm redis-stable.tar.gz
```

## Installing Elasticsearch as a native application:

```
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.2-amd64.deb
sudo dpkg -i elasticsearch-7.6.2-amd64.deb
```

### Verify that Elasticsearch is working:

```
sudo /etc/init.d/elasticsearch start
[ ok ] Starting elasticsearch (via systemctl): elasticsearch.service.
```

[Source](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

Delete `elasticsearch-7.6.2-amd64.deb` with

```
rm elasticsearch-7.6.2-amd64.deb
```

## Opening the ports on our EC2 instance:

1. Firstly, we'll need the MAC address of our EC2 instance

```
$ curl -s http://169.254.169.254/latest/meta-data/mac

0e:0a:22:87:46:79
```

2. Using your EC2 instance's MAC address, we can get a list of Security Groups

```
$ curl -s http://169.254.169.254/latest/meta-data/network/interfaces/macs/<your_mac>/security-group-ids

sg-0c63c6f026a2b9288
```

3. Find out what your IP address is using http://checkip.amazonaws.com/
4. You will need to authorize your IP address access to port 3000 and port 8000

```
aws ec2 authorize-security-group-ingress --group-id <sg-id> \
--port 3000 \
--protocol tcp \
--cidr <my-ip>/32
```

```
aws ec2 authorize-security-group-ingress --group-id <sg-id> \
--port 8000 \
--protocol tcp \
--cidr <my-ip>/32
```

## Resize your Amazon EBS volume

Check first using `df -h` in the terminal

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1      9.7G  9.3G  371M  97% /
```

When you first create an EC2 instance, it has an EBS Volume of 10GB. To increase it to 20GB, create a new file called `resize.sh` in `~/environment` directory and copy the following script:

```
#!/bin/bash

# Specify the desired volume size in GiB as a command-line argument. If not specified, default to 20 GiB.
SIZE=${1:-20}

# Get the ID of the environment host Amazon EC2 instance.
INSTANCEID=$(curl http://169.254.169.254/latest/meta-data/instance-id)

# Get the ID of the Amazon EBS volume associated with the instance.
VOLUMEID=$(aws ec2 describe-instances \
  --instance-id $INSTANCEID \
  --query "Reservations[0].Instances[0].BlockDeviceMappings[0].Ebs.VolumeId" \
  --output text)

# Resize the EBS volume.
aws ec2 modify-volume --volume-id $VOLUMEID --size $SIZE

# Wait for the resize to finish.
while [ \
  "$(aws ec2 describe-volumes-modifications \
    --volume-id $VOLUMEID \
    --filters Name=modification-state,Values="optimizing","completed" \
    --query "length(VolumesModifications)"\
    --output text)" != "1" ]; do
sleep 1
done

#Check if we're on an NVMe filesystem
if [ $(readlink -f /dev/xvda) = "/dev/xvda" ]
then
  # Rewrite the partition table so that the partition takes up all the space that it can.
  sudo growpart /dev/xvda 1

  # Expand the size of the file system.
  # Check if we are on AL2
  STR=$(cat /etc/os-release)
  SUB="VERSION_ID=\"2\""
  if [[ "$STR" == *"$SUB"* ]]
  then
    sudo xfs_growfs -d /
  else
    sudo resize2fs /dev/xvda1
  fi

else
  # Rewrite the partition table so that the partition takes up all the space that it can.
  sudo growpart /dev/nvme0n1 1

  # Expand the size of the file system.
  # Check if we're on AL2
  STR=$(cat /etc/os-release)
  SUB="VERSION_ID=\"2\""
  if [[ "$STR" == *"$SUB"* ]]
  then
    sudo xfs_growfs -d /
  else
    sudo resize2fs /dev/nvme0n1p1
  fi
fi
```

**Disclaimer**: AWS Free-Tier includes 30GB of Storage, 2 million I/Os, and 1GB of snapshot storage with [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/pricing/) free for 12 months.

In the terminal, execute the script by running

```
sh resize.sh
```

Verify size change with `df -h` again

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1       20G  9.3G   11G  48% /
```

## Setting up the Telescope repository in Cloud9:

1. In the terminal, clone the Telescope repository and name the remote `upstream` by entering

```
git clone -o upstream https://github.com/Seneca-CDOT/telescope.git
```

2. Change to the telescope directory `cd telescope`
3. Copy the `env.example` file into the root of your Telescope directory `cp env.example .env`
4. Install the Gatsby-CLI

```
npm install -g gatsby-cli
```

### If you did everything correctly, you've completed the environment setup using AWS Cloud9! Yay!

## Now to get started with development...

Run `npm install` to install all dependencies

You may need up to four terminals, remember to run them in the `telescope directory`

1. `redis-server` for Redis
2. `sudo /etc/init.d/elasticsearch start` for Elasticsearch
3. `PORT=3000 npm start` to run the server on port 3000
4. `cd src/frontend/gatsby`
5. `gatsby develop -H 0.0.0.0 -p 8000`
6. Find your EC2 instance's public IPv4

```
curl -s http://169.254.169.254/latest/meta-data/public-ipv4

35.174.16.133
```

7. Set the API_URL in your .env to your EC2 instance's public IPv4 address like

```
API_URL=<public-ip>:3000
API_URL=http://35.174.16.133:3000
```

8. Set `PROXY_FRONTEND=1` in your .env
9. Open `<public-ip>:3000/feeds` in your browser will show you the populated list of feeds in JSON format
10. Open `<public-ip>:8000` in another browser tab will show you the frontend with feeds from port 3000

**Note: For Next.js frontend, make sure you stop your Gatsby development terminal because both Gatsby and Next run on the same port 8000. Change directory to `/telescope/src/frontend/next/` , run `npm run dev` and open up `<public-ip>:8000` in a browser**

## Troubleshooting

### Servers didn't shutdown properly?

```
sudo systemctl stop redis
sudo systemctl stop elasticsearch
```

### Ahh I'm getting spammed with

```
warning Error from chokidar (/home/ubuntu/environment/telescope/src/frontend/node_modules/@material-ui/icons): Error: ENOSPC: System limit for number of file watchers reached, watch '/home/ubuntu/environment/telescope/src/frontend/node_modules/@material-ui/icons/index.d.ts'
warning Error from chokidar (/home/ubuntu/environment/telescope/src/frontend/node_modules/@material-ui/icons): Error: ENOSPC: System limit for number of file watchers reached, watch '/home/ubuntu/environment/telescope/src/frontend/node_modules/@material-ui/icons/index.js'
```

It's okay, run

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### But I want to use Docker!!

Please see [environment-setup](environment-setup.md) for Docker instructions and setting up the Docker container for login
