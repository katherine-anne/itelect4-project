import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useToggle from "./useToggle";

describe("useToggle", () => {
  it("starts with the value it was given", () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current[0]).toBe(false);
  });

  it("flips the value each time toggle is called", () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });
});
