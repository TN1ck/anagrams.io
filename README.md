# anagramania

## Deployment

We use a max of gitlab + digital ocean for deployment.

1. Setup the machine according to https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04
```
ssh root@your_server_ip
# setup user
adduser tom
usermod -aG sudo tom
su tom
mkdir ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# paste your public key and crtl + x
chmod 600 ~/.ssh/authorized_keys

# setup firewall
# show avalaible rules
sudo ufw app list
# allow ssh and enable
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```
2. Setup Nginx according to https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
```
sudo apt-get update
sudo apt-get install -y nginx
# allow in firewall
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
# check status
systemctl status nginx

# some commands:
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t && sudo systemctl reload nginx
```
3. Setup domain to point to digital ocean
```
# Set nameservers to:
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com

# Create a A-records in digital ocean with @, api, www as its hostnames

```
4. Set up ssl with Let's encrypt, according to: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04
```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y python-certbot-nginx
# change nginx config
sudo nano /etc/nginx/sites-available/default
# replace server_name _ with:
server_name anagramania.io api.anagramania.io www.anagramania.io
# reload nginx:
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d anagramania.io -d www.anagramania.io -d api.anagramania.io
```
1. Install Node etc according to:
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

```
1.
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
# install pm2 to manage nodejs applications
sudo npm install -g pm2
# setup nginx as a reverse proxy server
# ...
```