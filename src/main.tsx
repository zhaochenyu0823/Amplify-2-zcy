import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import NavBar from "./pages/NavBar.tsx";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      {({ signOut }) => (
        <><NavBar /><button onClick={signOut}>Sign out</button></>
      )}
    </Authenticator>
  </React.StrictMode>
);
