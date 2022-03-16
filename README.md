# cyjack-defender

### Required Hardware
* Raspberry Pi 3B / 3B+
* MicroSD Card
* Ethernet Cable

### Dependencies
* Visual Studio 2019 / 2022
  * Workload: Universal Windows Platform development
* [Windows 10 IoT Core Dashboard](https://docs.microsoft.com/en-us/windows/iot-core/connect-your-device/iotdashboard)

### Setup

#### Install OS and Connect to Pi via SSH
1. Download [Ubuntu Server 20.04.4 (64-bit) for Raspberry Pi](https://ubuntu.com/download/raspberry-pi/thank-you?version=20.04.4&architecture=server-arm64+raspi)
2. Flash MicroSD w/ the image downloaded in previous step with a tool like [Etcher](https://www.balena.io/etcher/)
3. Insert the newly flashed MicroSD card into the Raspberry Pi and connect it to the network via ethernet cable; power on the device. (first boot up takes a few minutes)
4. Once you have found the device on your network; you can connect to it using an SSH client like [MobaXterm](https://mobaxterm.mobatek.net/download.html). The username and password are both "ubuntu" -- you will be asked to change these the first time you login.
5. Download and install the Defender for IoT Micro Agent: https://docs.microsoft.com/en-us/azure/defender-for-iot/device-builders/tutorial-standalone-agent-binary-installation#download-and-install-the-micro-agent
6. Authenticate to the Defender for IoT Micro Agent: https://docs.microsoft.com/en-us/azure/defender-for-iot/device-builders/tutorial-standalone-agent-binary-installation#authenticate-using-a-module-identity-connection-string
7. Install .NET SDK
```
wget https://dot.net/v1/dotnet-install.sh
sudo bash ./dotnet-install.sh --channel LTS --install-dir /opt/dotnet/
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
echo 'export DOTNET_ROOT=/opt/dotnet' >> /home/ubuntu/.bashrc
```

### Endpoints
* API: http://{ipAddress}:5000/api
* UI: http://{ipAddress}:5000/ui