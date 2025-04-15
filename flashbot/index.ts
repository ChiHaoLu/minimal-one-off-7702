import { Address, encodeFunctionData, zeroAddress } from "viem";
import { Simple7702AccountMetadata } from "../artifacts";
import { eoa, walletClient } from "../utils/config";
import { sendFlashbotsBundle } from "flashbot/flashbot";
import { preprocess, targetCalls } from "utils/preprocess";

async function main() {
  await preprocess(eoa.address);

  const henShinAuthorization = await walletClient.signAuthorization({
    executor: "self",
    contractAddress: Simple7702AccountMetadata.address as Address,
  });
  console.log(henShinAuthorization);
  const fukuGenAuthorization = await walletClient.signAuthorization({
    executor: "self",
    contractAddress: zeroAddress,
    nonce: henShinAuthorization.nonce + 1,
  });
  console.log(fukuGenAuthorization);

  await sendFlashbotsBundle(
    walletClient.account.address,
    encodeFunctionData({
      abi: Simple7702AccountMetadata.abi,
      functionName: "executeBatch",
      args: [targetCalls],
    }),
    [henShinAuthorization],
    [fukuGenAuthorization]
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
