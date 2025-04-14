# Minimal One-Off 7702 Account PoC

> This PoC should be run on Ethereum Sepolia w/ Alchemy Node Provider.

## Requirements

- `node >= v22.14.0`
- `npm >= v10.9.2`

## Run the example

- `$ npm install`
- Fill the fields in `.env`.
- Deposit required tokens into your eoa and relay.
- `$ npx ts-node index.ts`

## Explanation

1. EOA sign the `henShinAuthorization` to **authorize** the [7702 simple account](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/accounts/Simple7702Account.sol).
1. EOA sign the `fukuGenAuthorization` to **UN-authorize** the 7702 simple account. ([reference](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7702.md#in-protocol-revocation))
1. Depends on MultiCall3 contract and `executeBatch` in 7702 simple account, EOA can finish below behaviors in single 7702 transaction:
   1. HEN-SHIN: authorize designation of the Contract onto the EOA.
   1. some complexed operations (e.g., approve and swap on DEX)
   1. FUKU-GEN: un-authorize the designation. If the address field is set to `0x0000000000000000000000000000000000000000`, the previous authorization will be revoked.
