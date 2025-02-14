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
        iframe.style.cssText = `
          height: 400px !important;
          width: 300px !important;
          position: fixed !important;
          right: 5px !important;
          top: 5px !important;
          z-index: 2147483647 !important;
          border: none !important;
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
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
