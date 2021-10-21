# Environment Setup

#### Table of Contents

[Prerequisites](#prerequisites)

- [Install Redis as a native application](#install-redis-as-a-native-application)
  - [Linux](#linux)
  - [Windows](#windows)
    - [Option 1: Using WSL2 Windows Subsystem Linux](#option-1-using-wsl2-windows-subsystem-linux)
    - [Option 2: Using Chocolatey package manager](#option-2-using-chocolatey-package-manager)
- [Install Elasticsearch as a native application](#install-elasticsearch-as-a-native-application)
- [Docker and Docker-Compose Setup](#docker-and-docker-compose-setup)
  - [Linux-Ubuntu](#linux-ubuntu)
    - [Install Docker Engine (Community Edition)](#install-docker-engine-community-edition)
    - [Install Docker-Compose](#install-docker-compose)
  - [MacOS (Sierra 10.12 or above)](#macos-sierra-10-12-or-above)
  - [Windows 10 Pro, Enterprise, or Education (Hyper-V)](#windows-10-pro-enterprise-or-education-hyper-v)
  - [Windows 10 Home, Pro, Enterprise or Education (Insiders / WSL 2 / Docker)](#windows-10-home-pro-enterprise-or-education-insiders-wsl-2-docker)
- [After installing the prerequisites:](#after-installing-the-prerequisites)

  - [Start Docker](#start-docker)
  - [Start Telescope](#start-telescope)

    - [Option 1: Run frontend and backend microservices locally](#option-1-run-frontend-and-backend-microservices-locally)
    - [Option 2: Run frontend only](#option-2-run-frontend-only)
    - [Option 3: Mix and match services between local and staging](#option-3-mix-and-match-services-between-local-and-staging)
    - [Option 4: Run microservices individually](#option-4-run-microservices-individually)
    - [Option 5: Update Docker image(s) after changes](#option-5-update-docker-images-after-changes)
    - [Option 6: Run Login/SSO](#option-6-run-login-sso)

- [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
  - [How do I start Docker Daemon?](#how-do-i-start-docker-daemon)
  - [I followed all the steps but my browser still can't run Telescope locally](#i-followed-all-the-steps-but-my-browser-still-cant-run-telescope-locally)
  - [`Cannot find cgroup mount destination` error](#cannot-find-cgroup-mount-destination-error)
  - [`Malformed input, repository not added` message while installing Docker on Linux Mint](#malformed-input-repository-not-added-message)

## Prerequisites:

- [Node.js (npm)](https://nodejs.org/en/download/)
- [Redis](https://redis.io/) (2 methods)
  - Use [Docker and docker-compose](https://docs.docker.com/install/)
  - Install as a [native application](#Install-Redis-as-a-native-application)
- [Elasticsearch](https://www.elastic.co/what-is/elasticsearch) (3 methods)
  - Use `MOCK_ELASTIC=1` in your `.env` to use a mock in-memory Elastic (useful for local dev)
  - Use [Docker and docker-compose](https://docs.docker.com/install/)
  - Install as a [native application](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

**Important: Both Redis and Elasticsearch must be running in order for Telescope to work. Otherwise, it will crash.**

## Install Redis as a native application

### Linux:

Install Redis using your distribution's package manager, for example:

- Ubuntu based: `sudo apt install redis`
- Red Hat, Fedora: `sudo dnf install redis`

_Once Redis is installed, you can start it in a terminal by running:_

```
redis-server
```

### Windows:

There are two methods to install Redis on Windows. We strongly recommend the first approach.

##### Option 1: Using [WSL2 (Windows Subsystem Linux)](https://docs.microsoft.com/en-us/windows/wsl/about)

1. Follow Microsoft WSL2 [installation guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to complete the installation
2. Depending on the distribution you chose for WSL2, install redis using that distro's package manager. For example, if using Ubuntu, run `sudo apt-get install redis`
3. Suggest to install [Windows Terminal](https://docs.microsoft.com/en-us/windows/wsl/install-win10#install-windows-terminal-optional), it facilitates you to switch directories between WSL2 Ubuntu bash and Windows drive

##### Option 2: Using [Chocolatey package manager](https://chocolatey.org/) to install Redis on Windows

To get Chocolatey, simply follow this [guide](https://chocolatey.org/install) and run the following commands:

1. To install Redis: `choco install redis-64 -v`
1. To set Redis as a windows service: `redis-server --service-install`
1. To start Redis: `redis-server --service-start`
1. To check if running and display server information: `redis-cli info`

## Install Elasticsearch as a native application

To install Elasticsearch as a native application, follow the instructions for your OS [here](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

## Docker and Docker-Compose Setup

### Linux-Ubuntu

This guide is sourced from the official [Docker-CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and [Docker-Compose](https://docs.docker.com/compose/install/) Installation Documentation.

#### Install Docker Engine (Community Edition)

1. Update the apt package index: `sudo apt-get update`
2. Install packages to allow apt to use a repository over HTTPS:

```
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

3. Add Docker’s official GPG key: `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
4. Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88, by searching for the last 8 characters of the fingerprint: `sudo apt-key fingerprint 0EBFCD88`
5. Use the following command to set up the stable repository:

```
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

6. Update the apt package index again: `sudo apt-get update`
7. Install the latest version of Docker Engine community: `sudo apt-get install docker-ce docker-ce-cli containerd.io`
8. Add yourself to the Docker group ([source](https://docs.docker.com/install/linux/linux-postinstall/)):
   1. Create the Docker group: `groupadd docker`
   1. Add your user to the group: `sudo usermod -aG docker $USER`
   1. Log out and log back in (you may have to restart if you are running through a virtual machine)
9. Verify your installation by running `docker run hello-world`. This should print a hello world paragraph that includes a confirmation that Docker is working on your system.
   _NOTE: This may cause errors if you have already tried to run docker before. If you get errors then run the following commands to reset it:_

```
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R
```

11. Now run docker as a service on your machine, on startup:
    1. Enable docker on startup: `sudo systemctl enable docker`
    1. Disable docker on startup: `sudo systemctl disable docker`

#### Install Docker-Compose

12. Run to download the current stable version of Docker-Compose:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

13. Apply executable permissions to the downloaded file: `sudo chmod +x /usr/local/bin/docker-compose`
14. Check installation using: `docker-compose --version`

_NOTE: This will not work on WSL (Windows Subsystem for Linux). Use the approach listed above under WSL._

### MacOS (Sierra 10 12 or above)

1. Get [Docker for Desktop For Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
1. Docker for Desktop comes with docker-compose installed.

### Windows 10 Pro, Enterprise, or Education (Hyper-V)

1. Get [Docker for Desktop For Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. Docker for Desktop comes with docker-compose installed.

### Windows 10 Home, Pro, Enterprise, or Education (Insiders WSL 2 Docker)

1. If your [Windows build number](https://www.windowscentral.com/how-check-your-windows-10-build) is below [18917](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install/), join the [insiders program](https://insider.windows.com/en-us/). Then, update your machine to a newer build through Automatic Updates.
2. Once installed successfully, install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install).
3. Open a Windows PowerShell window for the next few commands.
4. Leverage the command `wsl --set-default-version 2`, and install Ubuntu from the Windows Store.
5. Use `wsl -l -v` to see your Ubuntu instance version, if it's still using WSL version 1, convert it to WSL 2 using `wsl --set-version Ubuntu 2`.
6. Install any other prerequisites listed on [Docker Desktop WSL Preview](https://docs.docker.com/docker-for-windows/wsl-tech-preview/).
7. Download and install [Docker Desktop Edge Latest](https://download.docker.com/win/edge/Docker%20Desktop%20Installer.exe)
8. Follow the instructions on the [Docker Desktop WSL Preview](https://docs.docker.com/docker-for-windows/wsl-tech-preview/) to configure the WSL based engine. Docker-compose is installed with the Docker desktop application.
9. Follow the Docker commands `docker-compose up --build` listed below in greater detail to start hacking.

## After installing the prerequisites:

### Start Docker

```bash
sudo systemctl start docker
```

_Note: You may need to add your user to the docker group in Linux to use `docker-compose` without `sudo`. To do this, try `groups $USER` in a terminal and check if docker is in the list of groups. If not, add it with `usermod -aG docker $USER` and reboot._

**Important:** Docker builds Telescope's dependencies at launch and keeps them on disk. In some cases, Docker might try to reuse already-built dependencies or cached data, causing misleading results when testing Telescope. To avoid this, it is recommended to use the command `docker system prune -af --volumes` to remove all already-built Telescope dependencies and ensure fresh deployments.
More information about docker: [images vs containers](https://www.baeldung.com/docker-images-vs-containers) and [volumes](https://docs.docker.com/storage/volumes/).

### Start Telescope

There are different ways to run the application. By default, [env.development](../config/env.development) will be used. Please read the use cases below to find out what configuration you need to make for different scenarios.

There are also [env.production](../config/env.production) and [env.staging](../config/env.staging) to choose based on developer's need. For example, if you want to use staging, you can do `cp ./config/env.staging ./.env` on Linux/macOS, or `copy config/env.staging .env` on windows.

Here are instructions for different scenarios:
_Note: Make sure you're running these commands in the root of telescope project. If any of the commands below are failing, use the command `pwd` to find your current directory and navigate back to project root (e.g., `cd <the path of directory you place telescope project>/telescope`)_

#### Option 1: Run frontend and backend microservices locally

This is the default setting, you do not need to copy or modify any `env` file.

```bash
npm run services:start

npm run dev
```

Microservices will start downloading feeds and processing them until stopped. For more information about the services, please read [Telescope API Services](../src/api/readme.md).

If this doesn't work for you, it is possible that you have an old `.env` file in the root that you copied from `env.example` from telescope 1.0. Please remove it, and try again.

#### Option 2: Run frontend only

```bash
cp config/env.staging .env

npm run dev
```

This will provide you staging back-end without running it locally.

#### Option 3: Mix and match services between local and staging

See [staging-production-deployment](staging-production-deployment) for more information on running Telescope in staging or production mode.

This one depends on which part you're working with. For example, if you want to work with authorization, you need to specify the URL of AUTH in your `.env` file by going to `.env` and modifying `AUTH_URL=...` and modify it to the one you want to work with. If you're testing auth locally, use `AUTH_URL=http://localhost/v1/auth`; otherwise, use the staging one, `AUTH_URL=http://dev.api.telescope.cdot.systems/v1/auth`.

After modify the `.env` file, run these commands,

```bash
npm run services:start

npm run dev
```

#### Option 4: Run microservices individually

`npm run services:start auth` or `npm run services:start image` or `npm run services:start posts`

#### Option 5: Update Docker image(s) after changes

Run the following commands to rebuild the image(s):

```bash
npm run services:clean
npm run services:start
```

#### Option 6: Run Login SSO

If you need to login to Telescope or your work requires logging in for testing purposes, you don't need to start an extra container for login, it is included in auth service. You can simply use UI to login. For more information on Login please refer to our [Login Document](login.md).

## Frequently Asked Questions (FAQ)

### How do I start Docker Daemon?

Make sure to you have (docker)[https://docs.docker.com/engine/reference/commandline/dockerd/] running on your machine, you can start docker through the following methods:

1.  Running the command `sudo dockerd`
2.  Starting the docker application manually
3.  Restarting your machine.

You can check out the docker daemon cli through this link (here)[https://docs.docker.com/engine/reference/commandline/dockerd/)

### I followed all the steps but my browser still can't run telescope locally

Try removing the docker images and pulling them again, while you're in the root directory of the project

1.  `docker system prune -af` will delete the containers
2.  `docker-compose up <services_here>` will pull the containers and start them up

### 'Cannot find cgroup mount destination' error

This could be an issue with WSL2 in Windows 10. You can resolve it by:

1.  `sudo mkdir /sys/fs/cgroup/systemd`
2.  `sudo mount -t cgroup -o none,name=systemd cgroup /sys/fs/cgroup/systemd`

### 'Malformed input, repository not added' message

If you received this error While installing Docker on Linux Mint. The command below might not work on certain Linux distributions.

```
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

If you receive the error message "Malformed input, repository not added" after running this command, please try the below steps instead:

1. run `sudo nano /etc/apt/sources.list.d/addtional-repositories.list`
2. paste `deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable` to the file, save it, and exit.
3. run `sudo add-apt-repository deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable`

### **Alternatively, you can set up an AWS Cloud9 IDE environment if none of the above worked for you. Please see our [AWS Cloud9 IDE Setup documentation](/docs/aws-cloud9.md) for more information.**
