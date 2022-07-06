import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useCallback, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ConnectWallet from "./components/ConnectWallet";
import EventCard from "./components/EventCard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loading from "./components/Loading";
import NoEvent from "./components/NoEvent";
import NoTicket from "./components/NoTicket";
import TicketCard from "./components/TicketCard";
import { useMinterContract } from "./hooks/useMinterContract";
import { errorToast } from "./utils";
import {
  addTicket,
  getEvents,
  getTickets,
  uploadEvent,
  uploadToIpfs,
} from "./utils/minter";

function App() {
  const { address, performActions } = useContractKit();
  const mintContract = useMinterContract();
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("home");

  const getTicket = async (data) => {
    if (
      data.eventIndex < 0 ||
      !data.quantity ||
      data.price < 0 ||
      !data.eventImage
    ) {
      errorToast("Please select an event");
      return;
    }
    try {
      await addTicket(mintContract, performActions, {
        ...data,
      });
      getAllEvents();
    } catch (e) {
      console.log(e);
      errorToast("Failed to buy ticket");
    }
  };

  const addEvent = async (data) => {
    if (!data.title || !data.description || !data.price || !data.quantity) {
      errorToast("Please fill all the input");
      return;
    }
    try {
      let imagePath = "";
      if (data.file) {
        imagePath = await uploadToIpfs(data.file);
      }

      await uploadEvent(mintContract, performActions, {
        ...data,
        ipfsImage: imagePath,
      });
      getAllEvents();
    } catch (e) {
      console.log(e);
      errorToast("Failed to create event");
    }
  };

  const getAllEvents = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allEvents = await getEvents(mintContract);
      if (!allEvents) return;

      setEvents(allEvents);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [mintContract]);

  const getAllTickets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allTickets = await getTickets(mintContract);
      if (!allTickets) return;

      setTickets(allTickets);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [mintContract]);

  useEffect(() => {
    try {
      if (address && mintContract) {
        getAllEvents();
        getAllTickets();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [mintContract, address, getAllEvents, getAllTickets]);

  return (
    <div className="bg-gray-100 h-full">
      <div className="bg-white flex min-h-screen my-0 mx-auto overflow-x-hidden relative shadow-xl shadow-gray-300 home-container">
        <Header />
        <main>
          {!address && <ConnectWallet />}
          {loading && <Loading />}
          {tab === "home" && (
            <>
              {!loading && address && events && events.length > 0 ? (
                <div className="flex flex-col px-6 mt-20">
                  <h4 className="mb-6">All events</h4>
                  <div className="flex flex-col space-y-4">
                    {events.map((event, index) => (
                      <EventCard
                        event={event}
                        getTicket={getTicket}
                        key={index}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <NoEvent />
              )}
            </>
          )}
          {tab === "tickets" && (
            <>
              {!loading && address && tickets && tickets.length > 0 ? (
                <div className="flex flex-col px-6 mt-20">
                  <h4 className="mb-6">All tickets</h4>
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-10">
                    {tickets.map((ticket, index) => (
                      <TicketCard ticket={ticket} events={events} key={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <NoTicket />
              )}
            </>
          )}
        </main>

        <Footer
          addEvent={addEvent}
          currentTab={tab}
          changeTab={function (newTab) {
            setTab(newTab);
            if (newTab === "home") {
              getAllEvents();
            } else {
              getAllTickets();
            }
          }}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
