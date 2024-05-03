import { Fragment, useContext, useRef } from "react";
import { ContextGlobal } from "../Global";
import {
  IndexedTypePath,
  TypePath,
} from "../../../customHooks/useGlobal/types";

export default function PathDownload() {
  const global = useContext(ContextGlobal);

  const HelpMessage = useRef<IndexedTypePath>({
    custom:
      "The files will be downloaded on the folder path you pick (within Downloads folder)",
    default:
      "The files will be downloaded on a folder with the name of the current group (within Downloads folder)",
    root: "The files will be downloaded on the Downloads folder",
  });

  if (global === undefined) return <></>;

  return (
    <Fragment>
      <div className="mb-4">
        <label htmlFor="downloadPathFiles" className="form-label">
          Download path
        </label>
        <select
          value={global.typePath}
          onChange={(e) => global.setPathDownload(e.target.value as TypePath)}
          name="downloadPathFiles"
          id="downloadPathFiles"
          className="form-select"
        >
          {/* <option value={global.pathTypes.default}>Group name</option> */}
          <option value={global.pathTypes.custom}>Custom path</option>
          <option value={global.pathTypes.root}>Download path</option>
        </select>

        <small>{HelpMessage.current[global.typePath]}</small>
      </div>
      {global.typePath === "custom" ? (
        <div className="mb-4">
          <label htmlFor="downloadPathFiles" className="form-label">
            Path
          </label>
          <input
            onChange={e=>global.setPathDownload('custom',e.target.value)}
            type="text"
            className="form-control"
            id="exampleInputPassword1"
            value={global.downloadPath}
            placeholder="Example: /MyFolderName/AnotherSubFolder/AndSoOn"
            autoComplete="off"
          />
          <span><b>Example:</b> /telegramDownloads</span>
        </div>
      ) : null}
    </Fragment>
  );
}
