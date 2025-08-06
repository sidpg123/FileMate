"use client"

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Crown,
  Calendar,
  HardDrive,
  Users,
  CreditCard,
  Settings,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Gift
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/lib/api/subscription';
import { toast } from 'sonner';
import { UserInfoResponse } from '@/types/api/user';
import { getUserInfo } from '@/lib/api/user';
import { useUserDetailsStore } from '@/store/store';

// TypeScript interfaces
interface Subscription {
  id: string;
  userId: string;
  // plan: PlanType;
  planId: string;
  status: SubscriptionStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  startDate: string;
  expiresAt: string;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  plan: {
    name: string;
    displayName: string;
    price: string;
    features: string[];
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'CA' | 'CLIENT';
  storageUsed: bigint;
  allocatedStorage: bigint;
  createdAt: string;
  clientCount?: number; // This would come from a separate query
}

type PlanType = 'ff' | '6m' | '1y';
type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

interface PlanFeature {
  color: string;
  icon: React.ReactNode;
}


// Plan configuration
const planFeatures: Record<PlanType, PlanFeature> = {
  "ff": {
    color: "bg-blue-500",
    icon: <Gift className="h-5 w-5" />
  },
  "6m": {
    color: "bg-purple-500",
    icon: <Crown className="h-5 w-5" />
  },
  "1y": {
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
    icon: <Shield className="h-5 w-5" />
  }
};



const mockUser: User & { clientCount: number } = {
  id: "user_123",
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  passwordHash: "hashed_password",
  role: "CA",
  storageUsed: BigInt(15728640000), // ~14.6 GB in bytes
  allocatedStorage: BigInt(53687091200), // ~50 GB in bytes
  createdAt: "2024-01-15T00:00:00Z",
  clientCount: 87
};

// Utility functions
const formatBytes = (bytes: bigint | number): string => {
  const numBytes = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  if (numBytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getDaysRemaining = (expiresAt: string): number => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusBadge = (status: SubscriptionStatus): React.ReactNode => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const MySubscriptionPage: React.FC = () => {
  const currentUserEmail = useUserDetailsStore((state) => state.email);
  const {data: subscription, status: subscriptionStatus} = useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await getSubscription();

      if (!res) {
        toast.error('No subscription data found');
        throw new Error('No subscription data found');
      }
      return res;
      
    }
  })

  const { data: user, status: userStatus } = useQuery<UserInfoResponse>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const res = await getUserInfo();
      if (!res) {
        toast.error('No user data found');
        throw new Error('No user data found');
      }
      return res;
    },
  })
  // Type-safe access to plan features
  if (subscriptionStatus === 'pending' || userStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-48 bg-slate-200 rounded"></div>
              <div className="h-48 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription || !user) {
    return <div>Error loading data</div>;
  }

  console.log("Subscription: ", subscription);
  console.log("User", user)

  // Type-safe access to plan features
  const currentPlan: PlanFeature = planFeatures[subscription.plan?.name as PlanType];

  // Safe conversion of bigint to number for calculations
  const storageUsedNum = Number(user.data.storageUsed);
  const allocatedStorageNum = Number(user.data.allocatedStorage);
  const storageUsedPercent = (storageUsedNum / allocatedStorageNum) * 100;

  const daysRemaining = getDaysRemaining(subscription.expiresAt);   // Event handlers with proper typing
  // const handleUpgrade = (): void => {
  //   console.log('Upgrade plan clicked');
  //   // Navigate to upgrade page or open modal
  // };

  const handlePaymentHistory = (): void => {
    toast.info('Payment history feature coming soon!');
    console.log('Payment history clicked');
    // Navigate to payment history page
  };

  const handleStorageAnalytics = (): void => {
    toast.info('Storage analytics feature coming soon!');
    console.log('Storage analytics clicked');
    // Navigate to storage analytics page
  };

  // const handleContactSupport = (): void => {
  //   console.log('Contact support clicked');
  //   // Open support chat or navigate to support page
  // };



  return (
    <div className="min-h-screen bg-gradient-to-br mb-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mt-5">
          <h1 className="text-4xl font-bold text-slate-800">My Subscription</h1>
          <p className="text-slate-600 text-lg">Manage your FileMate subscription and usage</p>
        </div>

        {/* Current Plan Overview */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${currentPlan.color} text-white`}>
                  {currentPlan.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-800">{subscription?.plan.displayName}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {subscription?.plan.price}/year • Next billing: {formatDate(subscription!.expiresAt)}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right space-y-2">
                {getStatusBadge(subscription.status)}
                <div className="text-sm text-slate-600">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Storage Usage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Storage Used</span>
                  </div>
                  <span className="text-sm text-slate-600">
                    {formatBytes(user!.data.storageUsed)} / {formatBytes(user!.data.allocatedStorage)}
                  </span>
                </div>
                <Progress value={storageUsedPercent} className="h-2" />
                <p className="text-xs text-slate-500">
                  {storageUsedPercent.toFixed(1)}% of your storage limit used
                </p>
              </div>

              {/* Active Clients */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Active Clients</span>
                  </div>
                  <span className="text-sm text-slate-600">{user?.data.totalClients || 0}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full w-full"></div>
                </div>
                <p className="text-xs text-slate-500">Unlimited clients supported</p>
              </div>

              {/* Plan Duration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Plan Duration</span>
                  </div>
                  <span className="text-sm text-slate-600">Annual</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.max(5, Math.min(95, (365 - daysRemaining) / 365 * 100))}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">
                  Started {formatDate(subscription!.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Plan Features */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Your Plan Features</span>
              </CardTitle>
              <CardDescription>Everything included in your {subscription?.plan.displayName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscription?.plan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
             
              <Button variant="outline" className="w-full text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" onClick={handlePaymentHistory}>
                <CreditCard className="h-4 w-4 mr-2" />
                Payment History
              </Button>
              
              <Button variant="outline" className="w-full" onClick={handleStorageAnalytics}>
                <HardDrive className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-xs text-slate-600 font-medium">SUBSCRIPTION ID</p>
                <p className="text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
                  {subscription!.id}
                </p>
              </div>
              
              {subscription!.razorpay_payment_id && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium">LAST PAYMENT ID</p>
                  <p className="text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
                    {subscription!.razorpay_payment_id}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Billing Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Billing Information</span>
            </CardTitle>
            <CardDescription>Your subscription and payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Current Plan</p>
                <p className="text-lg font-semibold text-slate-900">{subscription?.plan.displayName}</p>
                <p className="text-sm text-slate-600">{subscription?.plan.price}/year</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Next Billing Date</p>
                <p className="text-lg font-semibold text-slate-900">{formatDate(subscription!.expiresAt)}</p>
                <p className="text-sm text-slate-600">
                  Auto-renewal {subscription!.status === 'active' ? 'enabled' : 'disabled'}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Account Email</p>
                <p className="text-lg font-semibold text-slate-900">{currentUserEmail}</p>
                <p className="text-sm text-slate-600">Billing notifications sent here</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Subscription Status</p>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(subscription.status)}
                </div>
                <p className="text-sm text-slate-600">Since {formatDate(subscription.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        {/* <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Need Help?</h3>
                <p className="text-slate-600">
                  Our support team is here to assist you with any questions about your subscription.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleContactSupport}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default MySubscriptionPage;