import { Address, Hex } from "viem";

export interface Call {
  target: Address;
  value: BigInt;
  data: Hex;
}