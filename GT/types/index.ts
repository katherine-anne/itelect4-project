// ===== INTERFACES =====
export interface User {
id: number;
name: string;
email: string;
role: "student" | "securityAdmin"; 
isActive: boolean;
}

export interface Item {
  id: number;
  itemName: string;
  description: string;
  location: string;
  dateReported: Date;
  status: "lost" | "found" | "claimed";
  ownerId: number;
}

export interface Claim {
  id: number;
  itemId: number;
  claimantId: number;
  claimDate: Date;
  status: "approved" | "rejected";
  proof: string;
}

export type UserUpdate = Partial<User>;

export type UserPreview = Pick<User, "id" | "name" | "role">;

export type PublicUser = Omit<User, "email" | "isActive">;

export type UserCount = Record<
  "student" | "securityAdmin",
  number
>;

// ===== ENUMS =====
// Regular enum
export enum ClaimStatus {
  Approved,
  Rejected,
}

// const enum
export const enum UserRole {
  Student = "student",
  Security = "securityAdmin"
}

// ===== TYPE ALIASES =====
export type ID = string | number;

// Alias for item location
export type Location = {
  building: string;
  room: string;
};

// Alias for formatting dates
export type DateFormatter = (date: Date) => string;

// Using them
const itemId: ID = "LF-2026-001";

const itemLocation: Location = {
  building: "St. La Salle Building",
  room: "Room 301",
};

const formatDate: DateFormatter = (date) =>
  date.toLocaleDateString();

console.log(itemId);
console.log(formatDate(new Date()));

// ===== UNION TYPES =====
export type StringOrNumber = string | number;

export type ItemStatus =
  | "lost"
  | "found"
  | "claimed";

export function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}

printId(101);
printId("LF-2026-001");

// ===== INTERSECTION TYPES =====

export type ItemWithOwner = Item & {
  owner: User;
  claimCount: number;
};

const lostItem: ItemWithOwner = {
  id: 1,
  itemName: "Black Wallet",
  description: "Contains school ID and cards",
  location: "Library",
  dateReported: new Date(),
  status: "lost",
  ownerId: 1,

  owner: {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@school.edu",
    role: "student",
    isActive: true,
  },

  claimCount: 2,
};

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}