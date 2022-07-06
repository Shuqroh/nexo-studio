import React, { useState } from "react";
import WalletIcon from "./WalletIcon";

export default function EventCard({ event, getTicket }) {
  const [loading, setLoading] = useState(false);

  const buy = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await getTicket({
        eventIndex: event.index,
        price: parseInt(event.price),
        quantity: 1,
        eventImage:
          event.image !== ""
            ? event.image
            : "https://cryptologos.cc/logos/celo-celo-logo.svg",
      });
      setLoading(false);
    } catch (e) {
      //
      setLoading(false);
    }
  };

  return (
    <div className="card-media">
      <div className="card-media-object-container">
        <div
          className="card-media-object"
          style={{
            backgroundImage: `url(${
              event.image !== ""
                ? event.image
                : "https://cryptologos.cc/logos/celo-celo-logo.svg"
            })`,
          }}
        ></div>

        <span className="card-media-object-tag subtle">
          {parseInt(event.quantity) > 0 ? "Selling Fast" : "Out of stock"}
        </span>
      </div>
      <div className="card-media-body">
        <div className="card-media-body-top">
          <span className="subtle">{event.title}</span>
        </div>
        <span className="card-media-body-heading">
          {event.description.length > 65
            ? event.description.substring(0, 65) + "..."
            : event.description}
        </span>
        <div className="card-media-body-supporting-bottom">
          <span className="card-media-body-supporting-bottom-text subtle">
            <WalletIcon address={event.owner} size={10} className="mr-2" />{" "}
            {event.owner.slice(0, 6)}...
            {event.owner.slice(-4)}{" "}
          </span>
          <span className="card-media-body-supporting-bottom-text subtle u-float-right">
            {event.price}CELO
          </span>
        </div>
        <div className="card-media-body-supporting-bottom card-media-body-supporting-bottom-reveal">
          <span className="card-media-body-supporting-bottom-text subtle"></span>
          {parseInt(event.quantity) > 0 && (
            <button
              onClick={async function () {
                buy();
              }}
              className="card-media-body-supporting-bottom-text card-media-link u-float-right"
            >
              BUY TICKET
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
