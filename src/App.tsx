import React from "react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-gray-100 h-full">
      <div className="bg-white flex min-h-screen max-w-[640px] my-0 mx-auto overflow-x-hidden relative shadow-xl shadow-gray-300">
        <main></main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
