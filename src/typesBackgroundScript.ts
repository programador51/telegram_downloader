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

export interface StreamDecoded {
  dcId: number;
  location: {
    "-": string;
    id: string;
    access_hash: string;
    file_reference: number[];
  };
  size: number;
  mimeType: string;
}

export interface ChunkI extends StreamDecoded {
  url: string;
}

export interface GroupedChunksI {
  [key: string]: string[];
}
