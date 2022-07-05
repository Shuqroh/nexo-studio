import React from "react";

export default function Footer() {
  return (
    <footer className="w-full h-[60px] left-0 bottom-0 fixed justify-center items-center z-[9999]">
      <ul className="bg-black w-full h-full items-center justify-evenly flex flex-row max-w-[640px] my-0 mx-auto text-white">
        <li>Home</li>
        <li>Add Ticket</li>
        <li>My Ticket</li>
      </ul>
    </footer>
  );
}
