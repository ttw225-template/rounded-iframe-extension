# Web Extension Template

This project is a web extension template that demonstrates how to create an iframe with rounded corners. The following section explains the CSS settings applied to the iframe and their purposes.

## iframe CSS Settings

Below is the code snippet from `service-worker.js` that creates the iframe for the extension UI:

```typescript
// Create an iframe element for the extension UI
const iframe: HTMLIFrameElement = document.createElement("iframe");
iframe.id = frameID;

// The following CSS properties are applied with !important to override any page styles.
// Some properties are critical for the extension's display, while others are optional for aesthetics.
iframe.style.cssText = `
  /* Optional: Set the height of the iframe. Adjust based on your UI needs. */
  height: 400px !important;

  /* Optional: Set the width of the iframe. Adjust based on your UI needs. */
  width: 300px !important;

  /* Necessary: Use fixed positioning so the iframe stays in the viewport even when scrolling. */
  position: fixed !important;

  /* Necessary: Position the iframe 5px from the right edge of the viewport. */
  right: 5px !important;

  /* Necessary: Position the iframe 5px from the top of the viewport. */
  top: 5px !important;

  /* Necessary: Ensure the iframe is above all other elements. The value is set extremely high. */
  z-index: 2147483647 !important;

  /* Optional: Remove any default border for a cleaner look. */
  border: none !important;

  /* Optional: Set the background to transparent. This might be required if the iframe content has its own styling. */
  background: transparent !important;

  /* Optional: Remove any default margin that may be applied. */
  margin: 0 !important;

  /* Optional: Remove any default padding that may be applied. */
  padding: 0 !important;

  /* Optional: Ensure the iframe is rendered as a block element, which is useful for layout consistency. */
  display: block !important;

  /* Optional: Explicitly set the iframe to be visible. This is generally the default. */
  visibility: visible !important;

  /* Optional: Set the opacity to fully opaque. This is generally the default. */
  opacity: 1 !important;
`;

// Set the iframe's source to the extension's HTML file
iframe.src = chrome.runtime.getURL("iframe.html");
