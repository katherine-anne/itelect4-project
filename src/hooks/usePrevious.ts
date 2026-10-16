import { useRef, useEffect } from "react";
// Generic T -- works for any state type (string, number, User, etc.)
function usePrevious<T>(value: T): T | undefined {    //remember the previous value
  // useRef<T>() alone will NOT compile -- it needs an initial value
  const ref = useRef<T | undefined>(undefined); //store old value
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
export default usePrevious;
