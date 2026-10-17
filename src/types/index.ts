  // ===== INTERFACES =====
  export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "securityAdmin";
  isActive: boolean;
  }

  export interface Item {
    id: string;
    itemName: string;
    description: string;
    location: string;
    dateReported: Date;
    status: "lost" | "found" | "claimed";
    ownerId: number;
  }

  export interface Claim {
    id: string;
    itemId: string;
    claimantId: string;
    claimDate: Date;
    status: ClaimStatusValue;
    proof: string;
  }

  export type ClaimStatusValue = "pending" | "approved" | "rejected";
  export type ClaimDecision = Exclude<ClaimStatusValue, "pending">;

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
    Pending,
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

  // ===== GENERIC INTERFACE =====
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }

  // ===== API TYPES =====

  // JSON serializes dates as strings; MongoDB IDs are strings as well.
  export type ApiItem = Omit<Item, "dateReported"> & {
    dateReported: string;
  };

  export type ApiClaim = Omit<Claim, "claimDate"> & {
    claimDate: string;
  };

  export type NewClaim = Pick<ApiClaim, "itemId" | "proof">;

  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface RegisterCredentials extends LoginCredentials {
    name: string;
  }

  export interface AuthReply {
    token: string;
    user: User;
  }
