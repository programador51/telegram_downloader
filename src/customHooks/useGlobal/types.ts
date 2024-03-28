export interface GlobalStateI {
  showThumbnails: boolean;
  zipBulkDownloads: boolean;
  displayDownloadOnChat: boolean;
  initialLoad:boolean;
}

export interface ReturnUseGlobal extends GlobalStateI {
  setShowThumbnails: (showThumbnails: boolean) => void;
  setBulkDownload: (zipBulkDownloads: boolean) => void;
  setDisplayDownloadOnChat: (displayDownloadOnChat: boolean) => void;
}
