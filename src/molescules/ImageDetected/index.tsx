import { PropsImageDetected } from "./types";
import ui from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import {
  // downloadBase64Content,
  openInNewTab,
  retrieveSize,
} from "../../helpers/files";
import byteSize from "byte-size";
import { AddOnContext } from "../../App";

export default function ImageDetected({
  blobSrc = "",
  width = 0,
  height = 0,
}: PropsImageDetected) {
  const [state, setState] = useState({
    isDownloading: false,
    labelSize: "",
  });

  const hook = useContext(AddOnContext);

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

    // NOTE: Commented cause files now will be downloaded by the backgronud_scripts
    // downloadBase64Content(blobSrc);

    hook?.attemptDownloadFile(blobSrc);

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

      <div className={ui.downloadOptions}>
        <button
          className="btn btn-primary btn-sm"
          disabled={state.isDownloading}
          onClick={handleDownload}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M9.75 6.75h-3a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3v-7.5a3 3 0 0 0-3-3h-3V1.5a.75.75 0 0 0-1.5 0v5.25Zm0 0h1.5v5.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V6.75Z"
              clipRule="evenodd"
            />
            <path d="M7.151 21.75a2.999 2.999 0 0 0 2.599 1.5h7.5a3 3 0 0 0 3-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 0 1-4.5 4.5H7.151Z" />
          </svg>
        </button>

        <button
          onClick={() => openInNewTab(blobSrc)}
          className="btn btn-info btn-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path
              fillRule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
