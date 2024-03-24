export interface Manifest {
  manifest_version: number;
  name: string;
  version: string;
  description: string;
  icons?: {
    [size: string]: string; // Key-value pairs where the key is the size (e.g., "48") and the value is the path to the icon file
  };
  background?: {
    service_worker: string; // Path to the background script file
  };
  permissions?: string[]; // Array of permissions required by the extension
  browser_action?: BrowserAction;
  options_ui?: {
    page: string; // Path to the options page HTML file
    open_in_tab?: boolean; // Whether to open the options page in a new tab (optional)
  };
  content_scripts?: {
    matches: string[]; // Array of URLs where content scripts should be injected
    js: string[]; // Array of paths to the content script files
  }[];
}

export interface BrowserAction {
  default_popup: string;
  default_title: string;
  default_icon: { [key: string]: string };
}
