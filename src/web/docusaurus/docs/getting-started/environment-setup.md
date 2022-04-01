---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Environment Setup

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [Docker and Docker-Compose](https://docs.docker.com/install/)

## Install pnpm

We use `pnpm` instead of `npm` to install packages. `pnpm` is faster and uses less disk space when installing `node_modules` ([More on the benefits of pnpm](https://pnpm.io/motivation)).

After installing Node.js, install `pnpm` globally:

```bash
npm install -g pnpm
```

## Docker and Docker-Compose Setup

<Tabs className="unique-tabs">
  <TabItem value="windows" label="Windows">

### Windows

#### Install WSL2 (Recommended)

1. Follow Microsoft WSL2 [installation guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to complete the installation. Suggest to run the following once in the WSL2 environment.

```bash
# fetch updated packages information
sudo apt update

# upgrade or install outdated packages
sudo apt upgrade
```

2. Suggest to install [Windows Terminal](https://docs.microsoft.com/en-us/windows/wsl/install-win10#install-windows-terminal-optional), it facilitates you to switch directories between WSL2 Ubuntu bash and Windows drive.
3. Suggest to install [Node, nvm and npm for WSL2](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm), so as to be able to use Node and npm in the subsystem.

#### Windows 10 Pro, Enterprise, Education or Windows 11 (Hyper-V)

1. Get [Docker for Desktop For Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. Docker for Desktop comes with docker-compose installed.

#### Windows 10 Home, Pro, Enterprise, Education (Insiders WSL 2 Docker)

1. If your [Windows build number](https://www.windowscentral.com/how-check-your-windows-10-build) is below [18917](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install/), join the [insiders program](https://insider.windows.com/en-us/). Then, update your machine to a newer build through Automatic Updates.
2. Once installed successfully, install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install).
3. Open a Windows PowerShell window for the next few commands.
4. Leverage the command `wsl --set-default-version 2`, and install Ubuntu from the Windows Store.
5. Use `wsl -l -v` to see your Ubuntu instance version, if it's still using WSL version 1, convert it to WSL 2 using `wsl --set-version Ubuntu 2`.
6. Install any other prerequisites listed on [Docker Desktop WSL Preview](https://docs.docker.com/docker-for-windows/wsl-tech-preview/).
7. Download and install [Docker Desktop Edge Latest](https://download.docker.com/win/edge/Docker%20Desktop%20Installer.exe)
8. Follow the instructions on the [Docker Desktop WSL Preview](https://docs.docker.com/docker-for-windows/wsl-tech-preview/) to configure the WSL based engine. Docker-compose is installed with the Docker desktop application.
9. Follow the Docker commands `docker-compose up --build` listed below in greater detail to start hacking.

---

  </TabItem>
  <TabItem value="macOS" label="macOS">

### MacOS

1. Get [Docker for Desktop For Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) (macOS 10.15 or above)

1. Docker for Desktop comes with docker-compose installed.

---

  </TabItem>
  <TabItem value="linux" label="Linux">

### Linux-Ubuntu

This guide is sourced from the official [Docker-CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and [Docker-Compose](https://docs.docker.com/compose/install/) Installation Documentation.

#### Install Docker Engine (Community Edition)

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

4. Use the following command to set up the stable repository:

```
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

5. Update the apt package index again:

```
sudo apt-get update
```

6. Install the latest version of Docker Engine community:

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

11. Verify your installation by running `docker run hello-world`. This should print a hello world paragraph that includes a confirmation that Docker is working on your system.

:::note

This may cause errors if you have already tried to run docker before. If you get errors then run the following commands to reset it

:::

#### Install Docker-Compose

12. Run to download the current stable version of Docker-Compose:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

13. Apply executable permissions to the downloaded file:

```
sudo chmod +x /usr/local/bin/docker-compose
```

14. Check installation using:

```
docker-compose --version
```

:::note

This will not work on WSL (Windows Subsystem for Linux). Use the approach listed above under WSL.

:::

#### Start Docker

```bash
sudo systemctl start docker
```

_Note: You may need to add your user to the docker group in Linux to use `docker-compose` without `sudo`. To do this, try `groups $USER` in a terminal and check if docker is in the list of groups. If not, add it with `usermod -aG docker $USER` and reboot._

**Important:** Docker builds Telescope's dependencies at launch and keeps them on disk. In some cases, Docker might try to reuse already-built dependencies or cached data, causing misleading results when testing Telescope. To avoid this, it is recommended to use the command `docker system prune -af --volumes` to remove all already-built Telescope dependencies and ensure fresh deployments.
More information about docker: [images vs containers](https://www.baeldung.com/docker-images-vs-containers) and [volumes](https://docs.docker.com/storage/volumes/).

---

  </TabItem>
</Tabs>

<!-- ### MacOS (Sierra 10 12 or above) -->

<!-- 1. Get [Docker for Desktop For Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) -->
<!-- 1. Docker for Desktop comes with docker-compose installed. -->

## After installing the prerequisites

### Install Dependencies with pnpm

`pnpm` functions similarly to `npm` but there are some differences in how [packages are installed](https://pnpm.io/cli/install), [added to package.json](https://pnpm.io/cli/add), etc. You can read the [docs](https://pnpm.io/pnpm-cli) for full details.

To install all of Telescope's dependencies, use the following command:

```bash
pnpm install
```

Similarly, to run tests:

```bash
pnpm test
```

And to run scripts:

```bash
pnpm <script-name>
```

### Start Docker

```bash
sudo systemctl start docker
```

:::note

You may need to add your user to the docker group in Linux to use `docker-compose` without `sudo`. To do this, try `groups $USER` in a terminal and check if docker is in the list of groups. If not, add it with `usermod -aG docker $USER` and reboot.

:::

:::caution Important

Docker builds Telescope's dependencies at launch and keeps them on disk. In some cases, Docker might try to reuse already-built dependencies or cached data, causing misleading results when testing Telescope. To avoid this, it is recommended to use the command `docker system prune -af --volumes` to remove all already-built Telescope dependencies and ensure fresh deployments. More information about docker: [images vs containers](https://www.baeldung.com/docker-images-vs-containers) and [volumes](https://docs.docker.com/storage/volumes/).

:::

### Start Telescope

There are different ways to run the application. By default, [env.development](https://github.com/Seneca-CDOT/telescope/blob/master/config/env.development) will be used. Please read the use cases below to find out what configuration you need to make for different scenarios.

There are also [env.production](https://github.com/Seneca-CDOT/telescope/blob/master/config/env.production) and [env.staging](https://github.com/Seneca-CDOT/telescope/blob/master/config/env.staging) to choose based on developer's need. For example, if you want to use staging, you can do `cp ./config/env.staging ./.env` on Linux/macOS, or `copy config/env.staging .env` on Windows.

Here are instructions for different scenarios:

:::tip

Make sure you're running these commands in the root of telescope project. If any of the commands below are failing, use the command `pwd` to find your current directory and navigate back to project root (e.g., `cd <the path of directory you place telescope project>/telescope`)

:::

#### Option 1: Run frontend and backend microservices locally

This is the default setting, you do not need to copy or modify any `env` file.

```bash
pnpm services:start

pnpm start
```

Then visit `localhost:8000` in a web browser to see Telescope running locally. `localhost:3000/posts` will show you the list of posts in JSON

Microservices will start downloading feeds and processing them until stopped. You can stop the microservices by running

```
pnpm services:stop
```

For more information about the services, please read [Telescope API Services](../api-services/api.md).

If this doesn't work for you, it is possible that you have an old `.env` file in the root that you copied from `env.example` from telescope 1.0. Please remove it, and try again.

#### Option 2: Run frontend only

```bash
cp config/env.staging .env

pnpm dev
```

Then visit `localhost:8000` in a web browser

This will let you use the Telescope staging server as the backend so you do not need to run it locally.

#### Option 3: Mix and match services between local and staging production

See [staging-production-deployment](../contributing/staging-production-deployment.md) for more information on running Telescope in staging or production mode.

This one depends on which part you're working with. For example, if you want to work with authorization, you need to specify the URL of AUTH in your `.env` file by going to `.env` and modifying `SSO_URL=...` and modify it to the one you want to work with. If you're testing auth locally, use `SSO_URL=http://localhost/v1/auth`; otherwise, use the staging one, `SSO_URL=http://dev.api.telescope.cdot.systems/v1/auth`.

After modify the `.env` file, run these commands,

```bash
pnpm services:start
```

#### Option 4: Run microservices individually

For a full list of avaliable microservices, please read [Telescope API Services](../api-services/api.md).

```bash
pnpm services:start [name of microservice]
```

For example

```bash
pnpm services:start posts
```

#### Option 5: Update Docker image(s) after changes

Run the following commands to rebuild the image(s):

```bash
pnpm services:clean
pnpm services:start
```

#### Option 6: Run Login SSO

If you need to login to Telescope or your work requires logging in for testing purposes, you don't need to start an extra container for login, it is included in sso auth service. You can simply use UI to login. For more information on Login please refer to our [Login Document](../tools-and-technologies/login.md).

## Frequently Asked Questions (FAQ)

### How do I start using `pnpm` if I have telescope installed with `npm`?

Since `pnpm` uses a completely different `node_modules` structure, if you have previously installed dependencies with `npm`, you should delete them. To do so, from the root of the telescope folder, run the following command:

```bash
npx npkill
```

Using [npkill](https://npkill.js.org), select `node_modules` with the cursor arrows and press `SPACE` to delete them one by one. You can then exit by pressing `Q`.

### How do I start Docker Daemon?

Make sure to you have [docker](https://docs.docker.com/engine/reference/commandline/dockerd/) running on your machine, you can start docker through the following methods:

1. Running the command `sudo dockerd`
2. Starting the docker application manually
3. Restarting your machine.

You can check out the docker daemon cli through this link [here](https://docs.docker.com/engine/reference/commandline/dockerd/)

### I followed all the steps but my browser still can't run telescope locally

Try removing the docker images and pulling them again, while you're in the root directory of the project

1. `docker system prune -af` will delete the containers
2. `docker-compose up <services_here>` will pull the containers and start them up

### 'Cannot find cgroup mount destination' error

This could be an issue with WSL2 in Windows 10. You can resolve it by:

1. `sudo mkdir /sys/fs/cgroup/systemd`
2. `sudo mount -t cgroup -o none,name=systemd cgroup /sys/fs/cgroup/systemd`

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

:::info

Alternatively, you can set up an AWS Cloud9 IDE environment if none of the above worked for you. Please see our [AWS Cloud9 IDE Setup documentation](../getting-started/aws-cloud9.md) for more information.

:::
