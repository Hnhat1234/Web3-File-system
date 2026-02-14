import { ethers } from "ethers";
import contractABI from "../abi/FileUploadSystem.json";
import net from "../config/config.json"

/**
 * Read file CID from smart contract
 * @param {string} privateKey
 * @param {string} fileHash
 * @param {string} contractAddress
 */
export const readFile = async (privateKey, fileHash, contractAddress) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      net.URL
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      wallet
    );

    console.log("Reading file:", fileHash);

    const CID = await contract.Read(fileHash);

    console.log("CID:", CID);

    // 🔥 Mở file qua IPFS Desktop local gateway
    const ipfsURL = `http://${net.host}:8080/ipfs/${CID}`;
    window.open(ipfsURL, "_blank");

    return {
      success: true,
      CID,
    };

  } catch (err) {
    console.error("Read failed:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
