import * as dotenv from "dotenv";
import { Address, encodeFunctionData, erc20Abi, zeroAddress } from "viem";
import { Simple7702AccountMetadata } from "./artifacts";
import { eoa, publicClient, walletClient } from "./utils/config";
import { Call } from "utils/types";
import { waitForDeposit } from "utils/helper";

dotenv.config();
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address;
const tokenRecipient = "0x4d7f573039fddc84fdb28515ba20d75ef6b987ff" as Address;
const transferAmount = 100n; // 0.0001 USDC

async function main() {
  await waitForDeposit(
    "sending 7702 transaction by EOA",
    eoa.address,
    "0.01 ETH"
  );
  await waitForDeposit(
    "perfoming example token usage",
    eoa.address,
    `0.001 USDC`
  );

  const henShinAuthorization = await walletClient.signAuthorization({
    executor: "self",
    contractAddress: Simple7702AccountMetadata.address as Address,
  });
  console.log(henShinAuthorization);
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
  ];
  const txHash = await walletClient.sendTransaction({
    authorizationList: [henShinAuthorization],
    to: walletClient.account.address,
  });
  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log(`Hen-Shin 7702 Transaction hash: ${txHash}`);
  const callTxHash = await walletClient.sendTransaction({
    data: encodeFunctionData({
      abi: Simple7702AccountMetadata.abi,
      functionName: "executeBatch",
      args: [calls],
    }),
    to: walletClient.account.address,
  });
  await publicClient.waitForTransactionReceipt({
    hash: callTxHash,
  });
  console.log(`Multicall Transaction hash: ${callTxHash}`);
  return 
  const henShinTxHash = await walletClient.sendTransaction({
    authorizationList: [henShinAuthorization],
    data: encodeFunctionData({
      abi: Simple7702AccountMetadata.abi,
      functionName: "executeBatch",
      args: [calls],
    }),
    to: walletClient.account.address,
  });
  await publicClient.waitForTransactionReceipt({
    hash: henShinTxHash,
  });
  console.log(`Hen-Shin 7702 Transaction hash: ${henShinTxHash}`);
  let bytecode = await publicClient.getCode({
    address: walletClient.account.address,
  });
  console.log("Bytecode after Hen-Shin: ", bytecode);

  const fukuGenAuthorization = await walletClient.signAuthorization({
    executor: "self",
    contractAddress: zeroAddress,
  });
  console.log(fukuGenAuthorization);
  const fukuGenTxHash = await walletClient.sendTransaction({
    authorizationList: [fukuGenAuthorization],
    to: walletClient.account.address,
  });
  await publicClient.waitForTransactionReceipt({
    hash: fukuGenTxHash,
  });
  console.log(`Fuku-Gen 7702 Transaction hash: ${fukuGenTxHash}`);
  bytecode = await publicClient.getCode({
    address: walletClient.account.address,
  });
  console.log("Bytecode after Fuku-Gen: ", bytecode);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
