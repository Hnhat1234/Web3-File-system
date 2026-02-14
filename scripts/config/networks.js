import dotenv from "dotenv";

dotenv.config();

export const networks = {
    sepolia: {
        type: "http",
        url: process.env.RPC_URL,
    },

    local: {
        type: "http",
        url: "http://127.0.0.1:8545",
    }
}