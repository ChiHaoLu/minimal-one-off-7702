import * as dotenv from "dotenv";
import { createWalletClient, http, Hex } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

export const relay = privateKeyToAccount(process.env.RELAY_PRIVATE_KEY as Hex);

const RPC_URL = process.env.RPC_URL as string;  // Please make sure the chain usage in your RPC_URL

export const walletClient = createWalletClient({
  account: relay,
  chain: sepolia,
  transport: http(RPC_URL),
});
