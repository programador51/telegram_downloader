import browser from "webextension-polyfill";
import { CrawledImageDom } from "../../typesContentScript";
import { useContext, useEffect, useState } from "react";
import { MessageBrowserActions } from "../../helpers/content_script/types";
import { downloadBase64, zipGallery } from "../../helpers/files";
import { ContextGlobal } from "../../structure/configuration/Global";
import { saveAs } from "file-saver";

export default function useAddOn() {
  const [state, setState] = useState<CrawledImageDom[]>([]);
  const [isTelegramK, setIsTelegramK] = useState<boolean | null>(null);

  const global = useContext(ContextGlobal);

  useEffect(() => {
    if (global === undefined) return;

    browser.runtime.onMessage.addListener(function (
      message: MessageBrowserActions<"crawledContent">
    ) {
      const parsedMessage: MessageBrowserActions<"crawledContent"> =
        typeof message === "string" ? JSON.parse(message) : message;

      const images =
        typeof parsedMessage.message === "string"
          ? []
          : parsedMessage.message.images;

      appendCrawledImage(images);
    });

    browser.runtime.onMessageExternal.addListener(
      (message: MessageBrowserActions<"crawledContent">) => {
        const parsedMessage: MessageBrowserActions<"crawledContent"> =
          typeof message === "string" ? JSON.parse(message) : message;
        const images =
          typeof parsedMessage.message === "string"
            ? []
            : parsedMessage.message.images;

        appendCrawledImage(images);
      }
    );

    const triggerMessage: MessageBrowserActions<"popUpOpened"> = {
      action: "popUpOpened",
      message: "",
    };

    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([tab]) => {
        const result = checkIsTelegramK(tab.url || "");
        setIsTelegramK(result);
        return;
      });

    browser.runtime.sendMessage(JSON.stringify(triggerMessage));
  }, [global]);

  function checkIsTelegramK(url: string): boolean | null {
    if (url === "") return null;

    const telegramUrlPattern = /^https:\/\/web\.telegram\.org\/k\/.*/;
    return telegramUrlPattern.test(url);
  }

  function appendCrawledImage(dto: string | CrawledImageDom[]) {
    const crawledContent: CrawledImageDom[] =
      typeof dto === "string" ? JSON.parse(dto) : dto;

    const parsed = global?.showThumbnails
      ? crawledContent
      : crawledContent.filter((item) => item.height > 320 && item.width > 320);

    setState(parsed);
  }

  async function handleDownloadAll() {
    if (global?.zipBulkDownloads) {
      const toZip = state.map((item) => item.blob);

      const zippedFiles = await zipGallery(toZip);

      saveAs(zippedFiles, `${window.crypto.randomUUID()}.zip`);
    } else {
      state.forEach((data) => downloadBase64(data.blob));
    }
  }

  return {
    handleDownloadAll,
    state,
    isTelegramK,
  };
}
