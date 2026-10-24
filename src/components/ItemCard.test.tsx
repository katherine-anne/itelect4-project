import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ItemCard from "./ItemCard";
import type { Item } from "../types";

const foundItem: Item = {
  id: "LF-2026-001",
  itemName: "Blue wallet",
  description: "A blue leather wallet with a student ID inside.",
  location: "Library",
  dateReported: new Date("2026-10-20T08:00:00.000Z"),
  status: "found",
  ownerId: 1,
};

describe("ItemCard", () => {
  it("shows the item's name, description, location and status", () => {
    render(<ItemCard item={foundItem} onSelect={vi.fn()} />);

    expect(screen.getByText("Blue wallet")).toBeInTheDocument();
    expect(
      screen.getByText("A blue leather wallet with a student ID inside."),
    ).toBeInTheDocument();
    expect(screen.getByText("Location: Library")).toBeInTheDocument();
    expect(screen.getByText("Status: found")).toBeInTheDocument();
  });

  it("hides the description when the compact variant is selected", () => {
    render(<ItemCard item={foundItem} onSelect={vi.fn()} variant="compact" />);

    expect(screen.getByText("Blue wallet")).toBeInTheDocument();
    expect(
      screen.queryByText("A blue leather wallet with a student ID inside."),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Status: found")).toBeInTheDocument();
  });
});
