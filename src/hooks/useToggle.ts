import { useState } from "react";

// Explicit return type: a tuple of [current value, toggle function]
function useToggle(initialValue: boolean): [boolean, () => void] {  //function to flip it
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue((prev) => !prev);
  };

  return [value, toggle];
}

export default useToggle;