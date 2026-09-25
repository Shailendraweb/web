# Quick Start Guide - User Authentication Module

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Ensure Backend is Running
```bash
# In another terminal
cd backend
npm start
# Should be running on http://localhost:3000
```

### Step 3: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
App opens at `http://localhost:5173`

---

## 🎯 Test the Features

### Test Registration
1. Click **"Create Account"** on home page
2. Fill in the form:
   ```
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Password: TestPass123!
   Confirm Password: TestPass123!
   ```
3. Watch password requirements indicator update
4. Click **"Create Account"**
5. Auto-logged in → Redirected to dashboard

### Test Login
1. Click **"Sign In"** on home page (or go to /login)
2. Enter credentials:
   ```
   Email: john@example.com
   Password: TestPass123!
   ```
3. Click **"Sign In"**
4. Redirected to dashboard

### Test Protected Routes
1. Try accessing `/dashboard` without logging in
2. Auto-redirects to `/login`
3. Login to access dashboard

### Test Logout
1. On dashboard, click **"Logout"**
2. Logged out → Redirected to login page

---

## 📱 App Routes

| Route | Public | Auth Required | Purpose |
|-------|--------|---------------|---------|
| `/` | ✅ | - | Home page |
| `/register` | ✅ | Redirects if logged in | Create account |
| `/login` | ✅ | Redirects if logged in | Sign in |
| `/dashboard` | ❌ | ✅ | User profile (protected) |

---

## 🔑 Password Requirements

Your password must have:
- ✓ 8-20 characters
- ✓ One uppercase letter (A-Z)
- ✓ One lowercase letter (a-z)
- ✓ One number (0-9)
- ✓ One special character (@$!%*?&)

**Valid example:** `MyPassword123!`

---

## 💾 Data Storage

User authentication data is stored locally:
- **Token**: `localStorage.accessToken`
- **User Data**: `localStorage.user`

Both are cleared on logout.

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to API" | Backend not running on http://localhost:3000 |
| "Email already exists" | Email already registered, use different email |
| "Invalid credentials" | Wrong email or password at login |
| "Password too weak" | Password doesn't meet requirements |
| Validation not showing | Click outside field (blur) for validation |
| Keeps redirecting to login | Token may be invalid, logout and login again |

---

## 📂 Key Files

```
src/
├── components/
│   ├── RegisterForm.jsx      ← Registration UI
│   ├── LoginForm.jsx         ← Login UI
│   └── ProtectedRoute.jsx    ← Route protection
├── pages/
│   ├── RegisterPage.jsx      ← Register page
│   ├── LoginPage.jsx         ← Login page
│   └── DashboardPage.jsx     ← User profile (protected)
└── services/
    └── authService.js        ← API calls
```

---

## 🎨 Styling

All components are fully styled with:
- Form validation feedback
- Error/success alerts
- Loading states
- Responsive design
- Password strength indicator

No additional CSS setup needed!

---

## 📖 Full Documentation

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for:
- Complete feature list
- API integration details
- All available functions
- Extending the module
- Troubleshooting guide

---

## 🚀 You're Ready!

Everything is set up and ready to use. Start with the 3 steps at the top and test the features!

Questions? Check the full documentation or review the module README.
