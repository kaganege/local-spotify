import { useEffect, type DependencyList, type EffectCallback } from "react";

export default function useAsyncEffect(
  effect: () => Promise<ReturnType<EffectCallback>>,
  deps?: DependencyList
) {
  return useEffect(() => {
    effect();
  }, deps);
}
