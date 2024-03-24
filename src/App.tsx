import { useRef } from "react";
import ImageDetected from "./molescules/ImageDetected";
import ui from "./styles.module.scss";
import useAddOn from "./customHooks/useAddOn";

function App() {
  const hook = useAddOn();

  const key = useRef(`${window.crypto.randomUUID()}`);

  return (
    <main className={ui.addOn}>
      <h1>Telegram Downloader 1.0.0</h1>

      <div className={ui.gallery}>
        {hook.state.map((image, i) => (
          <ImageDetected
            key={`${key.current}-${i}`}
            blobSrc={image.blob}
            sentAt={1}
            height={image.height}
            width={image.width}
          />
        ))}
      </div>

      <footer>
        <p className="m-0">
          Pictures found{" "}
          <span className="badge bg-info">{hook.state.length}</span>{" "}
        </p>
        {/* <div className="d-flex m-0">
          <p className="m-0">Render download button</p>
          <input type="checkbox" className="form-check-input" />
        </div> */}

        <button
          className="btn btn-primary"
          onClick={() => hook.handleDownloadAll()}
        >
          Download all
        </button>
      </footer>
    </main>
  );
}

export default App;
