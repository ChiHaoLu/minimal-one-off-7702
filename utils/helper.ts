import * as readline from "readline";
import { Address } from "viem";

export function waitForDeposit(
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
