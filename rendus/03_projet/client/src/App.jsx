import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from "./components/Menu";
import Home from './pages/Home';

import { EthProvider } from "./contexts/EthContext";

import "./App.css";
// import "../node_modules/react-toastify/dist/ReactToastify.css";

const App = () => {

  return (
    <BrowserRouter>
      <EthProvider>
        <Menu />
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </EthProvider>
    </BrowserRouter>
  )
}

export default App;