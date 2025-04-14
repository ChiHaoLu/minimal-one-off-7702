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

## Rationale

- If your 7702 transaction gas is paid by the relay, you need to use the EntryPoint because the `execute` function requires the `msg.sender` should be `self` or `EntryPoint`. ([reference](https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/accounts/Simple7702Account.sol#L43))

## Gas Profile

Example result:

```
{
  address: '0x4Cd241E8d1510e30b2076397afc7508Ae59C66c9',
  chainId: 11155111,
  nonce: 338,
  r: '0x2233ef0d7dbc9f4fda3325884f2894e0258424575a5d26c15e67a43ccf63e6ce',
  s: '0x22982f0d9d3d64d48cc780ccf4e420df9b7e9cfbda0945c88bfb3049bbdba0e7',
  v: 28n,
  yParity: 1
}
Hen-Shin 7702 Transaction hash: 0xc64224c6db9c8312f7237bfac1c981210a8e6fb635ce09a9243a61adf491bf49
{
  address: '0x0000000000000000000000000000000000000000',
  chainId: 11155111,
  nonce: 339,
  r: '0x1cc734c7f769b76ad35bb0734ce3c1e892828a40d077ee2f10ce8390dd74fcee',
  s: '0x2dc6e4ee0dda3a98db42e1dfdc3cc9b6b509862e662c26bdc25ef4c788df76a9',
  v: 27n,
  yParity: 0
}
Fuku-Gen 7702 Transaction hash: 0x843500d6d01b091d20183026a397d3a6fa29fc19b56d1e9516ad26e2744f4604
```

Use Tenderly’s gas profiling tools for analysis.
