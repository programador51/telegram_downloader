import { useRef } from "react";
import { PropsGallery } from "./types";
import ImageDetected from "../../molescules/ImageDetected";
import ui from "./styles.module.scss";

export default function Gallery({ items = [] }: PropsGallery) {
  const key = useRef(`${window.crypto.randomUUID()}`);

  if (items.length <= 0)
    return (
      <div className="p-5">
        <p>1. Scroll throught your chat</p>
        <p>2. Once you find media, re-open this popup</p>

        <hr />

        <p>Thanks for the comprehesion 😁</p>
        <p>The extension must work like this for performance issues</p>
        <small className="font-weight-bold">
          <b>Blame Telegram for anti-download media feature 😡</b>
        </small>
      </div>
    );

  return (
    <div className={ui.gallery}>
      {items.map((image, i) => (
        <ImageDetected
          key={`${key.current}-${i}`}
          blobSrc={image.blob}
          sentAt={1}
          height={image.height}
          width={image.width}
        />
      ))}
    </div>
  );
}
