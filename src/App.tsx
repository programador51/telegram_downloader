import ui from "./styles.module.scss";
import useAddOn from "./customHooks/useAddOn";
import Header from "./molescules/Header";
import Gallery from "./structure/Gallery";

function App() {
  const hook = useAddOn();

  if (hook.isTelegramK === false)
    return (
      <main className={ui.addOn}>
        <Header />
        <p className="p-5">
          In order to use this extension, you must use web telegram with the
          following adress:
          <a className="mx-2" target="_blank" href="https://web.telegram.org/k">
            https://web.telegram.org/k
          </a>
        </p>
        <p className="mx-5">
          Once you enter the link, close and open this popup
        </p>
      </main>
    );

  if (hook.isTelegramK === null)
    return (
      <main className={ui.addOn}>
        <Header />
        <p className="p-5">Hold up a second, the extension is loading...</p>
      </main>
    );

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
