# Testing Checklist - User Authentication Module

## ✅ Setup Verification

- [ ] Backend running on `http://localhost:3000`
- [ ] Frontend dependencies installed: `npm install`
- [ ] Frontend dev server running: `npm run dev`
- [ ] App accessible at `http://localhost:5173`
- [ ] Browser console has no critical errors

---

## ✅ Registration Form Testing

### Validation
- [ ] First Name field shows error if blank
- [ ] First Name field shows error if < 2 characters
- [ ] First Name field shows error if > 50 characters
- [ ] Last Name field validation works same as first name
- [ ] Email field shows error if blank
- [ ] Email field shows error for invalid email format
- [ ] Password field shows error if blank
- [ ] Password field shows error if < 8 characters
- [ ] Password field shows error if > 20 characters
- [ ] Password field shows error if missing uppercase letter
- [ ] Password field shows error if missing lowercase letter
- [ ] Password field shows error if missing number
- [ ] Password field shows error if missing special character
- [ ] Confirm Password field shows error if doesn't match
- [ ] Password requirements indicator updates in real-time

### Form Submission
- [ ] Can't submit form with validation errors
- [ ] Submit button shows loading state
- [ ] Form disables all inputs while submitting
- [ ] Success message appears on registration
- [ ] Auto-redirects to dashboard after 1.5 seconds
- [ ] User data is stored in localStorage

### Error Handling
- [ ] Shows "Email already exists" error if email registered
- [ ] Shows API error messages clearly
- [ ] Error alerts are visible and readable
- [ ] Error clears when user starts typing

### Form Interactions
- [ ] Real-time validation on field blur
- [ ] Validation triggers on form submission
- [ ] Links work: "Sign in here" navigates to /login
- [ ] Form is responsive on mobile

---

## ✅ Login Form Testing

### Validation
- [ ] Email field shows error if blank
- [ ] Email field validates email format
- [ ] Password field shows error if blank
- [ ] Both fields required for submission

### Form Submission
- [ ] Can't submit with empty fields
- [ ] Submit button shows loading state during request
- [ ] Form inputs disable while submitting
- [ ] Success message appears
- [ ] Auto-redirects to dashboard after 1.5 seconds
- [ ] JWT token stored in localStorage
- [ ] User data stored in localStorage

### Error Handling
- [ ] Shows "Invalid credentials" for wrong password
- [ ] Shows "Invalid credentials" for wrong email
- [ ] Shows clear API error messages
- [ ] Error alerts styled appropriately

### Form Interactions
- [ ] Validation on field blur
- [ ] Links work: "Forgot password" navigates to /forgot-password
- [ ] Links work: "Create one here" navigates to /register
- [ ] "or" divider displays correctly
- [ ] Form is responsive on mobile

---

## ✅ Dashboard Page Testing

### Display
- [ ] Page only accessible when logged in
- [ ] Redirects to /login if not authenticated
- [ ] Shows user's first and last name in header
- [ ] Displays First Name (read-only)
- [ ] Displays Last Name (read-only)
- [ ] Displays Email (read-only)
- [ ] Displays Status (read-only)
- [ ] Displays Member Since date (read-only)
- [ ] All user data matches logged-in user

### Logout
- [ ] Logout button visible and clickable
- [ ] Logout shows loading state
- [ ] Success message appears
- [ ] Token removed from localStorage
- [ ] User data removed from localStorage
- [ ] Auto-redirects to /login
- [ ] Trying to access /dashboard now redirects to /login

### Page Interaction
- [ ] Dashboard displays smoothly
- [ ] No console errors
- [ ] Responsive on mobile

---

## ✅ Route Protection Testing

### Public Routes
- [ ] `/` (home) accessible without login
- [ ] Can view `/register` without login
- [ ] Can view `/login` without login

### Route Redirects (Not Logged In)
- [ ] Accessing `/dashboard` redirects to `/login`
- [ ] Trying direct URL navigation to protected route fails

### Route Redirects (Logged In)
- [ ] Accessing `/register` as logged-in user redirects to `/dashboard`
- [ ] Accessing `/login` as logged-in user redirects to `/dashboard`
- [ ] Accessing `/` as logged-in user shows logged-in state

### Navigation
- [ ] Home page has correct buttons/links
- [ ] All navigation links work
- [ ] Back button works correctly
- [ ] URL changes match current page

---

## ✅ API Integration Testing

### Registration API
- [ ] POST `/api/v1/auth/register` called on registration
- [ ] Request includes firstName, lastName, email, password
- [ ] Response includes user object
- [ ] User object has id, firstName, lastName, email, status
- [ ] User data stored correctly

### Login API
- [ ] POST `/api/v1/auth/login` called on login
- [ ] Request includes email, password
- [ ] Response includes accessToken and user
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage

### Profile API
- [ ] GET `/api/v1/auth/profile` can be called
- [ ] Bearer token included in Authorization header
- [ ] Returns authenticated user data

### Logout API
- [ ] POST `/api/v1/auth/logout` called on logout
- [ ] Local storage cleared regardless of API response
- [ ] User redirected to login

### Token Management
- [ ] Token automatically included in all requests
- [ ] Token removed on 401 response
- [ ] Token persists page refresh (until logout)

---

## ✅ Local Storage Testing

### Data Storage
- [ ] accessToken stored after login
- [ ] user data stored as JSON after login
- [ ] Both values cleared on logout
- [ ] Data persists on page refresh while logged in
- [ ] Data cleared when logged out

### Token Usage
- [ ] Token included in Authorization header
- [ ] Token format: "Bearer <token>"
- [ ] Token removed on 401 error

---

## ✅ Error Scenarios Testing

### Network Errors
- [ ] Graceful handling if backend unavailable
- [ ] Error message displayed to user
- [ ] Form can be resubmitted

### Validation Errors
- [ ] All validation errors caught before API call
- [ ] Validation error messages clear and helpful
- [ ] User can fix and resubmit

### API Errors
- [ ] 409 error (duplicate email) shows: "Email already exists"
- [ ] 401 error on login shows: "Invalid credentials"
- [ ] Other errors show backend message or generic message
- [ ] Error messages are user-friendly

---

## ✅ UI/UX Testing

### Visual Design
- [ ] Consistent color scheme throughout
- [ ] Forms centered and well-aligned
- [ ] Buttons properly styled and clickable
- [ ] Error messages in red, success in green
- [ ] Loading spinner visible during requests

### Responsive Design
- [ ] Mobile layout (< 768px) looks good
- [ ] Tablet layout looks good
- [ ] Desktop layout looks good
- [ ] Forms stack properly on mobile
- [ ] Text is readable on all sizes
- [ ] Buttons have appropriate touch targets

### Accessibility
- [ ] Form labels connected to inputs
- [ ] Focus states visible on keyboard navigation
- [ ] Error messages announced to screen readers
- [ ] Color not sole means of communication

### Performance
- [ ] Form loads quickly
- [ ] Validation responds instantly
- [ ] No lag when typing in fields
- [ ] API calls complete in reasonable time

---

## ✅ Cross-Browser Testing

- [ ] Chrome/Chromium works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works
- [ ] Mobile browsers work

---

## ✅ Security Testing

- [ ] Password never displayed in console or network tab
- [ ] Token never logged in console
- [ ] No sensitive data in error messages
- [ ] localStorage used appropriately for token
- [ ] No XSS vulnerabilities visible
- [ ] CSRF tokens (if needed) present

---

## ✅ Real-World Scenarios

### Scenario 1: New User Registration
```
1. ✅ Navigate to /register
2. ✅ Fill in valid data
3. ✅ Submit form
4. ✅ Account created
5. ✅ Auto-logged in
6. ✅ Redirected to dashboard
```

### Scenario 2: Existing User Login
```
1. ✅ Logout or clear localStorage
2. ✅ Navigate to /login
3. ✅ Enter credentials
4. ✅ Successfully logged in
5. ✅ Redirected to dashboard
6. ✅ Refresh page - still logged in
```

### Scenario 3: Protected Route Access
```
1. ✅ Logout
2. ✅ Try to access /dashboard directly
3. ✅ Redirected to /login
4. ✅ Login
5. ✅ Can access /dashboard
```

### Scenario 4: Session Persistence
```
1. ✅ Login
2. ✅ Refresh page
3. ✅ Still logged in
4. ✅ Dashboard shows user data
5. ✅ Logout
6. ✅ Refresh page
7. ✅ Logged out
```

### Scenario 5: Invalid Credentials
```
1. ✅ Go to /login
2. ✅ Enter wrong email
3. ✅ Get error: "Invalid credentials"
4. ✅ Try wrong password
5. ✅ Get error: "Invalid credentials"
6. ✅ Correct credentials work
```

---

## 📋 Summary

- **Total Test Cases**: ~100+
- **Critical Tests**: Route protection, Login/Register, Token management
- **Integration Tests**: API communication, Data storage
- **UI Tests**: Responsive design, Error display
- **UX Tests**: Navigation, User feedback

---

## 🎯 Test Status

| Component | Status | Notes |
|-----------|--------|-------|
| Registration | [ ] | |
| Login | [ ] | |
| Dashboard | [ ] | |
| Routes | [ ] | |
| API Integration | [ ] | |
| Error Handling | [ ] | |
| Responsive Design | [ ] | |
| Security | [ ] | |

---

## 📝 Notes

Add any findings or issues discovered during testing below:

```
Issue #1: [Describe issue]
Status: [Open/Fixed]
Notes: [Any additional notes]

Issue #2: [Describe issue]
Status: [Open/Fixed]
Notes: [Any additional notes]
```

---

## ✨ Final Sign-Off

- [ ] All tests passed
- [ ] No critical issues
- [ ] Documentation complete
- [ ] Code review done
- [ ] Ready for production

**Tested by**: ________________
**Date**: ________________
**Sign-off**: ________________
