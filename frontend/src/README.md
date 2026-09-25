# User Authentication Module

A complete user registration and login implementation for the frontend application, integrated with the backend API.

## Overview

This module provides:
- User registration with comprehensive form validation
- User login with session management
- Protected routes for authenticated users
- User dashboard showing profile information
- Logout functionality
- API error handling and user feedback

## Features

✅ **User Registration**
- Form validation matching backend rules
- Password strength indicator
- Real-time field validation
- Confirmation password matching
- Success/error message handling
- Automatic login after successful registration

✅ **User Login**
- Email and password authentication
- Session token storage
- Protected route access
- Auto-redirect on login

✅ **User Dashboard**
- Profile information display
- User data (name, email, status, member since)
- Logout button

✅ **Security**
- JWT token storage in localStorage
- Automatic token inclusion in API requests
- Token removal on logout
- Protected routes preventing unauthorized access

## File Structure

```
frontend/src/
├── components/
│   ├── RegisterForm.jsx       # Registration form component
│   ├── LoginForm.jsx          # Login form component
│   └── ProtectedRoute.jsx     # Route protection wrapper
├── pages/
│   ├── RegisterPage.jsx       # Registration page
│   ├── LoginPage.jsx          # Login page
│   ├── DashboardPage.jsx      # User dashboard
│   └── HomePage.jsx           # Landing page
├── services/
│   ├── apiClient.js           # Axios instance with interceptors
│   └── authService.js         # Auth API methods
├── utils/
│   ├── validation.js          # Form validation rules
│   └── authUtils.js           # Authentication helpers
├── styles/
│   └── forms.css              # Form and UI styling
├── App.jsx                    # Main app with routing
└── App.css                    # App styling
```

## API Integration

### Backend Endpoints

The module integrates with the following backend APIs:

**Registration (Auth Module):**
```
POST /api/v1/auth/register
Body: {
  firstName: string (2-50 chars),
  lastName: string (2-50 chars),
  email: string (valid email),
  password: string (8-20 chars, must include uppercase, lowercase, number, special char)
}
Response: { id, firstName, lastName, email, status, createdAt, updatedAt }
```

**Login (Auth Module):**
```
POST /api/v1/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  accessToken: string,
  user: { id, firstName, lastName, email, status, createdAt, updatedAt }
}
```

**Get Profile (Auth Module):**
```
GET /api/v1/auth/profile
Headers: { Authorization: "Bearer <accessToken>" }
Response: { user data }
```

**Logout (Auth Module):**
```
POST /api/v1/auth/logout
Response: { message: "Logout successful..." }
```

### Alternative User Endpoint

The module also supports the direct user creation endpoint:
```
POST /user
Body: { firstName, lastName, email, password }
Response: { user data }
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- Maximum 20 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&)

Example: `MyPassword123!`

### Name Validation
- First Name: 2-50 characters
- Last Name: 2-50 characters

### Email Validation
- Must be a valid email format

## Usage

### 1. Access Registration
Navigate to `/register` to access the registration form.

```javascript
// Registration flow:
1. User fills out the form (First Name, Last Name, Email, Password)
2. Form validates input in real-time
3. On submit, creates account and logs in user
4. Redirects to dashboard
```

### 2. Access Login
Navigate to `/login` to access the login form.

```javascript
// Login flow:
1. User enters email and password
2. Form validates input
3. On submit, authenticates user
4. Stores JWT token in localStorage
5. Redirects to dashboard
```

### 3. Protected Routes
The dashboard (`/dashboard`) is protected and requires authentication.

```javascript
// ProtectedRoute component:
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
// Redirects to /login if not authenticated
```

### 4. API Service Usage

```javascript
// Registration
import { authService } from '../services/authService'

try {
  const user = await authService.register(
    firstName,
    lastName,
    email,
    password
  )
  console.log('User registered:', user)
} catch (error) {
  console.error('Registration failed:', error.message)
}

// Login
try {
  const { accessToken, user } = await authService.login(email, password)
  console.log('Logged in as:', user.firstName)
} catch (error) {
  console.error('Login failed:', error.message)
}

// Logout
try {
  await authService.logout()
  console.log('Logged out successfully')
} catch (error) {
  console.error('Logout failed:', error.message)
}
```

## Environment Configuration

The API client is configured to connect to:
- **Base URL**: `http://localhost:3000`
- **Auth API**: `/api/v1/auth`
- **User API**: `/user`

To change the backend URL, modify `src/services/apiClient.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000' // Change this
```

## Error Handling

The module handles various error scenarios:

1. **Validation Errors**: Displayed under form fields in real-time
2. **Network Errors**: Displayed as alert messages
3. **API Errors**: Custom error messages from backend
4. **Session Errors**: Automatic token removal and redirect to login

### Common Error Messages

- "Email already exists" - Email is already registered
- "Invalid credentials" - Wrong email or password
- "Password must contain uppercase, lowercase, number, and special character" - Password doesn't meet requirements
- "First name must be at least 2 characters" - First name too short

## User Data Storage

User data and authentication token are stored in `localStorage`:

```javascript
// Accessing stored data
const user = getStoredUser()  // Get user object
const token = getStoredToken()  // Get JWT token
const isAuthenticated = isUserAuthenticated()  // Check auth status

// Clearing data
clearAuthData()  // Clears both user and token
```

## Styling

The module uses a consistent design system:

- **Primary Color**: #4a90e2 (Blue)
- **Success Color**: #27ae60 (Green)
- **Error Color**: #e74c3c (Red)
- **Background**: #f9f9f9 (Light Gray)

All form components use the `forms.css` stylesheet for consistent styling.

## Extending the Module

### Add Forgot Password Form
The backend supports password reset. To implement the UI:

1. Create `ForgotPasswordForm.jsx`
2. Create `ResetPasswordPage.jsx`
3. Add routes to `App.jsx`
4. Use `authService.forgotPassword()` and `authService.resetPassword()`

### Add Profile Update
To implement profile editing:

1. Create `UpdateProfileForm.jsx`
2. Use `userService.updateUser(id, userData)`
3. Update `DashboardPage.jsx`

### Add User List (Admin)
To implement user management:

1. Create `UsersListPage.jsx`
2. Use `userService.getAllUsers()`
3. Add admin route protection

## Dependencies

- `react`: UI library
- `react-router-dom`: Client-side routing
- `axios`: HTTP client

## Testing

To test the authentication flow:

1. Start the backend server on `http://localhost:3000`
2. Start the frontend dev server: `npm run dev`
3. Navigate to `http://localhost:5173`
4. Test registration at `/register`
5. Test login at `/login`
6. Test protected routes by accessing `/dashboard`

### Test Credentials

After registering, use the same email and password to login.

Example registration:
```
First Name: John
Last Name: Doe
Email: john@example.com
Password: MyPassword123!
```

## Troubleshooting

### Issue: "Cannot connect to API"
- Ensure backend is running on `http://localhost:3000`
- Check the `API_BASE_URL` in `apiClient.js`

### Issue: "Token invalid or expired"
- Clear localStorage and login again
- Check backend JWT configuration

### Issue: "Validation errors not showing"
- Ensure all required fields are filled
- Check browser console for JavaScript errors

## Future Enhancements

- [ ] Forgot password email verification
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Profile picture upload
- [ ] Email verification
- [ ] User preferences/settings
- [ ] Account deletion
- [ ] Session timeout auto-logout
