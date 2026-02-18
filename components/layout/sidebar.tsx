'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Package,
  Truck,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

interface SidebarProps {
  user?: {
    id: string
    email: string
    name: string
    role: 'admin' | 'manager' | 'stock_controller' | 'viewer'
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      roles: ['admin', 'manager', 'stock_controller', 'viewer'],
    },
    {
      href: '/products',
      label: 'Products',
      icon: Package,
      roles: ['admin', 'manager'],
    },
    {
      href: '/suppliers',
      label: 'Suppliers',
      icon: Truck,
      roles: ['admin', 'manager'],
    },
    {
      href: '/stock-in',
      label: 'Stock In',
      icon: ShoppingCart,
      roles: ['admin', 'manager', 'stock_controller'],
    },
    {
      href: '/stock-out',
      label: 'Stock Out',
      icon: ShoppingCart,
      roles: ['admin', 'manager', 'stock_controller'],
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: BarChart3,
      roles: ['admin', 'manager', 'viewer'],
    },
  ]

  const visibleItems = user
    ? menuItems.filter((item) => item.roles.includes(user.role))
    : []

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-40`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">ICS</h1>
          <p className="text-sm text-muted-foreground">Inventory Control</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

                {/* User Info with Theme Toggle & Logout */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.email || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full justify-start text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
