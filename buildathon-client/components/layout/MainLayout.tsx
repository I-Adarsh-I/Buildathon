'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  LayoutDashboard,
  BarChart2,
  MessageSquare,
  CircleDollarSign,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getCurrentUser } from '@/lib/auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const user = getCurrentUser();
  const isBrand = user?.role === 'brand';

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === '/dashboard',
    },
    {
      href: isBrand ? '/campaigns' : '/discover',
      label: isBrand ? 'Campaigns' : 'Discover',
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
      active: isBrand 
        ? pathname === '/campaigns' || pathname.startsWith('/campaigns/') 
        : pathname === '/discover' || pathname.startsWith('/discover/'),
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      active: pathname === '/messages' || pathname.startsWith('/messages/'),
    },
    {
      href: isBrand ? '/payments' : '/earnings',
      label: isBrand ? 'Payments' : 'Earnings',
      icon: <CircleDollarSign className="mr-2 h-4 w-4" />,
      active: isBrand ? pathname === '/payments' : pathname === '/earnings',
    },
    {
      href: '/contracts',
      label: 'Contracts',
      icon: <FileText className="mr-2 h-4 w-4" />,
      active: pathname === '/contracts',
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname === '/settings',
    },
  ];

  return (
    <div className="h-full">
      {/* Mobile Navigation */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center cursor-pointer">
          <span className="text-xl font-bold">InfluenceAI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/settings">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col h-full">
                <div className="border-b p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar>
                      <AvatarImage src={user?.image} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="flex-1 px-2 py-4">
                  <div className="space-y-1">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                          route.active
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {route.icon}
                        {route.label}
                      </Link>
                    ))}
                  </div>
                </nav>
                <div className="border-t p-4">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-5">
              <Link href="/dashboard" className="flex items-center cursor-pointer">
              <span className="text-xl font-bold">InfluenceAI</span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    route.active
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t flex-shrink-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:pl-64 pt-16 md:pt-0">
        <main className="h-full overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}