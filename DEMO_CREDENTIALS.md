# Inventory Control System - Demo Credentials

## Overview
This document contains all the demo user credentials for testing the Inventory Control System. These accounts are pre-configured in the database with different roles to test role-based access control.

---

## Demo Test Accounts

### **Login Credentials**

Use any of these email/password combinations to test the system:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@gmail.com | rupp2025 |
| **Manager** | manager@gmail.com | rupp2025 |
| **Stock Controller** | stock@gmail.com | rupp2025 |
| **Viewer** | viewer@gmail.com | rupp2025 |

---

## User Roles & Permissions

### **Admin** (`admin@gmail.com`)
- ✅ Full system access
- ✅ User management (if implemented)
- ✅ Product management (create, edit, delete)
- ✅ Supplier management
- ✅ Stock IN/OUT operations
- ✅ Reports and analytics
- ✅ System configuration

### **Manager** (`manager@gmail.com`)
- ✅ Product management
- ✅ Supplier management
- ✅ Stock IN/OUT operations
- ✅ Reports and analytics
- ❌ Cannot manage users
- ❌ Cannot delete products

### **Stock Controller** (`stock@gmail.com`)
- ✅ Stock IN operations
- ✅ Stock OUT operations
- ✅ View products
- ❌ Cannot create/edit products
- ❌ Cannot manage suppliers
- ❌ Cannot access reports
- ❌ Cannot delete anything

### **Viewer** (`viewer@gmail.com`)
- ✅ View dashboard
- ✅ View products
- ✅ View suppliers
- ✅ View reports (read-only)
- ❌ Cannot create, edit, or delete anything
- ❌ Cannot process stock movements

---

## Testing Workflow

### Admin Account Test