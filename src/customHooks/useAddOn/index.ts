import browser from "webextension-polyfill";
import { CrawledImageDom } from "../../typesContentScript";
import { useContext, useEffect, useState } from "react";
import { MessageBrowserActions } from "../../helpers/content_script/types";
import { blobToBase64, zipGallery } from "../../helpers/files";
import { ContextGlobal } from "../../structure/configuration/Global";
import { ReturnUseAddOn } from "./types";

export default function useAddOn():ReturnUseAddOn {
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

      const b64ZipFile = await blobToBase64(zippedFiles);
      attemptDownloadFile(`data:application/zip;base64,${b64ZipFile}`)
    } else {
      state.forEach((data) => attemptDownloadFile(data.blob));
    }
  }

  /**
   * Download the file with `background_scripts` file
   * @param blob - Url of the blob
   */
  async function attemptDownloadFile(blob:string){
    const dto:MessageBrowserActions<"downloadImage"> = {
      action:"downloadImage",
      message:{
        base64:blob
      }
    }

    browser.runtime.sendMessage(JSON.stringify(dto));
  }

  return {
    handleDownloadAll,
    state,
    isTelegramK,
    attemptDownloadFile
  };
}
