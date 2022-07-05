import { useContract } from "./useContract";
import NexoStudioAbi from "../contracts/NexoStudio.json";
import NexoStudioAddress from "../contracts/NexoStudio-address.json";

// export interface for NFT contract
export const useMinterContract = () =>
  useContract(NexoStudioAbi.abi, NexoStudioAddress.NexoStudio);
