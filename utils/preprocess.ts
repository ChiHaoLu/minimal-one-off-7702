import { encodeFunctionData, erc20Abi, Address } from "viem";
import {
  eoa,
  TOKEN_RECIPIENT,
  TOKEN_TRANSFER,
  USDC_ADDRESS,
} from "../utils/config";
import { Call } from "utils/types";
import { waitForDeposit } from "utils/helper";

export const targetCalls: Call[] = [
  {
    target: USDC_ADDRESS,
    value: 0n,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [TOKEN_RECIPIENT, TOKEN_TRANSFER],
    }),
  },
  {
    target: USDC_ADDRESS,
    value: 0n,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transferFrom",
      args: [eoa.address, TOKEN_RECIPIENT, TOKEN_TRANSFER],
    }),
  },
];

export async function preprocess(address: Address) {
  await waitForDeposit("sending 7702 transaction by EOA", address, "0.01 ETH");
  await waitForDeposit("perfoming example token usage", address, `0.001 USDC`);
}
