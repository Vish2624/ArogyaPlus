import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

// Self-hosted fonts (replaces the old Google Fonts <link> in index.html) - removes two
// cross-origin round trips (fonts.googleapis.com CSS + fonts.gstatic.com font files) that
// otherwise sit in front of first text paint, which matters directly for LCP since the Hero
// H1 is styled in "Plus Jakarta Sans" and is very likely the LCP element on the homepage.
// Only the weights actually used (matches the previous Google Fonts URL) are imported.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Opts into React Router v7's behavior early (silences its own console warnings about
          this) - v7_startTransition wraps route-state updates in startTransition, and
          v7_relativeSplatPath changes relative-path resolution under a splat route; this app's
          only splat route is the catch-all NotFoundPage, which has no nested relative links, so
          there's nothing here for that change to actually affect. */}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
