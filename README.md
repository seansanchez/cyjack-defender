# cyjack-defender

### Required Hardware
* Raspberry Pi 3B / 3B+
* MicroSD Card
* Ethernet Cable

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
8. Install Apache Web Server
```
sudo apt install apache2

sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod ssl

sudo a2dissite 000-default.conf

sudo nano /etc/apache2/sites-available/webnixfile.conf

##
<VirtualHost *:80>
   ServerName www.example.COM
   ProxyPreserveHost On
   ProxyPass / http://localhost:5000/
   ProxyPassReverse / http://localhost:5000/
   RewriteEngine on
   RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
   RewriteCond %{HTTP:CONNECTION} Upgrade$ [NC]
   RewriteRule /(.*) ws://127.0.0.1:5000/$1 [P]
   ErrorLog ${APACHE_LOG_DIR}/error-webnix.com.log
   CustomLog ${APACHE_LOG_DIR}/access-webnix.com.log combined
</VirtualHost>
###

sudo a2ensite webnixfile.conf
sudo systemctl restart apache2

https://tutexchange.com/how-to-host-asp-net-core-app-on-ubuntu-with-apache-webserver/#:~:text=How%20to%20Host%20ASP.NET%20Core%20App%20on%20Ubuntu,Runtime%20allows%20you%20to%20run%20apps%20that%20
```

### Endpoints
* API: http://{ipAddress}/swagger