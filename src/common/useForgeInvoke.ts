import { invoke } from "@forge/bridge";
import { useEffect, useState } from "react";

export function useForgeInvoke(
  functionName: string,
  properties?: Record<string, any>
) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    invoke(functionName, properties).then(setData);
  }, []);

  return {
    loading: data === null,
    value: data,
  };
}
