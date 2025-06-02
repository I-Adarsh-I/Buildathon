// User types
export type UserRole = "user" | "creator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// src/types/influencer.ts

// src/types/influencer.ts

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: string;
  followers: number;
  engagement: string;
  bio: string;
  // Explicitly list each possible platform as optional
  platformLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    // Add any other platforms you expect here
  };
}

// Campaign types
export type CampaignStatus = "draft" | "active" | "completed" | "cancelled";
export type Platform = "instagram" | "youtube" | "tiktok" | "twitter";
export type DeliverableType = "post" | "story" | "reel" | "video" | "tweet";

export interface Campaign {
  _id: string; // Mongoose-generated ObjectId (stringified)
  title: string;
  name: string; // corresponds to name/title
  objective: string;
  images: string[];
  budget: {
    total: number;
    perInfluencer?: number;
  };
  platforms: string[];
  hashtags: string[];
  languagePreferences: string[];
  creatorCriteria: {
    niche?: string;
    minFollowers?: number;
    maxFollowers?: number;
  };
  createdAt: string; // ISO date string
}

// Application types
export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  proposal: string;
  status: ApplicationStatus;
  deliverables?: {
    type: DeliverableType;
    content: string;
    submittedAt: string;
    status: "pending" | "approved" | "rejected";
  }[];
  createdAt: string;
  updatedAt: string;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  campaignId?: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// Contract and payment types
export type PaymentStatus = "pending" | "completed" | "failed";

export interface Payment {
  id: string;
  campaignId: string;
  brandId: string;
  creatorId: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  campaignId: string;
  brandId: string;
  creatorId: string;
  fileUrl: string;
  signed: {
    brand: boolean;
    creator: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
