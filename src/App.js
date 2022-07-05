import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { Toaster } from "react-hot-toast";
import ConnectWallet from "./components/ConnectWallet";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useMinterContract } from "./hooks/useMinterContract";
import { getEvents } from "./utils/minter";

function App() {
  const { address } = useContractKit();
  const mintContract = useMinterContract();
  const [events, setEvents] = useState([]);

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
        <main>{!address && <ConnectWallet />}</main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
