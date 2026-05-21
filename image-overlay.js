const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      /* Reset */
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      /* Layout */
      .container {
        display: inline-block;
        padding: 8px;
        box-sizing: border-box;
      }

      /* Shared card styling for both the placeholder and the image */
      .card {
        background: rgba(255, 255, 255, 0.92);
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        overflow: hidden;
      }

      /* Image card */
      .image-card { max-width: 320px; }
      .image-card img {
        display: block;
        width: 100%;
        height: auto;
        max-height: 240px;
        object-fit: contain;
      }
      .caption {
        padding: 6px 10px;
        font-size: 12px;
        color: #333;
        line-height: 1.4;
        word-break: break-word;
      }

      /* Placeholder card */
      .placeholder {
        padding: 12px 16px;
        max-width: 280px;
        font-size: 13px;
        color: #555;
        line-height: 1.4;
      }

      /* Visibility toggle */
      .hidden { display: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Two mutually-exclusive states: placeholder OR image -->
      <div id="placeholder" class="card placeholder"></div>
      <div id="imageCard" class="card image-card hidden">
        <img id="image" alt="" />
        <div id="caption" class="caption hidden"></div>
      </div>
    </div>
    <script>
      const EMPTY_MESSAGE = "The image URL has not been set";
      const ERROR_MESSAGE = "Image could not be loaded";

      const placeholder = document.getElementById("placeholder");
      const imageCard = document.getElementById("imageCard");
      const imageEl = document.getElementById("image");
      const captionEl = document.getElementById("caption");

      // Switch between the two states with a single call
      function showPlaceholder(message) {
        placeholder.textContent = message;
        placeholder.classList.remove("hidden");
        imageCard.classList.add("hidden");
      }
      function showImage() {
        placeholder.classList.add("hidden");
        imageCard.classList.remove("hidden");
      }

      function render({ imageUrl, text } = {}) {
        if (!imageUrl?.trim()) {
          showPlaceholder(EMPTY_MESSAGE);
          return;
        }

        // Caption: shown only when non-empty
        if (text?.trim()) {
          captionEl.textContent = text;
          captionEl.classList.remove("hidden");
        } else {
          captionEl.classList.add("hidden");
        }

        // Attach handlers BEFORE setting src to avoid missing the load event on cached images.
        // onerror hides <img> entirely so the browser never shows a broken-image icon.
        imageEl.onload = showImage;
        imageEl.onerror = () => showPlaceholder(ERROR_MESSAGE);
        imageEl.src = imageUrl.trim();
      }

      // Initial state
      showPlaceholder(EMPTY_MESSAGE);

      // Receive property updates from the WASM side
      window.addEventListener("message", (e) => {
        if (e.data?.type === "update") render(e.data.property);
      });

      // Tell the WASM side we're listening (handshake)
      parent.postMessage({ type: "ready" }, "*");
    </script>
  </body>
</html>
`;

reearth.ui.show(html);

// Read the current inspector values. Fields nest under their group id ("default" in reearth.yml).
const getProperty = () => reearth.extension.widget?.property?.default ?? {};

// Send the current property to the iframe
const push = () => reearth.ui.postMessage({ type: "update", property: getProperty() });

// Handshake: iframe announces "ready" once its listener is attached, so the first push isn't lost.
reearth.extension.on("message", (msg) => {
  if (msg?.type === "ready") push();
});

// Re-push on inspector edits so the overlay updates live.
reearth.ui.on("update", push);
