import { useRef } from "react";
import ImageDetected from "./molescules/ImageDetected";
import ui from "./styles.module.scss";
import useAddOn from "./customHooks/useAddOn";
import Header from "./molescules/Header";

function App() {
  const hook = useAddOn();

  const key = useRef(`${window.crypto.randomUUID()}`);

  return (
    <main className={ui.addOn}>
      <Header />

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
          Pictures found
          <span className="mx-2 badge bg-info">{hook.state.length}</span>{" "}
        </p>

        <button
          className="btn btn-primary"
          onClick={async () => await hook.handleDownloadAll()}
        >
          Download all
        </button>
      </footer>
    </main>
  );
}

export default App;
