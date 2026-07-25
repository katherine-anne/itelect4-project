import type { MouseEvent } from "react";
import type { Item } from "../types";

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
}

function ItemCard({ item, onSelect }: ItemCardProps) {
  return (
    <div className="item-card">
      <h3>{item.itemName}</h3>
      <p>{item.description}</p>
      <p>Location: {item.location}</p>
      <p>Status: {item.status}</p>

      <button onClick={() => onSelect(item)}>View Item</button>
    </div>
  );
}

export default ItemCard;
