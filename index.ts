import { Address, encodeFunctionData, zeroAddress } from "viem";
import { Simple7702AccountMetadata } from "./artifacts";
import { eoa, publicClient, walletClient } from "./utils/config";
import { preprocess, targetCalls } from "utils/preprocess";

async function main() {
  await preprocess(eoa.address);

  const henShinAuthorization = await walletClient.signAuthorization({
    executor: "self",
    contractAddress: Simple7702AccountMetadata.address as Address,
  });
  console.log(henShinAuthorization);
  const henShinTxHash = await walletClient.sendTransaction({
    authorizationList: [henShinAuthorization],
    data: encodeFunctionData({
      abi: Simple7702AccountMetadata.abi,
      functionName: "executeBatch",
      args: [targetCalls],
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
