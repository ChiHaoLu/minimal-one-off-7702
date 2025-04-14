import * as dotenv from "dotenv";
import { createWalletClient, createPublicClient, http, Hex } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

const RPC_URL = process.env.RPC_URL as string; // Please make sure the chain usage in your RPC_URL

export const eoa = privateKeyToAccount(process.env.EOA_PRIVATE_KEY as Hex);

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

export const walletClient = createWalletClient({
  account: eoa,
  chain: sepolia,
  transport: http(RPC_URL),
});
