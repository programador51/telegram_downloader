import { CrawledImageDom } from "../../typesContentScript";

export type BrowserMessage = "crawledContent" | "popUpOpened";

export interface MessageBrowserActions<T extends BrowserMessage> {
  action: T;
  message: T extends "crawledContent" ? CrawledImageDom[] | string : string;
}
