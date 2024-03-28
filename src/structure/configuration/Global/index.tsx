import { createContext } from "react";
import useGlobal from "../../../customHooks/useGlobal";
import { ReturnUseGlobal } from "../../../customHooks/useGlobal/types";
import { PropsGlobal } from "./types";

export const ContextGlobal = createContext<ReturnUseGlobal | undefined>(
  undefined
);

export default function Global(props: PropsGlobal) {
  const hook = useGlobal();

  return (
    <ContextGlobal.Provider value={hook}>
      {props.children}
    </ContextGlobal.Provider>
  );
}
