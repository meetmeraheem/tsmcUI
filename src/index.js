import { StrictMode } from "react";
import App from './containers/App';
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <App />
  // <StrictMode>
  //   <App />
  // </StrictMode>
);

