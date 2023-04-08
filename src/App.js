import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetPage from './components/AssetPage';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
export default function App() {
  return (
    <BrowserRouter>
      <Layout/>
      <div style={{background: 'lightgray', height: 'calc(100vh - 74px)', maxWidth:'100vw', overflow: 'auto'}}>
        <Routes>
          <Route path="" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets/:assetName" element={<AssetPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
