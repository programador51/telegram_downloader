import { PropsImageDetected } from "./types";
import ui from "./styles.module.scss";
import { useEffect, useState } from "react";
import {
  downloadBase64Content,
  openInNewTab,
  retrieveSize,
} from "../../helpers/files";
import byteSize from "byte-size";

export default function ImageDetected({
  blobSrc = "",
  width = 0,
  height = 0,
}: PropsImageDetected) {
  const [state, setState] = useState({
    isDownloading: false,
    labelSize: "",
  });

  useEffect(() => {
    const bytesOfBase64 = retrieveSize(blobSrc);

    const { value, unit } = byteSize(bytesOfBase64);

    setState((current) => ({
      ...current,
      labelSize: `${value} ${unit}`,
    }));
  }, []);

  const handleDownload = () => {
    setState((current) => ({
      ...current,
      isDownloading: true,
    }));

    downloadBase64Content(blobSrc);

    setState((current) => ({
      ...current,
      isDownloading: false,
    }));
  };

  return (
    <div className={ui.itemGallery}>
      <img src={blobSrc} alt="image_detected_on_telegram" />

      <span>
        {width} x {height}
      </span>

      <p>{state.labelSize}</p>

      <button
        className="btn btn-primary btn-sm"
        disabled={state.isDownloading}
        onClick={handleDownload}
      >
        {state.isDownloading ? "Downloading" : "Download"}
      </button>

      <button
        onClick={() => openInNewTab(blobSrc)}
        className="btn btn-info btn-sm"
      >
        Preview
      </button>
    </div>
  );
}
