import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faPlus, faTicketAlt, faHome } from "@fortawesome/free-solid-svg-icons";
import { useContractKit } from "@celo-tools/use-contractkit";
import { errorToast } from "../utils";
import NewEventModal from "./modals/NewEventModal";

export default function Footer({ addEvent, currentTab, changeTab }) {
  const { address } = useContractKit();
  const [createEventModal, setCreateEventModal] = useState(false);

  return (
    <footer className="w-full left-0 bottom-0 fixed justify-center items-center z-[9999]">
      <ul className="footer-container">
        <button
          onClick={function () {
            if (!address) {
              errorToast("Connect wallet to continue");
              return;
            }
            changeTab("home");
          }}
          className="flex flex-row items-center space-x-3"
        >
          <FontAwesomeIcon icon={faHome} />
          <span className={currentTab === "home" ? "underline" : ""}>Home</span>
        </button>
        <button
          onClick={function () {
            if (!address) {
              errorToast("Connect wallet to continue");
              return;
            }
            setCreateEventModal(!createEventModal);
          }}
          className="add-button"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={function () {
            if (!address) {
              errorToast("Connect wallet to continue");
              return;
            }
            changeTab("tickets");
          }}
          className="flex flex-row items-center space-x-3"
        >
          <FontAwesomeIcon icon={faTicketAlt} />
          <span className={currentTab === "tickets" ? "underline" : ""}>
            My Ticket
          </span>
        </button>
      </ul>
      <NewEventModal
        addEvent={addEvent}
        isOpen={createEventModal}
        onClosed={function () {
          setCreateEventModal(!createEventModal);
        }}
      />
    </footer>
  );
}
