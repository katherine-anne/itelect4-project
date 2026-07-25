import { useState, useEffect, useRef } from "react";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

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

const lostItems: Item[] = [
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

const claim: Claim = {
  id: 1,
  itemId: 1,
  claimantId: 2,
  claimDate: new Date(),
  status: "approved",
  proof: "Student ID presented",
};

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // List of lost and found items
  const [items, setItems] = useState<Item[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  // Tracks whether mock data is still loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const previousSearchTerm = usePrevious(searchTerm);
  const [showClaims, toggleShowClaims] = useToggle(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedUser(student);
      setItems(lostItems);
      setSelectedClaim(claim);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const focusSearch = (): void => {
    searchInputRef.current?.focus();
  };

  // Typed event handler
  const handleViewItem = (item: Item): void => {
    alert(`Viewing Item: ${item.itemName}`);
  };

  if (isLoading) {
    return <p>Loading lost and found data...</p>;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h1>Campus Lost & Found Tracker</h1>

      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search lost and found items..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <button onClick={focusSearch}>Focus Search</button>

      <p>Current Search: {searchTerm || "None"}</p>
      <p>Previous Search: {previousSearchTerm || "None"}</p>

      {selectedUser && <UserCard user={selectedUser} />}

      {filteredItems.map((item) => (
        <ItemCard key={item.id} item={item} onSelect={handleViewItem} />
      ))}

      <button onClick={toggleShowClaims}>
        {showClaims ? "Hide Claim" : "Show Claim"}
      </button>

      {showClaims && selectedClaim && <ClaimCard claim={selectedClaim} />}
    </div>
  );
}

export default App;
