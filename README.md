# Lakshya - Career Counseling System ✦

Lakshya is a production-grade, highly secure, full-stack **MERN (MongoDB, Express, React, Node.js)** platform connecting students with professional career counselors.

---

## 🚀 Key Features

### 1. **Robust Role-Based Access Control (RBAC)**
Three fully separated roles ensuring robust security boundaries:
- **Student**: Can browse counselors using debounced queries, view counselor availability, and book dynamic sessions securely.
- **Counselor**: Can accept/reject bookings, manage dynamic availability slots seamlessly, and mark authorized sessions complete.
- **Admin**: Master dashboard enabling real-time analytics with dark-mode optimized charts, comprehensive user management, and detailed analytical reports.

### 2. **Secure Payments with Stripe**
Strict, highly monitored backend integration utilizing the `stripe` API.
- **Controlled Invoicing**: Students cannot pay until their assigned Counselor strictly approves the booking.
- **Client-Side Automation**: Uses asynchronous API validation over standard webhooks, avoiding reliance on tunneling services for seamless execution and deployment.

### 3. **Impenetrable Authentication & OTP**
State-of-the-art security features shielding user pathways.
- **Refresh Token Rotation**: Uses HTTP-only validation cookies against Cross-Site Scripting (XSS).
- **Time-Based Secure OTPs**: Email-based transaction completion limits with brute-force prevention algorithms securely logging all validation strikes.

---

## 🛠️ Technology Stack
- **Frontend Framework**: React.js (Vite configuration)
- **UI & Analytics Component**: Vanilla CSS (Stormy Morning Aesthetic), Recharts API
- **State & Service Layers**: Context API + Axios interceptors with retry-queue systems
- **Backend Application Layer**: Node.js + Express.js
- **Database Engine**: MongoDB with advanced indexing and native Mongo-Sanitizers
- **Security & Protection Toolkit**: Helmet.js for header defense, Express-Rate-Limit for traffic control

---

## 🌐 Deployment Instructions 

This repository is completely prepared for automatic **Single-Server Deployment** solutions such as Render, Heroku, or DigitalOcean App Platform. 

### 1. Environment Configurations
Securely provision the respective Cloud Host's Environment Variables panel with:

```env
# Database
MONGO_URI=your_mongodb_atlas_connection_uri

# Secrets (Make these highly complex random strings)
JWT_SECRET=super_secret_jwt_key
JWT_REFRESH_SECRET=super_secret_refresh_key

# Email Server Settings (Nodemailer requires these)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Stripe Configs
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# System Configs
NODE_ENV=production
FRONTEND_URL=your_deployment_domain (e.g. https://lakshya-counseling.onrender.com)
```

### 2. Hosting Command Triggers
The root `package.json` natively exposes unified deployment chains:

**Build Command**:
```bash
npm run build
```
*This precisely downloads backend packages, then frontend packages, and ultimately bundles the React core into static `/dist` architecture.*

**Start Command**:
```bash
npm start
```
*Triggers standard execution of `node server.js`. The backend will securely consume the static React distribution and broadcast the entire comprehensive application on standard Port 5000 (Or the system's `$PORT`).*
