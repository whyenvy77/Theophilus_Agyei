import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Documents from "./pages/Documents";
import PDFPreview from "./pages/PDFPreview";

export default function App() {
  const location = useLocation();
  const isPreviewPage = location.pathname.startsWith("/preview");

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {!isPreviewPage && <Navbar />}

      {/* ✅ SCROLL RESET ON ROUTE CHANGE */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/preview/:filename" element={<PDFPreview />} />
      </Routes>

      {!isPreviewPage && <Footer />}
    </div>
  );
}
