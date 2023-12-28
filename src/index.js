import React from "react";
import { hydrate, render } from "react-dom";
import "./index.css";
import App from "./components/ScrabbleScoreKeeper/App";
import * as serviceWorker from "./serviceWorker";
import { logEventInit } from "./logic/util";

/*This initializes amplitude event tracking instance*/
logEventInit();

const rootElement = document.getElementsByClassName("content")[0];
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
