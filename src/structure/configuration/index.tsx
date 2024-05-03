import ui from "./styles.module.scss";
import { Link } from "react-router-dom";
import { ContextGlobal } from "./Global";
import { useContext } from "react";
import PathDownload from "./PathDownload";

export default function ConfigurationAddOn() {
  const global = useContext(ContextGlobal);

  if (global === undefined) return <></>;

  return (
    <div className="p-5">
      <b className="text-center mt-2 mb-5">
        ⚠️ All this settings are reset when you clear your browser settings
      </b>

      <form className={ui.configuration} onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label htmlFor="format" className="form-label">
            Bulk download format
          </label>
          <select
            name="format"
            id="format"
            className="form-select"
            value={+global.zipBulkDownloads}
            onChange={(e) => global.setBulkDownload(!!+e.target.value)}
          >
            <option value="1">Zipped</option>
            <option value="0">Not zipped</option>
          </select>
          <small>This applys only when you use the "Download All" button</small>
        </div>

        <PathDownload />

        <div className="mb-4">
          <label htmlFor="avoidThumbnails" className="form-label">
            Ignore thumbnails
          </label>
          <select
            value={+global.showThumbnails}
            onChange={(e) => global.setShowThumbnails(!!+e.target.value)}
            name="avoidThumbnails"
            id="avoidThumbnails"
            className="form-select"
          >
            <option value="0">Yes</option>
            <option value="1">No</option>
          </select>
          <small>
            If you want to ignore them on the results of the PopUp extension.
            (Images that has less of 320px of size on width and height)
          </small>
        </div>
      </form>

      <Link className={`${ui.nav} btn btn-primary btn-lg`} to="/">
        Go back
      </Link>
    </div>
  );
}
