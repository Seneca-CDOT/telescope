# Setting up Telescope to SSH into AWS EC2

The following will show you how to create and connect to a virtual machine (VM) on AWS using the Visual Studio Code [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension. You'll be able to run Telescope in development on a remote machine with VS Code just like if the source code was local. This documentation is based on [Remote development over SSH](https://code.visualstudio.com/docs/remote/ssh-tutorial)

**Disclaimer**: The EC2 instance used in this guide is not within AWS's Free-Tier so please see [EC2 Pricing](https://aws.amazon.com/ec2/pricing/on-demand/) to see if you're comfortable with these costs. Running Docker in development is CPU intensive so these are the EC2 instances I recommend:

- Minimum: `t2.medium (4 GiB RAM + 2 vCPU)`
- Recommended: `t2.large (8 GiB RAM + 2 vCPU)`

**Summary of Pricing**:

- t2.medium costs \$0.0464 per hour
- t2.large costs \$0.0928 per hour
- 30GB Amazon Elastic Block Storage (EBS) costs \$3 per month

**Cost Estimate Per Month**:

|                 | t2.medium | t2.large |
| --------------- | --------- | -------- |
| Cost per hour   | \$0.0464  | \$0.0928 |
| Hours per day   | 8         | 8        |
| Days per month  | 30        | 30       |
| Sub-total       | \$11.14   | \$22.27  |
| 30GB EBS Volume | \$3       | \$3      |
| Total           | \$14.14   | \$25.27  |

## Prerequisites:

- Download and install [Visual Studio Code](https://code.visualstudio.com/download)
- Install the [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension
- Create an [AWS Account](https://aws.amazon.com/). You can watch this [part](https://www.youtube.com/watch?v=3hLmDS179YE&t=10552s) of the AWS Certified Cloud Practitioner course on creating an account if you need help.
- Create an IAM user with administrative privileges. You will need your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- Sign into your AWS Account using your IAM user

## Create your virtual machine (AWS EC2):

1. In the upper-right hand corner of your AWS Management Console, select a region. In this tutorial, `US East (Ohio) us-east-2` as your `Region`
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/aws-cloud9/2021-10-26+09_08_11-.png)
2. In the upper-left hand corner of your AWS Management Console, click on `Services`. This will bring up a list of AWS Services, search for `EC2`
3. Click on `Launch instances`

- Step 1 - Choose an Amazon Machine Image (AMI): `Ubuntu Server 20.04 LTS (HVM), SSD Volume Type`
  ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+12_47_51-vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)
- Step 2 - Choose an Instance Type: `t2.medium`
  ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+12_49_07-vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)
- Step 3 - Configure Instance Details: Accept the defaults and proceed to the next step
- Step 4 - Add Storage: Change the Size (GiB) from `8` to `20`
  ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+12_51_25-vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)
- Step 5 - Add Tags: No tags are needed. Proceed to the next step.
- Step 6 - Configure Security Group:

  - Assign a security group: `Create a new security group`
  - Security group name: `telescope-sg`
  - Add the following Rules:
    1. SSH for your IP address
    - Type: `SSH`
    - Protocol: `TCP`
    - Port Range: `22`
    - Source: `My IP` (When you select this from the dropdown menu, it will automatically put `<your-ip-address>/32` in the field. For example `76.72.29.150/32`)
    2. Open port 3000 for your IP address
    - Type: `Custom TCP`
    - Protocol: `TCP`
    - Port Range: `3000`
    - Source: `My IP`
    3. Open port 8000 for your IP address
    - Type: `Custom TCP`
    - Protocol: `TCP`
    - Port Range: `8000`
    - Source: `My IP`
    4. Open port 8000 for your IP address
    - Type: `Custom TCP`
    - Protocol: `TCP`
    - Port Range: `8443`
    - Source: `My IP`

  ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+12_54_12-vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)

4. Click on `Review and Launch`. You will get a warning: `Your instance configuration is not eligible for the free usage tier`, this is because we're using a `t2.medium` instance type.
5. Click on `Launch`
6. In the pop-up, choose `Create a new key pair`

- Key pair type: `RSA`
- Key pair name: `telescope-dev-key`

7. Click on `Download Key Pair`
8. If you're using Windows, save the file in the `.ssh` directory in your user profile folder (for example `C:/Users/cindy/.ssh/`)
9. Click on `Launch Instances`
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+12_57_01-Launch+instance+wizard+_+EC2+Management+Console+%E2%80%94+Mozilla+Firefox.png)

It will take a few minutes for AWS to launch your new EC2 instance.

10. Once your EC2 instance has been launched, you should name it something meaningful like `Telescope-Dev` and you can find your EC2 instance's public IPv4 address. Make note of this IP address.
    ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+14_05_35-Preview+vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)

## Connect using SSH

1. Open up Visual Studio Code
2. Click on the `Open a Remote Window` icon at the bottom left-hand corner of the window
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_11_22-.png)
3. Select `Connect to Host`
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_12_53-Get+Started+-+Visual+Studio+Code.png)
4. Select `Configure SSH Hosts...`
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_14_34-Visual+Studio+Code.png)
5. This will open up a `config` file in Visual Studio Code. If you're using Windows, it'll be something like `C:/Users/cindy/.ssh/config`
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_15_09-Visual+Studio+Code.png)

6. Edit the `config` file with the following:

```
Host aws-ec2
    HostName <your-ec2-ip-address>
    User ubuntu
    IdentityFile ~/.ssh/telescope-dev-key.pem
```

![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+14_02_31-config+-+telescope+-+Visual+Studio+Code.png)

7. Save the file
8. When you click on the `Open a Remote Window` icon at the bottom left-hand corner again and choose `Connect to Host`, you will see `aws-ec2` listed.
9. Select `aws-ec2` and a new Visual Studio Code window will open.
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_23_08-config+-+Visual+Studio+Code.png)
10. You will see `"aws-ec2" has fingerprint "SHA256:xxx"` and `Are you sure you want to continue?`. Click on `Continue`. Then You should see that you're connected!
    ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_56_54-Get+Started+-+Visual+Studio+Code.png)
    ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+13_58_26-.png)

## Setting up your AWS credentials

1. Open up a terminal in Visual Studio Code (hotkey on Windows: `Ctrl + backtick`). You should see that you're logged in as something like `ubuntu@ip-172.31.23.4`.

2. Install `unzip`. We will need this to install the AWS CLI

```
$ sudo apt install unzip
```

3. Install the latest version of the AWS CLI

```
$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

4. Verify the AWS CLI installation

```
$ aws --version

aws-cli/2.3.0 Python/3.8.8 Linux/5.4.0-1045-aws exe/x86_64.ubuntu.20 prompt/off
```

5. Remove the `awscliv2.zip` file and `aws` directory

```
rm awscliv2.zip
rm -rf aws
```

6. Configure your AWS credentials

```
aws configure
```

7. Currently, everything is set as None so enter your credentials for your AWS IAM user.

```
AWS Access Key ID [None]: ****************764G
AWS Secret Access Key [None]: ****************qBbe
Default region name [None]: us-east-2
Default output format [None]:
```

## Installing Docker and Docker-Compose

### Install Docker Engine - Community Edition

1. Update the apt package index:

```
sudo apt-get update
```

2. Install packages to allow apt to use a repository over HTTPS:

```
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

3. Add Docker’s official GPG key:

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

5. Use the following command to set up the stable repository:

```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

6. Update the apt package index again:

```
sudo apt-get update
```

7. Install the latest version of Docker Engine community:

```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

8. Add your user to the Docker group ([source](https://docs.docker.com/install/linux/linux-postinstall/)):

```
sudo usermod -aG docker $USER
```

9. Activate the changes to groupss

```
newgrp docker
```

10. Now run docker as a service on your machine, on startup:

- Enable docker on startup: `sudo systemctl enable docker`
- Disable docker on startup: `sudo systemctl disable docker`

### Install Docker-Compose

1. Run to download the current stable version of Docker-Compose:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. Apply executable permissions to the downloaded file:

```
sudo chmod +x /usr/local/bin/docker-compose
```

3. Check installation using:

```
$ docker-compose --version

docker-compose version 1.29.2, build 5becea4c
```

## Install Node.js

1. Install Node.js 16.x

```
$ curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

1. Install pnpm

```bash
npm install -g pnpm
```

2. Verify installation

```
$ node -v
v16.12.0

$ pnpm -v
6.23.2
```

## Setting up the Telescope repository in AWS EC2:

1. Clone the Telescope repository and name the remote `upstream` by entering

```
git clone -o upstream https://github.com/Seneca-CDOT/telescope.git
```

2. Open the `telescope` directory and the entire Telescope files and folder structure should be visible to you!
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+16_54_04-Settings.png)
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+16_55_08-Visual+Studio+Code.png)

3. Set all the necessary environment variables in your .env file to contain your EC2 instance's public IPv4 address by executing the `aws-ip.sh` script

```
sh ./tools/aws-ip.sh
```

### If you did everything correctly, you've completed the environment setup!

## Now to get started with development...

1. Install all dependencies

```
pnpm install
```

2. Start all Telescope services. This will take some time to complete

```
docker-compose --env-file .env up -d
```

3. Start the Telescope development server on Port 3000

```
pnpm start
```

4. Find your EC2 instance's public IPv4

```
$ curl -s http://169.254.169.254/latest/meta-data/public-ipv4

35.174.16.133
```

5. Open `<public-ip>:8000` browser tab to see Telescope running on a AWS Cloud9 environment!

6. Open `<public-ip>:3000/feeds` in another browser tab to see all the feeds in the backend

7. Open `<public-ip>:8443/v1/<microservice-port>` in another browser tab to see the microservices. For example `35.174.16.133:8443/v1/posts`

![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+17_10_36-Telescope+%E2%80%94+Mozilla+Firefox.png)

## Frequently Asked Questions (FAQ)

### How do I stop my docker containers?

```
pnpm services:stop
```

### How do I delete my docker containers?

```
docker system prune -af --volumes
```

### I get `Permission denied` error when I run `docker-compose --env-file .env up -d`

Sometimes the Docker permissions aren't set properly when you first install Docker. You may need to reboot your VM or run

```
newgrp docker
```

### I can't open <EC2-ip>:8000 running, what could I be doing wrong?

1. If you have a VPN on, turn it off and get your IP address by visiting [http://checkip.amazonaws.com/](http://checkip.amazonaws.com/) then allow your IP address to access the ports 3000 and 8000.

2. AWS may change your EC2 instance IP address when you stop or restart your EC2 instance. One solution is to purchase an [Elastic IP address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#eip-basics) to reserve the particular public IP address. However, you can just clean out the `env.remote` and `.env` files and run the `./tools/aws-ip.sh` script again to set your new EC2 IP address in the appropriate environment variables. Just remember to use the new EC2 IP address in the browser as well.

### I can't SSH into my EC2 instance

1. Same reason as above, your EC2 instance IP address may change when you stop or restart your EC2 instance. So make sure your `.ssh/config` file has the correct HostName
2. If your own IP address changes (for example, you changed internet providers or you moved to a new location with a different IP address), you need to update your inbound rules to allow your IP address to access port 22. Don't forget to allow access to port 3000 and 8000 as well.

### How do I turn off my EC2 instance if I'm actively not using it?

There are a number of different methods to stop an EC2 instance:

1. Manually turning it off using the AWS Console
   ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+17_35_32-vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)

2. Creating a Cloudwatch alarm to stop your EC2 instance for you after some inactivity
   - Click on the `+` underneath `Alarm status` to start creating an alarm
     ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+17_49_53-vscode-ssh.md+-+telescope+-+Visual+Studio+Code.png)
   - Click on `Create an alarm` radio button
     ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+17_50_43-Manage+CloudWatch+alarms+_+EC2+Management+Console+%E2%80%94+Mozilla+Firefox.png)
   - Set `Alarm action` to `Stop`
   - Set alarm to trigger if the CPU utilization of the EC2 instance has been less 25% for an hour
     ![](https://seneca-cdot-telescope.s3.amazonaws.com/vscode-ssh/2021-10-26+17_52_37-Manage+CloudWatch+alarms+_+EC2+Management+Console+%E2%80%94+Mozilla+Firefox.png)
