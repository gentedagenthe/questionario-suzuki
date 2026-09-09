import React from "react";
import Questionario from "./components/Questionario";
import Admin from "./components/Admin";

function App() {
  const path = window.location.pathname;

  if (path === "/admin") {
    return <Admin />;
  }

  return <Questionario />;
}

export default App;
