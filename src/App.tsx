import ui from "./styles.module.scss";
import useAddOn from "./customHooks/useAddOn";
import Header from "./molescules/Header";
import Gallery from "./structure/Gallery";

function App() {
  const hook = useAddOn();

  return (
    <main className={ui.addOn}>
      <Header />

      <Gallery items={hook.state} />

      {hook.state.length >= 1 ? (
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
      ) : null}
    </main>
  );
}

export default App;
