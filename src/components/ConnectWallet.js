import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";

export default function ConnectWallet() {
  const { connect } = useContractKit();
  return (
    <div className="m-auto h-96 flex flex-col items-center justify-center overflow-y-hidden">
      <h4>Please connect wallet to continue</h4>
      <button
        className="bg-black text-white h-10 text-sm rounded-md py-1 px-2"
        onClick={connect}
      >
        Connect Wallet
      </button>
    </div>
  );
}
