import { useEffect, useState } from "react";
import { GlobalStateI, ReturnUseGlobal } from "./types";

const INITIAL_STATE: GlobalStateI = {
  showThumbnails: false,
  zipBulkDownloads: false,
  displayDownloadOnChat: true,
};

export default function useGlobal():ReturnUseGlobal {
  const [state, setState] = useState<GlobalStateI>(INITIAL_STATE);

  useEffect(() => {
    const data = window.localStorage.getItem("configuration");

    const parsedData: GlobalStateI =
      data === null ? INITIAL_STATE : JSON.parse(data);

    setState(parsedData);

    console.log(parsedData);
  }, []);

  return {
    ...state,
  };
}
