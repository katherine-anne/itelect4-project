import type { MouseEvent } from "react";

import UserCard from "./components/UserCard";
import ItemCard from "./components/ItemCard";
import ClaimCard from "./components/ClaimCard";

import type { User, Item, Claim } from "./types";

const student: User = {
  id: 1,
  name: "Juan Dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

const lostItem: Item = {
  id: 1,
  itemName: "Black Wallet",
  description: "Contains school ID and cards",
  location: "Library",
  dateReported: new Date(),
  status: "lost",
  ownerId: 1,
};

const claim: Claim = {
  id: 1,
  itemId: 1,
  claimantId: 2,
  claimDate: new Date(),
  status: "approved",
  proof: "Student ID presented",
};

function App() {
  // Typed event handler
  const handleViewItem = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    console.log(event.currentTarget);
    alert(`Viewing Item: ${lostItem.itemName}`);
  };

  return (
    <div>
      <h1>Campus Lost & Found Tracker</h1>

      <UserCard user={student} />

      <ItemCard item={lostItem} />

      <ClaimCard claim={claim} />

      <button onClick={handleViewItem}>
        View Lost Item
      </button>
    </div>
  );
}

export default App;