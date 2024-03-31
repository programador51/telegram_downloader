import { CrawledImageDom } from "../../typesContentScript";

export interface CrawlingInformation {
  images: CrawledImageDom[];
  urlTab: string;
}

export type BrowserMessage = "crawledContent" | "popUpOpened" | "chunks";

export interface MessageBrowserActions<T extends BrowserMessage> {
  action: T;
  message: T extends "crawledContent" ? CrawlingInformation | string : string;
}