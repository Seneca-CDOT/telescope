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

## Setting up the Telescope repository in AWS EC2:

1. Open up a terminal in Visual Studio Code (hotkey on Windows: `Ctrl + backtick`). You should see that you're logged in as something like `ubuntu@ip-123-23-56-87`.
2. Clone the Telescope repository and name the remote `upstream` by entering

```
git clone -o upstream https://github.com/Seneca-CDOT/telescope.git
```

2. Open the `telescope` directory and the entire Telescope files and folder structure should be visible to you!
