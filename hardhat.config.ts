import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
  networks: {
    sepolia: {
      type: "http",
      url: "https://sepolia.infura.io/v3/ea99f34628f246bf93c590e50ca71cd2",
    },
    localhost:{
      type: "http",
      url: "http://127.0.0.1:8545",
    },
  },
});