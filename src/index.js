import React from "react";
import "./modern-normalize.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import { hydrate, render } from "react-dom";
import ReactDOM from 'react-dom/client';
import "./utils.css";

// const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//     hydrate(<RecoilRoot> <App /> </RecoilRoot>, rootElement);
// } else {
//     render(<RecoilRoot> <App /> </RecoilRoot>, rootElement);
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    {" "}
    <App />{" "}
  </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
