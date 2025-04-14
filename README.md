# Minimal One-Off 7702 Account PoC

> This proof-of-concept runs on Ethereum Sepolia with an Alchemy node provider.

## Requirements

- `node >= v22.14.0`
- `npm >= v10.9.2`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Fill in the required fields in `.env`.
3. Deposit the necessary tokens into your EOA and relay account.
4. Run the script:
   ```bash
   npx ts-node index.ts
   ```

## PoC Overview

1. The EOA signs a `henShinAuthorization` to **authorize** the [7702 Simple Account](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/accounts/Simple7702Account.sol).
2. The EOA signs a `fukuGenAuthorization` to **de-authorize** the 7702 Simple Account. ([Reference](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7702.md#in-protocol-revocation))
3. Using the `executeBatch` function in the Simple 7702 Account, the following steps can be executed in a single transaction:
   - **HEN-SHIN**: Authorize the account (delegate control to the contract).
   - Execute complex operations, such as `approve` and token swaps on DEXs.
4. A second 7702 transaction can be sent for **FUKU-GEN**: to revoke the authorization. If the `address` field is set to `0x0000000000000000000000000000000000000000`, the previous authorization is invalidated.

## Toward a Single 7702 Transaction Solution

> Our goal is to compress the above three steps into a single 7702 transaction.

1. **Customized 7702 Account**: By introducing a revocation flag or variable in the account contract, revocation logic can be validated during the transaction's verification phase. A call to revoke can then be embedded in the multicall batch.
2. **Use Flashbots Bundles**: Leverage [Flashbots’ bundle API](https://docs.flashbots.net/guide-send-tx-bundle) to simulate atomic execution.

## Gas Profile

TBD — Use Tenderly’s gas profiling tools for analysis.