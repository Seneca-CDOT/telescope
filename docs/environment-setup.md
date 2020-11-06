## Environment Setup

### Prerequisites:

- [Node.js (npm)](https://nodejs.org/en/download/)
- [Redis](https://redis.io/) (2 methods)
  - Use [Docker and docker-compose](https://docs.docker.com/install/)
  - Install as a [native application](#Install-Redis-as-a-native-application)
- [Elasticsearch](https://www.elastic.co/what-is/elasticsearch) (3 methods)
  - Use `MOCK_ELASTIC=1` in your `.env` to use a mock in-memory Elastic (useful for local dev)
  - Use [Docker and docker-compose](https://docs.docker.com/install/)
  - Install as a [native application](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

**Important: Both Redis and Elasticsearch must be running in order for Telescope to work. Otherwise, it will crash.**

### Install Redis as a native application

#### Linux:

Install Redis using your distribution's package manager, for example:

- Ubuntu based: `sudo apt install redis`
- Red Hat, Fedora: `sudo dnf install redis`

_Once Redis is installed, you can start it in a terminal by running:_

```
redis-server
```

#### Windows:

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

### Install Elasticsearch as a native application

To install Elasticsearch as a native application, follow the instructions for your OS [here](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

### Docker and Docker-Compose Set Up

#### Linux-Ubuntu

This guide is sourced from the official [Docker-CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and [Docker-Compose](https://docs.docker.com/compose/install/) Installation Documentation.

**Install Docker Engine - Community Edition**

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

**Install Docker-Compose**

12. Run to download the current stable version of Docker-Compose:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

13. Apply executable permissions to the downloaded file: `sudo chmod +x /usr/local/bin/docker-compose`
14. Check installation using: `docker-compose --version`

_NOTE: This will not work on WSL (Windows Subsystem for Linux). Use the approach listed above under WSL._

#### MacOS (Sierra 10.12 or above)

1. Get [Docker for Desktop For Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
1. Docker for Desktop comes with docker-compose installed.

#### Windows 10 Pro, Enterprise, or Education (Hyper-V)

1. Get [Docker for Desktop For Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. Docker for Desktop comes with docker-compose installed.

#### Windows 10 Home, Pro, Enterprise, or Education (Insiders / WSL 2 / Docker)

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

In the root directory, run `cp env.example .env` on Linux/Mac or `copy env.example .env`.

_Note: The `env.example` file has examples commented on top of each variable_

### Now you can start Redis and Elasticsearch without errors using one of the following methods:

_Note: Make sure only one of the below options are used when starting Telescope_

#### Option 1: Using Docker

```
sudo systemctl start docker
docker-compose up --build redis elasticsearch
```

_Note: You may need to add your user to the docker group in Linux to use `docker-compose` without `sudo`. To do this, try `groups $USER` in a terminal and check if docker is in the list of groups. If not, add it with `usermod -aG docker $USER` and reboot._

**Important:** Docker builds Telescope's dependencies at launch and keeps them on disk. In some cases, Docker might try to reuse already-built dependencies or cached data, causing misleading results when testing Telescope. To avoid this, it is recommended to use the command `docker system prune -af --volumes` to remove all already-built Telescope dependencies and ensure fresh deployments.
More information about docker: [images vs containers](https://www.baeldung.com/docker-images-vs-containers) and [volumes](https://docs.docker.com/storage/volumes/).

#### Option 2: Natively installed:

#### Redis:

Run `redis-server`

_Note: If experiencing an error such as `Error starting userland proxy: listen tcp 0.0.0.0:6379: bind: address already in use` when using either option to start Redis. Check if an existing instance of redis is already running (Docker/Native) and stop it before starting another instance_

#### Elasticsearch:

To run Elasticsearch natively, follow the instructions for your OS [here](https://www.elastic.co/guide/en/elastic-stack-get-started/7.6/get-started-elastic-stack.html#install-elasticsearch)

#### Login/SSO (Optional):

This step is only required if you need to login to Telescope or developing/testing requiring a logged in user. Login/SSO can be started by using the command `docker-compose up login`, this will start up a container only for Login/SSO service. For more information on Login please refer to our [Login Document](login.md).

\_Note: Users must have docker and docker-compose installed. Please refer to `Docker and Docker-Compose Set Up` earlier in this document for more information regarding Docker.

### Finally:

Telescope requires a running back-end and front-end to start. The following steps assume you are running the back-end locally. For more information on running the front-end with our staging/production as the back-end, please refer to our [Front-End Document](gatsbyjs.md).

Start the back-end for Telescope, the back-end will start downloading feeds and processing them until stopped. The default port # for the back-end is `3000` and can be modified with the `PORT` variable in the `.env` file. Different routes such as `http://localhost:3000/posts` and
`http://localhost:3000/feeds` now return data:

Run `npm start`

Make sure the `API_URL` variable in the `.env` file is set to the backend port # (default is http://localhost:3000)
Build the front-end for Telescope in a new terminal:

Run `npm run develop`

If using default settings, a front-end should now be available:

Open `localhost:8000`

See [staging-production-deployment](staging-production-deployment) for more information on running Telescope in staging or production mode.

**Note**: If login function is required, `npm run build` must be used instead of `npm run develop`. For more information on test accounts to log into Telescope for development, please refer to section 5 of our [Login Document](login.md):

Open `localhost:3000`

## Frequently Asked Questions (FAQ)

### How do I start Docker daemon?

Make sure to you have docker running on your machine, you can start docker through the following methods

1.  Running the command `sudo dockerd`
2.  Starting the docker application manually
3.  Restarting your machine.

### I followed all the steps by my browser still can't run telescope locally

Try removing the docker images and pulling them again, while you're in the root directory of the project

1.  `docker system prune -af` will delete the containers
2.  `docker-compose up <services_here>` will pull the containers and start them up

### Cannot find cgroup mount destination

This could be an issue with WSL2 in Windows 10. You can resolve it by:

1.  `sudo mkdir /sys/fs/cgroup/systemd`
2.  `sudo mount -t cgroup -o none,name=systemd cgroup /sys/fs/cgroup/systemd`
