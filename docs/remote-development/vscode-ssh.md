# Setting up Telescope to SSH into AWS EC2

The following will show you how to create and connect to a virtual machine (VM) on AWS using the Visual Studio Code [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension. You'll be able to run Telescope in development on a remote machine with VS Code just like if the source code was local. This documentation is based on [Remote development over SSH](https://code.visualstudio.com/docs/remote/ssh-tutorial)

## Prerequisites:

- Download and install [Visual Studio Code](https://code.visualstudio.com/download)
- Install the [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension
- Create an [AWS Account](https://aws.amazon.com/). You can watch this [part](https://www.youtube.com/watch?v=3hLmDS179YE&t=10552s) of the AWS Certified Cloud Practitioner course on creating an account if you need help.
- Sign into your AWS Account

## Create your virtual machine (AWS EC2):

1. In the upper-right hand corner of your AWS Management Console, select `US East (Ohio) us-east-2` as your `Region`
2. In the upper-left hand corner of your AWS Management Console, click on `Services`. This will bring up a list of AWS Services, search for `EC2`
3. Click on `Launch instances`

- Step 1 - Choose an Amazon Machine Image (AMI): `Ubuntu Server 18.04 LTS (HVM), SSD Volume Type`
- Step 2 - Choose an Instance Type: `t2.medium`
- Step 3 - Configure Instance Details: Accept the defaults and proceed to the next step
- Step 4 - Add Storage: Change the Size (GiB) from `8` to `20`
- Step 5 - Add Tags: No tags are needed. Proceed to the next step.
- Step 6 - Configure Security Group:
  Type: `SSH`
  Protocol: `TCP`
  Port Range: `22`
  Source: `My IP` (When you select this from the dropdown menu, it will automatically put `<your-ip-address>/32` in the field. For example `76.72.29.150/32`)

4. Click on `Launch`
5. In the pop-up, choose `Create a new key pair`

- Key pair type: `RSA`
- Key pair name: `telescope-dev-key`

6. Click on `Download Key Pair`
7. If you're using Windows, save the file in the `.ssh` directory in your user profile folder (for example `C:/Users/cindy/.ssh/`)
8. Click on `Launch Instances`

It will take a few minutes for AWS to launch your new EC2 instance.

## Get your EC2's Public IPv4 address

Once your EC2 instance has been launched, you can find your EC2 instance's public IPv4 address. Make note of this IP address.

## Connect using SSH

1. Open up Visual Studio Code
2. Click on the `Open a Remote Window` icon at the bottom left-hand corner of the window
3. Select `Connect to Host`
4. Select `Configure SSH Hosts...`

This will open up a `config` file in Visual Studio Code. If you're using Windows, it'll be something like `C:/Users/cindy/.ssh/config`

5. Edit the `config` to the following:

```
Host aws-ec2
    HostName <your-ec2-ip-address>
    Username ubuntu
    IdentityFile ~/.ssh/telescope-dev-key.pem
```

6. Save the file
7. When you click on the `Open a Remote Window` icon at the bottom left-hand corner again and choose `Connect to Host`, you will see `aws-ec2` listed.
8. Select `aws-ec2` and a new Visual Studio Code window will open. You should also see that you're connected as well!

## Setting up your AWS credentials and opening the ports on our EC2 instance:

1. Open up a terminal in Visual Studio Code (hotkey on Windows: `Ctrl + backtick`). You should see that you're logged in as something like `ubuntu@ip-123-23-56-87`.

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
aws --version
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

AWS Access Key ID [None]:
AWS Secret Access Key [None]:
Default region name [None]:
Default output format [None]:

2. Firstly, we'll need the MAC address of our EC2 instance

```
$ curl -s http://169.254.169.254/latest/meta-data/mac

0e:0a:22:87:46:79
```

3. Using your EC2 instance's MAC address, we can get a list of Security Groups

```
$ curl -s http://169.254.169.254/latest/meta-data/network/interfaces/macs/<your_mac>/security-group-ids

sg-0c63c6f026a2b9288
```

4. Find out what your IP address is using http://checkip.amazonaws.com/
5. You will need to authorize your IP address access to port 3000 and port 8000

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
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R
```

9. Now run docker as a service on your machine, on startup:
   1. Enable docker on startup: `sudo systemctl enable docker`
   1. Disable docker on startup: `sudo systemctl disable docker`

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
docker-compose --version
```

## Setting up the Telescope repository in AWS EC2:

1. Clone the Telescope repository and name the remote `upstream` by entering

```
git clone -o upstream https://github.com/Seneca-CDOT/telescope.git
```

2. Open the `telescope` directory and the entire Telescope files and folder structure should be visible to you!

3. Set all the necessary environment variables in your env.remote file to contain your EC2 instance's public IPv4 address by executing the `aws-ip.sh` script

```
sh ./tools/aws-ip.sh
```

4. Copy env.remote to .env

```
cp config/env.remote .env
```
