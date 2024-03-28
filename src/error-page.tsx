import ui from "./styles.module.scss";

export default function ErrorPage() {
  return (
    <div className={ui.errorContainer}>
      <h1>Hello stranger</h1>
      <p>
        You shouldn't be seeing this, i don't know how you did this but. Get in
        touch with me cause this is a bug 😸
      </p>
      <a href="https://t.me/pptronix" target="_blank">
        @pptronix
      </a>
    </div>
  );
}
