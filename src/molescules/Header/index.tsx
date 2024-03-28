import SettingsNav from "../SettingsNav";
import ui from "./styles.module.scss";

export default function Header() {
  return (
    <div className={ui.header}>
      <SettingsNav />
      <h1>Telegram Downloader 1.0.0</h1>
    </div>
  );
}
