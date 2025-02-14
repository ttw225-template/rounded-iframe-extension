// Constant for frame ID
const FRAME_ID = "extension-frame";

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked");

  // Skip chrome:// pages for security
  if (!tab.url.startsWith("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      // Use function parameter to avoid duplicate FRAME_ID definition
      func: (frameID) => {
        // Function to remove the extension frame and its event listeners
        function removeFrame() {
          const frame = document.getElementById(frameID);
          if (frame) {
            frame.remove();
            document.removeEventListener("click", window._extensionClickHandler);
            document.removeEventListener("keydown", window._extensionKeyHandler);
          }
        }

        // Check if frame already exists, if so, remove it
        const existingFrame = document.getElementById(frameID);
        if (existingFrame) {
          removeFrame();
          return;
        }

        // Create iframe for extension UI
        const iframe = document.createElement("iframe");
        iframe.id = frameID;

        // The following CSS properties are applied with !important to override any page styles.
        // Some properties are critical for the extension's display, while others are optional for aesthetics.
        iframe.style.cssText = `
          /* ====== Positioning ====== */
          /* Necessary: Use fixed positioning so the iframe stays in the viewport even when scrolling */
          position: fixed !important;

          /* Necessary: Position the iframe 5px from the right edge of the viewport */
          right: 5px !important;

          /* Necessary: Position the iframe 5px from the top of the viewport */
          top: 5px !important;

          /* Necessary: Ensure the iframe is above all other elements. The value is set extremely high */
          z-index: 2147483647 !important;

          /* ====== Sizing ====== */
          /* Optional: Set the height of the iframe. Adjust based on your UI needs. */
          height: 400px !important;

          /* Optional: Set the width of the iframe. Adjust based on your UI needs. */
          width: 300px !important;

          /* ====== Appearance ====== */
          /* Optional: Remove any default border for a cleaner look */
          border: none !important;

          /* Optional: Set the background to transparent. This might be required if the iframe content has its own styling */
          background: transparent !important;

          /* Optional: Remove any default margin that may be applied */
          margin: 0 !important;

          /* Optional: Remove any default padding that may be applied */
          padding: 0 !important;

          /* ====== Visibility ====== */
          /* Optional: Ensure the iframe is rendered as a block element, which is useful for layout consistency */
          display: block !important;

          /* Optional: Explicitly set the iframe to be visible. This is generally the default */
          visibility: visible !important;

          /* Optional: Set the opacity to fully opaque. This is generally the default */
          opacity: 1 !important;

          /* ====== Color Scheme ====== */
          /* Necessary: Force the iframe to always use the light color scheme, even in dark mode */
          color-scheme: light !important;
        `;
        iframe.src = chrome.runtime.getURL("iframe.html");

        // Add iframe to the page
        document.body.appendChild(iframe);

        // Setup click event listener to remove frame when clicking outside the iframe
        window._extensionClickHandler = (e) => {
          const frame = document.getElementById(frameID);
          if (frame && !frame.contains(e.target)) {
            removeFrame();
          }
        };

        // Setup keydown event listener to remove frame when Escape is pressed
        window._extensionKeyHandler = (e) => {
          if (e.key === "Escape") {
            removeFrame();
          }
        };

        // Add event listeners with a slight delay to avoid immediate removal
        setTimeout(() => {
          document.addEventListener("click", window._extensionClickHandler);
          document.addEventListener("keydown", window._extensionKeyHandler);
        }, 100);
      },
      args: [FRAME_ID],
    })
      .then(() => {
        console.log("Script injected successfully");
      })
      .catch((err) => {
        console.error("Failed to inject script:", err);
      });
  } else {
    console.warn("Cannot inject into chrome:// pages");
  }
});
