import { Manifest } from "./types";

export const manifest: Manifest = {
  description:
    "Allow download telegram media from channels or groups with media protection",
  name: "Telegram Downloader",
  version: "1.0.0",
  manifest_version: 1,
  icons: {
    "48": "tg.jpg",
  },
  browser_action: {
    default_popup: "index.html",
    default_title: "Telegram downloader",
    default_icon: {
      "48": "tg.jpg",
    },
  },
};
