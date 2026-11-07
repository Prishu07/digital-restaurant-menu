# 🍽️ L'Aura Bistro — Digital Restaurant Menu Website

A modern, high-performance, single-page **Digital Restaurant Menu Website** built with **React.js, Vite, Tailwind CSS, Node.js, and Express**. Fully integrated with **Amazon S3** for secure private media storage using an **AWS EC2 IAM Instance Role** (zero hardcoded AWS credentials or API keys) and designed for instant deployment to an **Amazon EC2 Ubuntu instance** via **Nginx** and **PM2**.

---

## 🌟 Key Features

- **Single-Page Architecture**: Fluid, modern, mobile-first restaurant website.
- **Zero Database Complexity**: Powered by a robust structured JSON menu data file (`data/menu.json`).
- **Private Amazon S3 Integration**: High-resolution dish photos, hero banners, and promotional kitchen videos stored in private S3 buckets and accessed securely through temporary backend-generated **Presigned URLs**.
- **IAM Instance Role Security**: Uses AWS SDK v3 Default Credential Provider Chain. **No AWS Access Key ID or Secret Access Key** are ever created or stored in the code or `.env`.
- **Integrated Full-Stack Server**: Vite builds directly into the root `public/` directory, allowing a single Express instance to serve both the frontend and API endpoints.
- **Production-Ready**: Pre-configured **PM2** process management (`ecosystem.config.js`) and **Nginx** reverse proxy (`nginx.conf`).
- **Simple GitHub Git Flow**: Update your website anytime by simply running `git push` on your computer and `git pull` on EC2.

---

## 📁 Project Structure

```text
digital-restaurant-menu/
│
├── frontend/                     # React + Vite + Tailwind source
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── sections/
│   │   │   ├── ContactSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── IntroSection.jsx
│   │   │   ├── MenuSection.jsx
│   │   │   ├── OpeningHoursSection.jsx
│   │   │   ├── PopularDishesSection.jsx
│   │   │   └── PromoVideoSection.jsx
│   │   ├── App.jsx               # Main SPA view
│   │   ├── index.css             # Tailwind base & custom styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js           # Configured to build into ../public
│
├── public/                       # Compiled production React frontend
│
├── server/                       # Node.js backend modules
│   ├── config/
│   │   └── s3.js                 # AWS SDK v3 S3 client & Presigned URL generator
│   ├── routes/
│   │   ├── menuRoutes.js         # /api/health, /api/menu, /api/categories
│   │   └── mediaRoutes.js        # /api/media
│   └── controllers/
│       ├── menuController.js     # Menu logic & S3 presigning
│       └── mediaController.js    # Hero & video media presigning
│
├── data/
│   └── menu.json                 # Restaurant info, dishes, categories, and S3 keys
│
├── scripts/
│   └── upload-media.js           # CLI tool to upload images/video to S3
│
├── server.js                     # Root Express.js server & static host
├── package.json                  # Root npm scripts & backend dependencies
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file
├── ecosystem.config.js           # PM2 process configuration
├── nginx.conf                    # Nginx reverse proxy template
└── README.md                     # Comprehensive documentation
```

---

## 🚀 Quick Start (Local Computer)

### 1. Install Backend Dependencies
Run in the `digital-restaurant-menu` root directory:
```bash
npm install
```

### 2. Install Frontend Dependencies
```bash
npm run install:frontend
```

### 3. Build the React Frontend into `public/`
```bash
npm run build
```

### 4. Create Local `.env` (Optional for local testing)
```bash
cp .env.example .env
```
*(Leave bucket name as-is if testing locally without AWS; the server will automatically fall back to high-resolution CDN images!)*

### 5. Start the Server
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the live website.

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server uptime, health, and S3 status |
| `GET` | `/api/menu` | All dishes with resolved S3 Presigned URLs |
| `GET` | `/api/categories` | List of all available food categories |
| `GET` | `/api/media` | Hero banner, chef image, and promo video Presigned URLs |

---

## ☁️ Step-by-Step AWS Setup & Deployment Guide

### Phase A: Create Private Amazon S3 Bucket
1. Open the **AWS Management Console** and navigate to **S3**.
2. Click **Create bucket**.
3. **Bucket name**: Choose a globally unique name, e.g., `laura-restaurant-menu-YOURNAME`.
4. **AWS Region**: Select your preferred region (e.g., `ap-south-1` for Mumbai, or `us-east-1` for N. Virginia).
5. **Block Public Access settings for this bucket**: Keep **Block *all* public access** checked (ENABLED).
6. Click **Create bucket**.
*(Your bucket remains completely private; images will be securely delivered via backend presigned URLs).*

---

### Phase B: Create IAM Instance Role for EC2
> ⚠️ **NO ACCESS KEYS**: You do NOT need to generate AWS Access Key ID or Secret Access Key.

1. Open the **AWS Console** and search for **IAM**.
2. Go to **Roles** → click **Create role**.
3. Select **AWS service** as the trusted entity type, and choose **EC2** as the use case. Click **Next**.
4. In the permissions search bar, type `AmazonS3ReadOnlyAccess` (or create a custom inline policy for your specific bucket):
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "s3:GetObject",
                   "s3:ListBucket"
               ],
               "Resource": [
                   "arn:aws:s3:::YOUR-BUCKET-NAME",
                   "arn:aws:s3:::YOUR-BUCKET-NAME/*"
               ]
           }
       ]
   }
   ```
5. Click **Next**, name the role: `EC2-Restaurant-S3-Role`.
6. Click **Create role**.

---

### Phase C: Launch EC2 Instance & Attach IAM Role
1. Navigate to **EC2** → click **Launch instance**.
2. **Name**: `Restaurant-Menu-Server`.
3. **OS**: **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
4. **Instance type**: `t2.micro` or `t3.micro` (AWS Free Tier eligible).
5. **Key pair**: Select or create an SSH key pair (e.g. `my-key.pem`).
6. **Network settings (Security Group)**:
   - Allow **SSH** (Port 22) from your IP.
   - Allow **HTTP** (Port 80) from Anywhere (`0.0.0.0/0`).
7. **Advanced details**:
   - Scroll down to **IAM instance profile**.
   - Select `EC2-Restaurant-S3-Role`.
8. Click **Launch instance**.

---

### Phase D: Connect to EC2 and Install Prerequisites

Connect via SSH from your computer terminal:
```bash
ssh -i /path/to/my-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Inside your Ubuntu EC2 terminal, run:
```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20.x (LTS) & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 3. Verify installations
node -v
npm -v
git --version

# 4. Install PM2 process manager globally
sudo npm install -g pm2
```

---

### Phase E: Deploy Your Repository on EC2

```bash
# 1. Clone your GitHub repository
git clone https://github.com/YOUR_USERNAME/digital-restaurant-menu.git

# 2. Enter project folder
cd digital-restaurant-menu

# 3. Install root dependencies
npm install

# 4. Install frontend dependencies
npm run install:frontend

# 5. Build React production assets
npm run build

# 6. Create production .env file
nano .env
```

Paste your environment variables into `.env`:
```ini
PORT=3000
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name
```
Press `CTRL+O`, `Enter`, and `CTRL+X` to save and exit.

---

### Phase F: Upload Media to S3 (One-Time)

To automatically populate your private S3 bucket with all starter dish photos and promotional media:
```bash
npm run upload:media
```

---

### Phase G: Start Express with PM2

```bash
# Start app with ecosystem config
pm2 start ecosystem.config.js

# Configure PM2 to auto-start on EC2 system reboot
pm2 startup
# (Run the sudo env command printed by PM2)
pm2 save
```

---

### Phase H: Configure Nginx as Reverse Proxy

```bash
# 1. Copy nginx configuration template
sudo cp nginx.conf /etc/nginx/sites-available/restaurant-menu

# 2. Enable site by creating symlink
sudo ln -s /etc/nginx/sites-available/restaurant-menu /etc/nginx/sites-enabled/

# 3. Remove default Nginx welcome page
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Test configuration syntax
sudo nginx -t

# 5. Reload Nginx
sudo systemctl reload nginx
```

🎉 **Your website is now LIVE!**
Open `http://YOUR_EC2_PUBLIC_IP` in any browser to experience your digital restaurant menu.

---

## 🔄 Simple Website Updates (Future Workflow)

When you make changes to the menu or code in the future:

### On your Local Computer:
```bash
git add .
git commit -m "Update dish prices and seasonal specials"
git push origin main
```

### On your EC2 Server:
```bash
cd digital-restaurant-menu
git pull origin main
npm install
npm run install:frontend
npm run build
pm2 restart restaurant-menu
```
Your live website will be updated immediately with zero downtime!

