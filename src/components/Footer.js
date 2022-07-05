import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faPlus, faTicketAlt, faHome } from "@fortawesome/free-solid-svg-icons";
import { useContractKit } from "@celo-tools/use-contractkit";
import { errorToast } from "../utils";

export default function Footer() {
  const { address } = useContractKit();

  return (
    <footer className="w-full left-0 bottom-0 fixed justify-center items-center z-[9999]">
      <ul className="footer-container">
        <button
          onClick={function () {
            if (!address) {
              errorToast("Connect wallet to continue");
            }
          }}
          className="flex flex-row items-center space-x-3"
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </button>
        <button
          onClick={function () {
            if (!address) {
              errorToast("Connect wallet to continue");
            }
          }}
          className="add-button"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={function () {
            if (!address) {
              errorToast("Connect wallet to continue");
            }
          }}
          className="flex flex-row items-center space-x-3"
        >
          <FontAwesomeIcon icon={faTicketAlt} />
          <span>My Ticket</span>
        </button>
      </ul>
    </footer>
  );
}
