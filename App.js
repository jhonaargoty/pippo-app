import React from "react";
import MyContextProvider from "./context";

import Routes from "./Routes";

function App() {
  return (
    <MyContextProvider>
      <Routes />
    </MyContextProvider>
  );
}

export default App;
