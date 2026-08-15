// Shared mock data for the Campus Lost & Found Tracker.
// This data was previously stored at the top of App.tsx.
// It is moved here so multiple pages can reuse it.

import type { User, Item, Claim } from "../types/index";

export const student: User = {
  id: 1,
  name: "Juan Dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

export const lostItems: Item[] = [
  {
    id: 1,
    itemName: "Black Wallet",
    description: "Contains school ID and cards",
    location: "Library",
    dateReported: new Date(),
    status: "lost",
    ownerId: 1,
  },
  {
    id: 2,
    itemName: "Pink Umbrella",
    description: "Automatic umbrella with a pink floral design",
    location: "Women's Restroom",
    dateReported: new Date(),
    status: "lost",
    ownerId: 2,
  },
  {
    id: 3,
    itemName: "Silver Water Bottle",
    description: "Stainless steel bottle with a blue cap",
    location: "Gymnasium",
    dateReported: new Date(),
    status: "found",
    ownerId: 3,
  },
  {
    id: 4,
    itemName: "Scientific Calculator",
    description: "Black Casio calculator with a name sticker at the back",
    location: "Engineering Building",
    dateReported: new Date(),
    status: "claimed",
    ownerId: 4,
  },
];

export const claim: Claim = {
  id: 1,
  itemId: 1,
  claimantId: 2,
  claimDate: new Date(),
  status: "approved",
  proof: "Student ID presented",
};

export const allClaims: Claim[] = [
  claim,
  {
    id: 2,
    itemId: 3,
    claimantId: 1,
    claimDate: new Date(),
    status: "rejected",
    proof: "No valid proof of ownership provided",
  },
  {
    id: 3,
    itemId: 4,
    claimantId: 4,
    claimDate: new Date(),
    status: "approved",
    proof: "Student ID and item description verified",
  },
];