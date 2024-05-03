import { CrawledImageDom } from "../../typesContentScript";

export interface CrawlingInformation {
  images: CrawledImageDom[];
  urlTab: string;
}

export type BrowserMessage = "crawledContent" | "popUpOpened" | "chunks" | "downloadImage";

export interface MessageBrowserActions<T extends BrowserMessage> {
  action: T;
  message: T extends "crawledContent"
    ? CrawlingInformation|string
    : T extends "popUpOpened"
    ? string
    : T extends "chunks"
    ? string
    : T extends "downloadImage"
    ? DownloadImageMessage
    : string
}

export interface DownloadImageMessage{
  base64:string;
}