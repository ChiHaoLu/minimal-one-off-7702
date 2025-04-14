import * as dotenv from "dotenv";
import { Address, Hex } from "viem";
import { ethers } from "ethers";
import axios from "axios";
import { publicClient } from "utils/config";
dotenv.config();

const FLASHBOTS_URL = "https://relay-sepolia.flashbots.net";

export async function sendFlashbotsBundle(
  privateKey: string,
  toAddress: Address,
  data: Hex,
  authorizationList1: [],
  authorizationList2: []
) {
  const wallet = new ethers.Wallet(privateKey);
  const nonce = await publicClient.getTransactionCount({
    address: wallet.address as Address,
  });
  const gasPrice = await publicClient.getGasPrice();
  const blockNumber = await publicClient.getBlockNumber();

  const tx1 = {
    authorizationList: authorizationList1,
    to: toAddress,
    data: data,
    gasLimit: 150000,
    maxFeePerGas: (gasPrice * 150n) / 100n,
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    nonce,
    type: 4,
    chainId: publicClient.chain.id,
  };
  const tx2 = {
    authorizationList: authorizationList2,
    to: toAddress,
    gasLimit: 150000,
    maxFeePerGas: (gasPrice * 150n) / 100n,
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    nonce: nonce + 1,
    type: 4,
    chainId: publicClient.chain.id,
  };
  const signedTx1 = await wallet.signTransaction(tx1);
  const signedTx2 = await wallet.signTransaction(tx2);
  const bundlePayload = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_sendBundle",
    params: [
      {
        txs: [signedTx1, signedTx2],
        blockNumber: `0x${(blockNumber + 20n).toString(16)}`,
      },
    ],
  };

  const hash = ethers.keccak256(Buffer.from(JSON.stringify(bundlePayload)));
  const signature = await wallet.signMessage(ethers.getBytes(hash));
  const header = `${wallet.address}:${signature}`;

  const res = await axios.post(FLASHBOTS_URL, bundlePayload, {
    headers: {
      "Content-Type": "application/json",
      "X-Flashbots-Signature": header,
    },
  });

  console.log("Flashbots Response:", res.data);
}
