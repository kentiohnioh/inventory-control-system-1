# Inventory Control System - Demo Credentials & Setup Guide

## Overview
This document contains all the demo test user credentials for testing the Inventory Control System. These accounts are pre-configured with different roles to test role-based access control.

---

## Demo Test Accounts

### **Login Credentials**

Use any of these to test:

| Role | Email | Password
|-----|-----|-----
| Admin | **[admin@gmail.com](mailto:admin@gmail.com)** | **rupp2025**
| Manager | **[manager@gmail.com](mailto:manager@gmail.com)** | **rupp2025**
| Stock Controller | **[stock@gmail.com](mailto:stock@gmail.com)** | **rupp2025**
| Viewer | **[viewer@gmail.com](mailto:viewer@gmail.com)** | **rupp2025**

---

## How to Create Demo Users in Supabase

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your project
3. Navigate to **Authentication** → **Users** in the left sidebar

### Step 2: Create Each User
For each demo account above:

1. Click **"Invite"** or **"Add User"**
2. Enter the email address from the demo accounts list
3. Set the password (use the provided password above)
4. Make sure **"Auto confirm user"** is checked
5. Click **"Send invite"** or **"Create user"**

### Step 3: Assign Roles (In-App)
1. Log in to the ICS app with the **admin@ics-demo.com** account
2. Go to **Dashboard** → **User Management**
3. Find each demo user and assign the appropriate role:
   - Admin → Select "Administrator"
   - Manager → Select "Manager"
   - Stock → Select "Stock Controller"
   - Viewer → Select "Viewer"

---

## Testing Workflow

### Admin Account Test
```
Login: admin@ics-demo.com / AdminDemo@2025
Expected: Full access to all modules including user management
Test: Create a new product, add a supplier, process stock-in/out
```

### Manager Account Test
```
Login: manager@ics-demo.com / ManagerDemo@2025
Expected: Can manage inventory and view reports (no user management)
Test: View reports, manage products, cannot access user settings
```

### Stock Controller Account Test
```
Login: stock@ics-demo.com / StockDemo@2025
Expected: Only stock movement operations
Test: Stock-in/out forms work, cannot delete products
```

### Viewer Account Test
```
Login: viewer@ics-demo.com / ViewerDemo@2025
Expected: Read-only access, no edit/create buttons
Test: Can view dashboard and reports, all edit buttons disabled
```

---

## Important Security Notes

⚠️ **For Production:**
- Change all demo passwords immediately
- Delete demo accounts from production
- Use strong, unique passwords for all users
- Implement multi-factor authentication (MFA)
- Regularly audit user access and roles

⚠️ **Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

---

## Quick Credentials Reference

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ics-demo.com | AdminDemo@2025 |
| Manager | manager@ics-demo.com | ManagerDemo@2025 |
| Stock Controller | stock@ics-demo.com | StockDemo@2025 |
| Viewer | viewer@ics-demo.com | ViewerDemo@2025 |

---

## Troubleshooting

### "User already exists" error
- The user may already be created in Supabase
- Go to Authentication → Users and check if they exist
- If they exist, you can reset their password from the user details

### "Cannot assign role" error
- Make sure you're logged in as admin
- Check that the user has confirmed their email
- Refresh the page and try again

### Cannot log in with credentials
- Verify the email is spelled correctly
- Check that the user was created with "Auto confirm"
- Reset the password in Supabase dashboard

---

## Demo Database Sample Data

The system includes pre-seeded data:
- **Categories:** Beverages, Dairy, Snacks, Fresh Produce, Frozen Foods
- **Suppliers:** Fresh Foods Ltd, Beverage Co, Quick Snacks Inc
- **Sample Products:** Orange Juice, Milk, Bread, Apples, Frozen Pizza, Cheese, Potato Chips

You can use these to test stock movements and inventory tracking.

---

**Last Updated:** January 22, 2025
**System Version:** 1.0.0
