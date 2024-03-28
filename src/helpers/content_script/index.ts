export function showHiddenMediaBtns() {
  const cssStyles = `
    .media-viewer-buttons button:nth-child(n+3){
        display:block !important;
    }
    `;

  const styleElement = document.createElement("style");

  styleElement.textContent = cssStyles;

  document.head.appendChild(styleElement);
}
