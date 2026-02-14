import { ethers } from "ethers";
import abi from "../abi/FileUploadSystem.json";

const CONTRACT_ADDRESS = "0xYourAddress";

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
};
