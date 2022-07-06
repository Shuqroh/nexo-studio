import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import WalletIcon from "./WalletIcon";

export default function Header() {
  const { address, connect, destroy } = useContractKit();
  return (
    <header className="">
      <div className="w-full flex flex-row justify-between items-center text-white px-2 md:px-5">
        {address ? (
          <a
            href={`https://alfajores-blockscout.celo-testnet.org/address/${address}/transactions`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center"
          >
            <WalletIcon address={address} size={28} className="mr-2" />{" "}
            {address.slice(0, 6)}...
            {address.slice(-4)}{" "}
          </a>
        ) : (
          <h4>NexoStudio</h4>
        )}
        {address ? (
          <button
            className="bg-white bg-opacity-30 h-10 text-sm rounded-md py-1 px-2"
            onClick={destroy}
          >
            Disconnect
          </button>
        ) : (
          <button
            className="bg-white bg-opacity-30 h-10 text-sm rounded-md py-1 px-2"
            onClick={connect}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
