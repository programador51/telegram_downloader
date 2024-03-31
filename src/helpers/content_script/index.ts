/**
 * Just overwrites the `css` styles, the buttons are there but with `display:none`
 */
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

export function formatButtonsDownload() {
  const cssStyles = `
    .telegramGoesBrrrrrrr{                
        background:rgba(0, 0, 0, 0.7);
        z-index:100;
        width:100%;
        color:white;
        font-size:1rem;
        position:relative;
        grid-row:1/2;
        max-height:35px;
        min-height:30px;
    }
    `;

  const styleElement = document.createElement("style");

  styleElement.textContent = cssStyles;

  document.head.appendChild(styleElement);

  styleButtonDownloadContainer();
}

function styleButtonDownloadContainer() {
  const cssStyles = `
    .media-container button:not(:last-child){
        display:none;
    }

    .document-thumb + button{
      display:none !important;
    }

    .media-container{
      display:grid;
      grid-template-columns:1fr;
      grid-template-rows:30% 70%;
    }
    `;

  const styleElement = document.createElement("style");

  styleElement.textContent = cssStyles;

  document.head.appendChild(styleElement);
}
