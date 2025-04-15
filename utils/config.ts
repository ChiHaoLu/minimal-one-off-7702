import * as dotenv from "dotenv";
import {
  createWalletClient,
  createPublicClient,
  http,
  Hex,
  Address,
} from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

const RPC_URL = process.env.RPC_URL as string; // Please make sure the chain usage in your RPC_URL

export const USDC_ADDRESS =
  "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address;
export const TOKEN_RECIPIENT =
  "0x4d7f573039fddc84fdb28515ba20d75ef6b987ff" as Address;
export const TOKEN_TRANSFER = 100n; // 0.0001 USDC

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
