import browser from "webextension-polyfill";
import { CrawledImageDom } from "../../typesContentScript";
import { useEffect, useState } from "react";
import { MessageBrowserActions } from "../../helpers/content_script/types";
import { downloadBase64 } from "../../helpers/files";

export default function useAddOn() {
  const [state, setState] = useState<CrawledImageDom[]>([]);


  useEffect(() => {
    console.log('Hello world :)')

    browser.runtime.onMessage.addListener(function (
      message: MessageBrowserActions<"crawledContent">
    ) {
      const parsedMessage: MessageBrowserActions<"crawledContent"> =
        typeof message === "string" ? JSON.parse(message) : message;

      appendCrawledImage(parsedMessage.message);
    });

    browser.runtime.onMessageExternal.addListener(
      (message: MessageBrowserActions<"crawledContent">) => {
        const parsedMessage: MessageBrowserActions<"crawledContent"> =
          typeof message === "string" ? JSON.parse(message) : message;

        appendCrawledImage(parsedMessage.message);
      }
    );

    const triggerMessage: MessageBrowserActions<"popUpOpened"> = {
      action: "popUpOpened",
      message: "",
    };

    browser.runtime.sendMessage(JSON.stringify(triggerMessage));
  }, []);

  function appendCrawledImage(dto: string | CrawledImageDom[]) {
    const crawledContent: CrawledImageDom[] =
      typeof dto === "string" ? JSON.parse(dto) : dto;

    setState(crawledContent);
  }

  function handleDownloadAll() {
    state.forEach((data) => downloadBase64(data.blob));
  }

  return {
    handleDownloadAll,
    state,
  };
}
