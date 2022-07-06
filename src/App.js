import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useCallback, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ConnectWallet from "./components/ConnectWallet";
import EventCard from "./components/EventCard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loading from "./components/Loading";
import NoEvent from "./components/NoEvent";
import { useMinterContract } from "./hooks/useMinterContract";
import { errorToast } from "./utils";
import { getEvents, uploadEvent, uploadToIpfs } from "./utils/minter";

function App() {
  const { address, performActions } = useContractKit();
  const mintContract = useMinterContract();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    try {
      if (address && mintContract) {
        getAllEvents();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [mintContract, address, getAllEvents]);

  return (
    <div className="bg-gray-100 h-full">
      <div className="bg-white flex min-h-screen my-0 mx-auto overflow-x-hidden relative shadow-xl shadow-gray-300 home-container">
        <Header />
        <main>
          {!address && <ConnectWallet />}
          {loading && <Loading />}
          {!loading && address && events && events.length > 0 ? (
            <div className="flex flex-col px-6 mt-20">
              <h4 className="mb-6">All events</h4>
              <div className="flex flex-col space-y-4">
                {events.map((event, index) => (
                  <EventCard event={event} key={index} />
                ))}
              </div>
            </div>
          ) : (
            <NoEvent />
          )}
        </main>

        <Footer addEvent={addEvent} />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
