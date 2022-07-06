import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";

export default function TicketCard({ ticket, events }) {
  const event =
    events.length > 0
      ? events.find((item) => item.index === parseInt(ticket.eventIndex))
      : null;

  console.log(ticket);

  return (
    <div
      className="flex items-center justify-center bg-gray-100"
      style={{
        height: "350px",
      }}
    >
      <div className="relative flex flex-col rounded-xl w-full max-w-sm bg-white shadow-md m-4 pt-4 items-center justify-center">
        <div
          className="absolute rounded-xl border-4 border-gray-100 p-4 bg-blue-400"
          style={{ top: "-60px" }}
          width="100"
        >
          <img src={ticket.image} className="h-14 w-14" alt="NFT" />
        </div>
        <div className="py-4">
          <p className="mt-4 flex items-center justify-center text-4xl leading-none font-bold text-gray-900">
            {event ? event.price : 0} CELO
          </p>
          <p className="mt-2 flex items-center justify-center text-md leading-none font-normal text-gray-500">
            {event && event.title}
          </p>
        </div>
        <div className="flex flex-row w-full justify-center items-center">
          <div
            className="rounded-full bg-gray-100"
            style={{ marginLeft: "-10px", height: "25px", width: "25px" }}
          ></div>
          <div className="border-t-2 border-gray-400 border-dashed w-full"></div>
          <div
            className="rounded-full bg-gray-100"
            style={{ marginRight: "-10px", height: "25px", width: "25px" }}
          ></div>
        </div>

        <div className="flex flex-row w-full px-4 py-4">
          <div className="h-12 w-24 rounded-md bg-blue-300 p-2 mr-2 text-white flex items-center justify-center">
            <FontAwesomeIcon icon={faTicketAlt} />
          </div>
          <div className="flex flex-col justify-center w-full">
            <p className="text-gray-500 font-semibold">{event.title}</p>
            {/* <p className="text-gray-700 font-bold">description</p> */}
          </div>
          <div className="flex flex-col justify-center w-full items-end">
            <p className="text-gray-900 font-bold text-xl">
              {event ? event.price : 0} CELO
            </p>
          </div>
        </div>
        <div className="border-t-2 border-gray-300 border-separate w-full"></div>
        <div className="flex flex-row w-full px-4 justify-between pt-4">
          <p className="text-gray-700 font-semibold">Total</p>
          <p className="text-gray-900 font-bold text-xl">
            {event ? event.price : 0} CELO
          </p>
        </div>
      </div>
    </div>
  );
}
