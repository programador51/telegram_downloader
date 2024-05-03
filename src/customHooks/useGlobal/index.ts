import { MutableRefObject, useEffect, useRef, useState } from "react";
import { GlobalStateI, ReturnUseGlobal, SetPathDownload, TypePath } from "./types";
import { retrieveAddOnConfiguration } from "../../helpers/dom";

const INITIAL_STATE: GlobalStateI = {
  showThumbnails: false,
  zipBulkDownloads: false,
  displayDownloadOnChat: true,
  initialLoad: true,
  downloadPath: "/",
  typePath:"root"
};

export default function useGlobal(): ReturnUseGlobal {
  const [state, setState] = useState<GlobalStateI>(INITIAL_STATE);

  const pathTypes:MutableRefObject<{[key in TypePath]:TypePath}> = useRef({
    custom:"custom",
    default:"default",
    root:"root"
  });

  useEffect(() => {
    const parsedData = retrieveAddOnConfiguration();
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

  const setPathDownload: SetPathDownload = (type, path = "/") => {
    if (type === "default" || type==="custom") {
      setState((current) => ({
        ...current,
        typePath:type,
        downloadPath: path,
      }));
      return;
    }

    setState(current=>({
      ...current,
      typePath:type,
      downloadPath:""
    }))
  };

  return {
    ...state,
    setShowThumbnails,
    setBulkDownload,
    setDisplayDownloadOnChat,
    setPathDownload,
    pathTypes:pathTypes.current
  };
}
