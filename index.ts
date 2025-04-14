import * as readline from "readline";
import * as dotenv from "dotenv";
import { Address, encodeFunctionData, erc20Abi, Hex, zeroAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Simple7702AccountMetadata } from "./artifacts";
import { relay, walletClient } from "./utils/config";
import { Call } from "utils/types";

dotenv.config();
const eoa = privateKeyToAccount(process.env.EOA_PRIVATE_KEY as Hex);
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address;
const tokenRecipient = "0x4d7f573039fddc84fdb28515ba20d75ef6b987ff" as Address;
const transferAmount = 100n; // 0.0001 USDC

async function main() {
  await waitForDeposit(
    "sending 7702 transaction by relay",
    relay.address,
    "0.01 ETH"
  );
  await waitForDeposit(
    "perfoming example token usage",
    eoa.address,
    `${transferAmount / 1_000_000n} USDC`
  );
  const henShinAuthorization = await walletClient.signAuthorization({
    account: eoa,
    contractAddress: Simple7702AccountMetadata.address as Address,
  });
  const fukuGenAuthorization = await walletClient.signAuthorization({
    account: eoa,
    contractAddress: zeroAddress,
  });
  const calls: Call[] = [
    {
      target: USDC_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [tokenRecipient, transferAmount],
      }),
    },
    {
      target: USDC_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "transferFrom",
        args: [eoa.address, tokenRecipient, transferAmount],
      }),
    },
    // TODO: revoke the HEN-SHIN
    {
      target: zeroAddress,
      value: 0n,
      data: "0x",
    },
  ];
  const hash = await walletClient.writeContract({
    abi: Simple7702AccountMetadata.abi,
    address: eoa.address,
    authorizationList: [henShinAuthorization],
    functionName: "executeBatch",
    args: [calls],
  });
  console.log(`7702 Transaction hash: ${hash}`);
}

function waitForDeposit(
  reason: string,
  address: Address,
  amountAndTokenStatement: string
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(
      `For ${reason}, \nplease deposit at least ${amountAndTokenStatement} in your address: ${address}. \n After deposit, please press Enter.`,
      (ans) => {
        rl.close();
        resolve(ans);
      }
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
