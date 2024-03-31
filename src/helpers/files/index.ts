import JSZip from "jszip";
import { ChunkI, StreamDecoded } from "../../typesBackgroundScript";

export async function zipGallery(gallery: string[]): Promise<Blob> {
  const zip = new JSZip();
  for (let i = 0; i < gallery.length; i++) {

    const name = `${i+1}`.padStart(10,"0");

    zip.file(`${name}.jpg`, gallery[i].split(",")[1], {
      base64: true,
    });
  }

  const data = await zip.generateAsync({ type: "blob" });

  return data;
}

/**
 *
 * @param base64String - Bas64 file
 * @param fileName - Filename for the file once downloaded
 * @example base64String -> "data:image/jpeg;base64,/df/4fsdfsdfsd"
 * fileName -> "myCoverDownloaded.jpg"
 */
export function downloadBase64Content(
  base64String: string,
  fileName = `${window.crypto.randomUUID()}.jpg`
) {
  // Remove the data prefix and split the base64 string
  const base64Data = base64String.split(",")[1];

  // Convert base64 to binary
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byteArray
  const blob = new Blob([byteArray], { type: "image/jpeg" }); // Adjust the type according to your content

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName; // Set the file name for download

  // Append the link to the document body
  document.body.appendChild(link);

  // Trigger the click event to start downloading
  link.click();

  // Cleanup: remove the link and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get the memorize size of the content for the file requested
 * @param fullBase64String - Full base 64 string
 * @returns Size on `bytes`
 */
export function retrieveSize(fullBase64String: string): number {
  const base64String = fullBase64String.split(",")[1];
  const binaryData = atob(base64String);

  // Get the length of the binary data
  const binarySize = binaryData.length;
  return binarySize;
}

function base64toBlob(base64: string) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });
  return blob;
}

export function openInNewTab(base64: string) {
  const image = base64toBlob(base64);

  const imageUrl = URL.createObjectURL(image);
  window.open(imageUrl, "_blank", "toolbar=yes");
}

export function downloadBase64(base64: string) {
  const blob = base64toBlob(base64);

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${window.crypto.randomUUID()}.jpg`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return blob;
}

export function decodeStreamChunks(url: string): ChunkI | undefined {
  const encodedJson = url.split("/").pop();

  if (typeof encodedJson !== "string") return undefined;

  const decodedJson = decodeURIComponent(encodedJson);
  const videoData: StreamDecoded = JSON.parse(decodedJson);

  return {
    ...videoData,
    url,
  };
}

export async function fetchAndCombineStreams(streamUrls:string[]) {
  const responses = await Promise.all(streamUrls.map(url => fetch(url)));
  const blobs = await Promise.all(responses.map(response => response.blob()));

  // Combine blobs into a single file (e.g., concatenate binary data)
  // This step may vary depending on the format and encoding of the video streams

  return new Blob(blobs, { type: "video/mp4" }); // Adjust the MIME type as needed
}

export function downloadCombinedFile(blob:Blob, filename:string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "combined_video.mp4"; // Default filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
