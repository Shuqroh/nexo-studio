import { useContract } from "./useContract";
import NexoStudioAbi from "../utils/NexoStudio.json";
import NexoStudioAddress from "../utils/NexoStudio-address.json";

// export interface for NFT contract
export const useMinterContract = () =>
  useContract(NexoStudioAbi.abi, NexoStudioAddress.NexoStudio);
