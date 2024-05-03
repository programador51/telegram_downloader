import { CrawledImageDom } from "../../typesContentScript";

export interface ReturnUseAddOn {
  state: CrawledImageDom[];
  isTelegramK: boolean | null;
  handleDownloadAll: () => Promise<void>;
  attemptDownloadFile: (blob:string) => Promise<void>;
}
