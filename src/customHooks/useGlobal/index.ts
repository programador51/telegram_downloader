import { useEffect, useState } from "react";
import { GlobalStateI, ReturnUseGlobal } from "./types";

const INITIAL_STATE: GlobalStateI = {
  showThumbnails: false,
  zipBulkDownloads: false,
  displayDownloadOnChat: true,
  initialLoad: true,
};

export default function useGlobal(): ReturnUseGlobal {
  const [state, setState] = useState<GlobalStateI>(INITIAL_STATE);

  useEffect(() => {
    const data = window.localStorage.getItem("configuration");

    const parsedData: GlobalStateI =
      data === null ? INITIAL_STATE : JSON.parse(data);

    window.localStorage.setItem("configuration", JSON.stringify(parsedData));
    setState({ ...parsedData, initialLoad: false });
  }, []);

  useEffect(() => {
    if (state.initialLoad) return;

    const info = JSON.stringify(state);

    window.localStorage.setItem("configuration", info);
  }, [state]);

  const setShowThumbnails = (showThumbnails: boolean) =>
    setState((current) => ({
      ...current,
      showThumbnails,
    }));

  const setBulkDownload = (zipBulkDownloads: boolean) =>
    setState((current) => ({
      ...current,
      zipBulkDownloads,
    }));

  const setDisplayDownloadOnChat = (displayDownloadOnChat: boolean) =>
    setState((current) => ({
      ...current,
      displayDownloadOnChat,
    }));

  return {
    ...state,
    setShowThumbnails,
    setBulkDownload,
    setDisplayDownloadOnChat,
  };
}
