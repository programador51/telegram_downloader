export interface GlobalStateI {
  showThumbnails: boolean;
  zipBulkDownloads: boolean;
  displayDownloadOnChat: boolean;
  initialLoad: boolean;
  downloadPath: string;
  typePath:TypePath;
}

export type TypePath = "default" | "root" | "custom";

export type IndexedTypePath = {
  [key in TypePath]:TypePath|string;
}

export type SetPathDownload = (type: TypePath, path?: string) => void;

export interface ReturnUseGlobal extends GlobalStateI {
  setShowThumbnails: (showThumbnails: boolean) => void;
  setBulkDownload: (zipBulkDownloads: boolean) => void;
  setDisplayDownloadOnChat: (displayDownloadOnChat: boolean) => void;
  setPathDownload: SetPathDownload;
  pathTypes:IndexedTypePath;
}
