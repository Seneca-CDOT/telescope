## AWS Cloud9 IDE Setup

**Disclaimer**: Amazon Web Services offers a [Free-Tier](https://aws.amazon.com/free/) and this doc will help you set up a Cloud9 environment using the free-tier services but please be aware that you may incur costs if you go out of the free-tier offerings.

### Prerequisites:

- Create an [AWS Account](https://aws.amazon.com/). You can watch this [part](https://www.youtube.com/watch?v=3hLmDS179YE&t=10552s) of the AWS Certified Cloud Practitioner course on creating an account if you need help.
- Sign into your AWS Account

### Creating your Cloud9 Environment

1. In the upper-right hand corner of your AWS Management Console, select `US East (N. Virginia) us-east-1` as your `Region`
2. In the upper-left hand corner of your AWS Management Console, click on `Services`. This is bring up a list of AWS Services, search for `Cloud9`.
3. Click on `Create Environment`

- Step 1 - Name environment:

  Name: `Telescope-Dev` (whatever you want)

  Description (optional):

- Step 2 - Configure settings:

  Environment type: `Create a new EC2 instance for environment (direct access)`

  Instance type: `t2.micro (1 GiB RAM + 1 vCPU)`

  Platform: `Ubuntu Server 18.04 LTS`

- Step 3 - Review and click `Create Environment`

### Installing Redis as a native application

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

#### Verifying Redis installation

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

### Installing Elasticsearch as a native application

```
curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.6.2-amd64.deb
sudo dpkg -i elasticsearch-7.6.2-amd64.deb
```

[Source](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

### Setting up Telescope in your Cloud9 IDE

1. Clone the Telescope repository and name the remote `upstream` by entering `git clone -o upstream https://github.com/Seneca-CDOT/telescope.git` in the terminal
2. Change to the telescope directory `cd telescope`

### Troubleshooting

#### Running out of storage?

Check first using `df -h` in the terminal

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1      9.7G  8.4G  1.3G  88% /
```

When you first create an EC2 instance, it has an EBS Volume of 10GB. To increase it to 20GB, create a new file called `resize.sh` in `~/environment` directory and copy the following script:

```
#!/bin/bash

# Specify the desired volume size in GiB as a command-line argument. If not specified, default to 20 GiB.
SIZE=${1:-20}

# Get the ID of the environment host Amazon EC2 instance.
INSTANCEID=$(curl http://169.254.169.254/latest/meta-data//instance-id)

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

if [ $(readlink -f /dev/xvda) = "/dev/xvda" ]
then
  # Rewrite the partition table so that the partition takes up all the space that it can.
  sudo growpart /dev/xvda 1

  # Expand the size of the file system.
  sudo resize2fs /dev/xvda1

else
  # Rewrite the partition table so that the partition takes up all the space that it can.
  sudo growpart /dev/nvme0n1 1

  # Expand the size of the file system.
  sudo resize2fs /dev/nvme0n1p1
fi
```

Execute the script by running `sh resize.sh` in the terminal

Verify size change with `df -h` again

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1       20G  8.5G   11G  44% /
```
