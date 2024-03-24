import {
  BrowserMessage,
  MessageBrowserActions,
} from "./helpers/content_script/types";

export interface AddOnMessage {
  action: BrowserMessage;
  message: string;
}

export interface IndexedActions {
  [key: string]: () => Promise<void>;
}

// Restrict keys of IndexedActions to only AddOnAction values
export type ValidIndexedActions = {
  ["popUpOpened"]: () => Promise<void>;
  ["crawledContent"]: (
    information: MessageBrowserActions<"crawledContent">
  ) => void;
};
