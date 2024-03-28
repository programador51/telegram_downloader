import { Fragment } from "react/jsx-runtime";
import ui from "./styles.module.scss";
import { Link } from "react-router-dom";

export default function ConfigurationAddOn() {
  return (
    <Fragment>
      <b>⚠️ All this settings are reset when you clear your browser settings</b>

      <form action="" className={ui.configuration}>
        <div>
          <label htmlFor="format" className="form-label">
            Bulk download format
          </label>
          <select name="format" id="format" className="form-select">
            <option value="1">Zipped</option>
            <option value="0">Not zipped</option>
          </select>
          <small>This applys only when you use the "Download All" button</small>
        </div>

        <div>
          <label htmlFor="displayDownloadOnUi" className="form-label">
            Display download button on chat
          </label>
          <select
            name="displayDownloadOnUi"
            id="displayDownloadOnUi"
            className="form-select"
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          <small>
            Displays a download button down each media found on the telegram
            chat
          </small>
        </div>

        <div>
          <label htmlFor="avoidThumbnails" className="form-label">
            Ignore thumbnails
          </label>
          <select
            name="avoidThumbnails"
            id="avoidThumbnails"
            className="form-select"
          >
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          <small>
            If you want to ignore them on the results of the PopUp extension
          </small>
        </div>
      </form>

      <Link className="btn btn-primary" to="/">
        Go back
      </Link>
    </Fragment>
  );
}
