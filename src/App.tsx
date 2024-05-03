import ui from "./styles.module.scss";
import useAddOn from "./customHooks/useAddOn";
import Header from "./molescules/Header";
import Gallery from "./structure/Gallery";
import { createContext } from "react";
import { ReturnUseAddOn } from "./customHooks/useAddOn/types";
import ClickMe from "./molescules/Clickme";

export const AddOnContext = createContext<ReturnUseAddOn | undefined>(
  undefined
);

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

        <div className={`mx-5 ${ui.pleaseClickMe}`}>
          <p>Btw, if you like this extension check out my other works</p>
          <ClickMe />
        </div>
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
    <AddOnContext.Provider value={hook}>
      <main className={ui.addOn}>
        <Header />

        <Gallery items={hook.state} />

        {hook.state.length >= 1 ? (
          <footer>
            <p className="m-0">
              Pictures found
              <span className="mx-2 badge bg-info">{hook.state.length}</span>
            </p>

            <div className={ui.footerInfo}>
              <ClickMe />

              <button
                className="btn btn-primary btn-sm"
                onClick={async () => await hook.handleDownloadAll()}
              >
                Download all
              </button>
            </div>
          </footer>
        ) : null}
      </main>
    </AddOnContext.Provider>
  );
}

export default App;
