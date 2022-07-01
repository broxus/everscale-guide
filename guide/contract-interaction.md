<script setup>
import { ProviderRpcClient, Address, TvmException } from 'everscale-inpage-provider';
import { onMounted, onUnmounted, ref } from 'vue';

const ever = new ProviderRpcClient();

const DePoolAbi = {
  'ABI version': 2,
  'header': ['time', 'expire'],
  'functions': [{
    'name': 'addOrdinaryStake',
    'inputs': [
      {'name': 'stake', 'type': 'uint64'},
    ],
    'outputs': [],
  }, {
    'name': 'getDePoolInfo',
    'inputs': [],
    'outputs': [
      {'name': 'poolClosed', 'type': 'bool'},
      {'name': 'minStake', 'type': 'uint64'},
      {'name': 'validatorAssurance', 'type': 'uint64'},
      {'name': 'participantRewardFraction', 'type': 'uint8'},
      {'name': 'validatorRewardFraction', 'type': 'uint8'},
      {'name': 'balanceThreshold', 'type': 'uint64'},
      {'name': 'validatorWallet', 'type': 'address'},
      {'name': 'proxies', 'type': 'address[]'},
      {'name': 'stakeFee', 'type': 'uint64'},
      {'name': 'retOrReinvFee', 'type': 'uint64'},
      {'name': 'proxyFee', 'type': 'uint64'},
    ],
  }, {
    'name': 'getParticipantInfo',
    'inputs': [
      { 'name': 'addr', 'type': 'address' },
    ],
    'outputs': [
      { 'name': 'total', 'type': 'uint64' },
      { 'name': 'withdrawValue', 'type': 'uint64' },
      { 'name': 'reinvest', 'type': 'bool' },
      { 'name': 'reward', 'type': 'uint64' },
      { 'name': 'stakes', 'type': 'map(uint64,uint64)' },
      { 'name': 'vestings', 'type': 'map(uint64,tuple)', 'components': [{ 'name': 'remainingAmount', 'type': 'uint64' }, { 'name': 'lastWithdrawalTime', 'type': 'uint64', }, { 'name': 'withdrawalPeriod', 'type': 'uint32' }, { 'name': 'withdrawalValue', 'type': 'uint64' }, { 'name': 'owner', 'type': 'address' }] },
      { 'name': 'locks', 'type': 'map(uint64,tuple)', 'components': [{ 'name': 'remainingAmount', 'type': 'uint64' }, { 'name': 'lastWithdrawalTime', 'type': 'uint64' }, { 'name': 'withdrawalPeriod', 'type': 'uint32' }, { 'name': 'withdrawalValue', 'type': 'uint64' }, { 'name': 'owner', 'type': 'address' }] },
      { 'name': 'vestingDonor', 'type': 'address' },
      { 'name': 'lockDonor', 'type': 'address' },
    ],
  }],
  'data': [],
  'events': [],
};

let permissionsSubscription = undefined;
onMounted(async () => {
  permissionsSubscription = await ever.subscribe('permissionsChanged');
  permissionsSubscription.on('data', data => {
    if (data.permissions.accountInteraction != null) {
      data.permissions.accountInteraction.address =
        data.permissions.accountInteraction.address.toString();
    }
  });
});

onUnmounted(async () => {
  if (permissionsSubscription != null) {
    permissionsSubscription.unsubscribe();
  }
});

const requestPermissions = async () => {
  await ever.requestPermissions({ 
    permissions: ['basic', 'accountInteraction'] 
  });
};

const dePoolAddress = new Address('0:bbcbf7eb4b6f1203ba2d4ff5375de30a5408a8130bf79f870efbcfd49ec164e9');
const dePool = new ever.Contract(DePoolAbi, dePoolAddress);

const dePoolInfo = ref();
const getDePoolInfo = async () => {
  await requestPermissions();
  dePoolInfo.value = await dePool.methods
    .getDePoolInfo({})
    .call()
    .then(data => {
      if (data != null) {
        data.validatorWallet = data.validatorWallet.toString();
        data.proxies.forEach((address, i, proxies) => {
          proxies[i] = address.toString();
        });
      }
      return JSON.stringify(data, undefined, 4);
    })
};

const getParticipantInfo = async () => {
  await requestPermissions();
  dePoolInfo.value = await dePool.methods
    .getParticipantInfo({
      addr: new Address('0:dd30aeb6c7ff71d0953d7c3f00d3f7487405ef5f6ee0b2bfa2cb5a73f6fe690a')
    })
    .call()
    .then(data => {
      if (data != null) {
        data.vestingDonor = data.vestingDonor.toString();
        data.lockDonor = data.lockDonor.toString();
      }
      return JSON.stringify(data, undefined, 4);
    })
};

const exceptionCode = ref();
const throwTvmException = async () => {
  await requestPermissions();
  try {
    await dePool.methods
      .getParticipantInfo({
        addr: new Address('0:0000000000000000000000000000000000000000000000000000000000000000')
      })
      .call()
  } catch(e) {
    if (e instanceof TvmException) {
      exceptionCode.value = e.code;
    }
  }
};

const TokenRootAbi = {
  'ABI version': 2,
  'version': '2.2',
  'header': ['pubkey', 'time', 'expire'],
  'functions': [
    {
      'name': 'name',
      'inputs': [{'name': 'answerId', 'type': 'uint32'}],
      'outputs': [{'name': 'value0', 'type': 'string'}],
    },
  ],
  'events': [],
  'data': [],
};

const usdtRootAddress = new Address('0:a519f99bb5d6d51ef958ed24d337ad75a1c770885dcd42d51d6663f9fcdacfb2');
const usdtRoot = new ever.Contract(TokenRootAbi, usdtRootAddress);

const tokenName = ref();
const getTokenName = async () => {
  await requestPermissions();
  const { value0 } = await usdtRoot.methods
    .name({ answerId: 0 })
    .call({ responsible: true });
  tokenName.value = value0;
};
</script>

# Contract Interaction

An `active` account is similar to an instance of a class, where smart-contract code is a class definition and persistent data
is a state of all instance variables. Thus, to read the contract variables you can either decode account data or
call some getters on it. As in system languages, reading variables from a memory representation of a structure is
a tricky idea, in contracts it also depends on how these variables are packed. Therefore, **interaction with smart contracts
is done using some function calls**.

You can interact with contract locally (e.g. getters) or on-chain. Each provider should have the
same VM and executor as the validators, so RPC, during getters execution, is used only to get the state of the contract
which can be reused. To execute method on-chain you can send an external message or an internal (through the selected wallet).
The result of the on-chain method execution can be obtained by parsing a transaction with it.

## Contract ABI

To be able to interact with contract, you must know its structure or the methods it implements. In Everscale, all compilers
produce JSON ABI with the description of data, methods and events.

```typescript
type Abi = {
  // Legacy major version definition
  "ABI version": 2,
  // Full ABI version definition (`major.minor`) 
  version?: string,
  // Required headers
  header: AbiType[],
  // Function interfaces
  functions: AbiFunction[],
  // Event interfaces
  events: AbiEvent[],
  // State init variables
  data: (AbiType & { key: number })[]
};
```

### Components

_For a full description, please refer to [the ABI specification](https://github.com/tonlabs/ton-labs-abi/tree/master/docs)._

::: details Types

At a basic level everything in Ever is a _cell_. Each _cell_ consists of up to **1023 data bits** and **up to 4 references** to other cells.

```
| Name          | Description                                                                                                                                                      | Representation  in cell                                                                                               | Abi version |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|-------------|
| `bool`        | Boolean type                                                                                                                                                     | 1 bit                                                                                                                 | ^1.0        |
| `intN`        | Fixed-sized signed integer, where `N` is a bit length<br /><br />e.g. `int8`, `int32`, `int256`, ..                                                              | `N` bits                                                                                                              | ^1.0        |
| `uintN`       | Fixed-sized unsigned integer, where `N` is a bit length<br /><br />e.g. `uint8`, `uint32`, ..                                                                    | `N` bits                                                                                                              | ^1.0        |
| `varintN`     | Variable-length signed integer. Bit length is between `log2(N)` and `8*(N-1)` where `N` is either **16** or **32**<br /><br />e.g. `varint16`, `varint32`.       | `4+len*8` bits for `varint16` or `5+len*8` bits for `varuint32` where `len` is first 4 or 5 bits                      | ^2.1        |
| `varuintN`    | Variable-length unsigned integer. Bit length is between `log2(N)` and `8*(N-1)` where `N` is either **16** or **32**<br /><br />e.g. `varint16`, `varint32`.     | Same as `varintN`                                                                                                     | ^2.1        |
| `cell`        | TVM cell                                                                                                                                                         | Cell reference                                                                                                        | ^1.0        |
| `address`     | Contract address                                                                                                                                                 | 267 bits (usually)                                                                                                    | ^1.0        |
| `bytes`       | Byte array                                                                                                                                                       | A cell reference. This cell contains bytes, aligned to 8 bits with continuation in further references with same align | ^1.0        |
| `fixedbytesN` | Fixed bytes array of length `N` (up to **32**)                                                                                                                   | `N*8` bits                                                                                                            | ^1.0        |
| `string`      | Byte array which is required to be a valid UTF-8 sequence                                                                                                        | Same as `bytes`                                                                                                       | ^2.1        |
| `optional(T)` | Can store a valut of `T` type or be empty.<br/><br/>e.g. `optional(string)`                                                                                      | 1 bit flag, if it is set then `T` itself                                                                              | ^2.1        |  
| `tuple`       | A product of types.<br/><br/>e.g. `(uint256,bool,cell)`<br/><br/>NOTE: Requires `components` field in JSON ABI.                                                  | Same as a sequence of inner types                                                                                     | ^1.0        |
| `map(K,V)`    | Dictionary with key type `K` and value type `V`.<br/><br/>e.g. `map(uint32,address)`<br/><br/>NOTE: `K` can only be a type which can be represented in one cell. | 1 bit flag, if it is set then cell with dictionary                                                                    | ^1.0        |
| `T[]`         | Array of type `T`.<br/><br/>e.g. `uint256[]`                                                                                                                     | 32 bits of array length, then `map(uint32,T)`                                                                         | ^1.0        |
| `ref(T)`      | Data of type `T`, but stored in a reference (cell).<br/><br/>e.g. `ref((uint32,address))`                                                                        | Cell reference                                                                                                        | ^2.2        |
```

In JSON ABI, types are described as follows:

```typescript
type AbiType = {
  // Each parameter must have its own name
  name: string,
  // Concrete type from the table above
  type: string,
  // Tuple components if it is used in `type`
  components?: ParamType[],
};
```

:::

::: details Functions

In general, function calls are stored in message body, and encoded as `function ID` + `encoded arguments`,
where `function ID` is the first 32 bits of **sha256** of the function signature. However, external messages must contain
a prefix with optional signature and encoded headers.

In JSON ABI, functions are described as follows:

```typescript
type AbiFunction = {
  // Each function in contract must have its own unique name
  name: string,
  // Function arguments
  inputs: AbiType[],
  // Function output types (it can return several values of different types)
  outputs: AbiType[],
  // Optional explicit function id
  id?: string,
};
```

:::

::: details Events

Events are similar to functions, but they can only exist as an external outgoing message and doesn't
have anything other than arguments. They are used to provide additional info during the
transaction execution.

In JSON ABI, events are described as follows:

```typescript
type AbiEvent = {
  // Each event in contract must have its own unique name
  name: string,
  // Event arguments
  inputs: AbiType[],
  // Optional explicit event id
  id?: string,
};
```

:::

### Declaration

Let's go back to the code and declare the ABI of our contract:

```typescript
const DePoolAbi = {
  'ABI version': 2,
  'header': ['time', 'expire'],
  'functions': [{
    'name': 'addOrdinaryStake',
    'inputs': [
      {'name': 'stake', 'type': 'uint64'},
    ],
    'outputs': [],
  }, {
    'name': 'getDePoolInfo',
    'inputs': [],
    'outputs': [
      {'name': 'poolClosed', 'type': 'bool'},
      {'name': 'minStake', 'type': 'uint64'},
      {'name': 'validatorAssurance', 'type': 'uint64'},
      {'name': 'participantRewardFraction', 'type': 'uint8'},
      {'name': 'validatorRewardFraction', 'type': 'uint8'},
      {'name': 'balanceThreshold', 'type': 'uint64'},
      {'name': 'validatorWallet', 'type': 'address'},
      {'name': 'proxies', 'type': 'address[]'},
      {'name': 'stakeFee', 'type': 'uint64'},
      {'name': 'retOrReinvFee', 'type': 'uint64'},
      {'name': 'proxyFee', 'type': 'uint64'},
    ],
  }, {
    'name': 'getParticipantInfo',
    'inputs': [
      {'name': 'addr', 'type': 'address'},
    ],
    'outputs': [
      {'name': 'total', 'type': 'uint64'},
      {'name': 'withdrawValue', 'type': 'uint64'},
      {'name': 'reinvest', 'type': 'bool'},
      {'name': 'reward', 'type': 'uint64'},
      {'name': 'stakes', 'type': 'map(uint64,uint64)'},
      {
        'name': 'vestings',
        'type': 'map(uint64,tuple)',
        'components': [
          {'name': 'remainingAmount', 'type': 'uint64'},
          {'name': 'lastWithdrawalTime', 'type': 'uint64'},
          {'name': 'withdrawalPeriod', 'type': 'uint32'},
          {'name': 'withdrawalValue', 'type': 'uint64'},
          {'name': 'owner', 'type': 'address'}]
      },
      {
        'name': 'locks', 'type': 'map(uint64,tuple)',
        'components': [
          {'name': 'remainingAmount', 'type': 'uint64'},
          {'name': 'lastWithdrawalTime', 'type': 'uint64'},
          {'name': 'withdrawalPeriod', 'type': 'uint32'},
          {'name': 'withdrawalValue', 'type': 'uint64'},
          {'name': 'owner', 'type': 'address'}
        ]
      },
      {'name': 'vestingDonor', 'type': 'address'},
      {'name': 'lockDonor', 'type': 'address'},
    ],
  }],
  'data': [],
  'events': [],
} as const; // NOTE: `as const` is very important here
```

> _Full DePool ABI can be found [here](https://github.com/tonlabs/ton-labs-contracts/blob/master/solidity/depool/DePool.abi.json)_

It is important to note that in order to fully use the features of this library, ABI must be declared as a const object and must
have a const type (therefore should be declared with `as const`). Unfortunately, this approach has drawbacks that have to
be tolerated for now **(you can't import JSON as a const type, [issue #32063](https://github.com/microsoft/TypeScript/issues/32063))**

## Contract Wrapper

Contract
wrapper ([`ProviderRpcClient.Contract`](https://broxus.github.io/everscale-inpage-provider/classes/ProviderRpcClient.html#Contract))
is a preferred way to interact with contracts. It is tied to a specific address, it has a bunch of helpers and a proxy object with all
methods.
Construction doesn't make any requests or subscriptions (since this object doesn't have any state),
however it serializes the provided ABI object, so you shouldn't create it in tight loops.

```typescript
import {Address} from 'everscale-inpage-provider';

const dePoolAddress = new Address('0:bbcbf7eb4b6f1203ba2d4ff5375de30a5408a8130bf79f870efbcfd49ec164e9');
const dePool = new ever.Contract(DePoolAbi, dePoolAddress);
```

::: info
An [`Address`](https://broxus.github.io/everscale-inpage-provider/classes/Address.html) objects are used everywhere instead of
plain strings to prevent some stupid errors. However, requests
through [`rawApi`](https://broxus.github.io/everscale-inpage-provider/classes/ProviderRpcClient.html#rawApi)
use strings as it is a Proxy object which directly communicates with underlying provider object via JRPC.

Btw, if you have some hardcoded constant address you should better
use [`AddressLiteral`](https://broxus.github.io/everscale-inpage-provider/classes/AddressLiteral.html)
which checks the provided string at compile time.
:::

## Reading contract

In most contracts all publicly visible data should be accessed by getters. They don't require user interaction,
and only rely on `basic` permission, so they can be used even without extension via standalone client.

Contract wrapper has a [`methods`](https://broxus.github.io/everscale-inpage-provider/classes/Contract.html#methods) Proxy
object which contains all functions as properties. To execute a getter, you should first prepare its arguments and
then execute the [`call`](https://broxus.github.io/everscale-inpage-provider/interfaces/ContractMethod.html#call)
method on the prepared object.

### Simple getters

This type of getters is executed locally by simulating external message call and parsing external outgoing messages.

```typescript
// Optionally request account state
const state = await ever.getFullContractState(dePool.address);

// Simple getter without any parameters
const dePoolInfo = await dePool.methods.getDePoolInfo({}).call({
  // You can call several getters "atomicly" on a single contract state
  cachedState: state,
})

// Another getter, but with parameters
const participantInfo = await dePool.methods
  .getParticipantInfo({
    // Arguments have the same type as described in ABI,
    // but merged into one object by `name`
    addr: new Address('0:dd30aeb6c7ff71d0953d7c3f00d3f7487405ef5f6ee0b2bfa2cb5a73f6fe690a'),
  })
  .call({
    // NOTE: It will request the state itself if it is not specified
    cachedState: state,
  }); 
```

<div class="demo">
  <button @click="getDePoolInfo">getDePoolInfo</button>
  <button @click="getParticipantInfo">getParticipantInfo</button>
  <pre v-if="dePoolInfo != null">{{ dePoolInfo }}</pre>
</div>

### Responsible methods

This type of methods can either be called via internal message or locally as a getter via external message. It differs from
simple getters as it has additional argument of type `uint32` which is usually called `answerId`.

* When it is called on-chain, it returns the result in outgoing internal message to the caller with `answerId` as a function id.
* When it is called locally, it behaves the same way as simple getters. However, in this library you could call these methods
  with an additional `responsible: true` flag which executes them locally as internal messages. It allows skipping headers,
  so you could use the same function signature for contracts with different headers set.

```typescript
const TokenRootAbi = {
  'ABI version': 2,
  'version': '2.2',
  'header': ['pubkey', 'time', 'expire'],
  'functions': [
    {
      'name': 'name',
      'inputs': [{'name': 'answerId', 'type': 'uint32'}],
      'outputs': [{'name': 'value0', 'type': 'string'}],
    },
  ],
  'events': [],
  'data': [],
} as const;

const usdtRootAddress = new Address('0:a519f99bb5d6d51ef958ed24d337ad75a1c770885dcd42d51d6663f9fcdacfb2');
const usdtRoot = new ever.Contract(TokenRootAbi, usdtRootAddress);

const {value0: tokenName} = await usdtRoot.methods
  .name({})
  .call({responsible: true})
console.log(`Token name: ${tokenName}`)
```

<div class="demo">
  <button @click="getTokenName">Get token name</button>
  <pre v-if="tokenName != null">Token name: {{ tokenName }}</pre>
</div>

### TVM Exceptions

There can be exceptions during local contract execution. They may arise either due to an incorrect function signature
or due to some checks in contract code. If an exception code is less than 100, then it is likely due to an incorrect ABI
or signature or something else. Otherwise, it is an exception from the contract code, and you can find the reason if you
have that code.

You can catch TVM exceptions using [`TvmException`](https://broxus.github.io/everscale-inpage-provider/classes/TvmException.html) class.
Although there might be some situations when execution fails due to a TVM exception, but other exception is thrown - in that
case it is more likely due to incorrect input or contract state.

```typescript
import {TvmException} from 'everscale-inpage-provider'

try {
  const participantInfo = await dePool.methods
    .getParticipantInfo({
      // This dePool definitely doesn't have such participant
      addr: new Address('0:0000000000000000000000000000000000000000000000000000000000000000'),
    })
    .call();
} catch (e) {
  if (e instanceof TvmException) {
    console.log(`TVM Exception: ${e.code}`);
  } else {
    // Re-throw it othersise
    throw e;
  }
}
```

<div class="demo">
  <button @click="throwTvmException">getParticipantInfo</button>
  <a v-if="exceptionCode != null" target="_blank" href="https://github.com/tonlabs/ton-labs-contracts/blob/e7821cec3514869979f702047348b2faf35b7b3f/solidity/depool/DePool.sol#L1428"><pre>require(optParticipant.hasValue(), Errors.NO_SUCH_PARTICIPANT);</pre></a>
  <pre v-if="exceptionCode != null">TVM Exception: {{ exceptionCode }}</pre>
</div>

::: details Known TVM Exceptions

### Basic exceptions

_Please refer to [the whitepaper](https://test.ton.org/tvm.pdf) 4.5.7_

| Code | Name              | Definition                                                                                                                       |
|------|-------------------|----------------------------------------------------------------------------------------------------------------------------------|
| 2    | Stack underflow   | Not enough arguments in the stack for a primitive                                                                                |
| 3    | Stack overflow    | More values have been stored on a stack than allowed by this version of TVM                                                      |
| 4    | Integer overflow  | Integer does not fit into expected range (by default −2<sup>256</sup> ≤ x < 2<sup>256</sup>), or a division by zero has occurred |
| 5    | Range check error | Integer out of expected range                                                                                                    |
| 6    | Invalid opcode    | Instruction or its immediate arguments cannot be decoded                                                                         |
| 7    | Type check error  | An argument to a primitive is of incorrect value type                                                                            |
| 8    | Cell overflow     | Error in one of the serialization primitives                                                                                     |
| 9    | Cell underflow    | Deserialization error                                                                                                            |
| 10   | Dictionary error  | Error while deserializing a dictionary object                                                                                    |
| 11   | Unknown error     | Unknown error, may be thrown by user programs                                                                                    |
| 12   | Fatal error       | Thrown by TVM in situations deemed impossible                                                                                    |
| 13   | Out of gas        | Thrown by TVM when the remaining gas (g r ) becomes negative                                                                     |

### Solidity exceptions

_Please refer to [the docs](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#solidity-runtime-errors)_

| Code | Definition                                                                                                                                                                                                                                                  |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 40   | External inbound message has an invalid signature. See [`tvm.pubkey()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#tvmpubkey) and [`msg.pubkey()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#msgpubkey). |
| 50   | Array index or index of [`<mapping>.at()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#mappingat) is out of range.                                                                                                                  |
| 51   | Contract's constructor has already been called.                                                                                                                                                                                                             |
| 52   | Replay protection exception. See `timestamp` in [pragma AbiHeader](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#pragma-abiheader).                                                                                                   |
| 53   | See [`<address>.unpack()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#addressunpack).                                                                                                                                              |
| 54   | `<array>.pop` call for an empty array.                                                                                                                                                                                                                      |
| 55   | See [`tvm.insertPubkey()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#tvminsertpubkey).                                                                                                                                            |
| 57   | External inbound message is expired. See `expire` in [pragma AbiHeader](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#pragma-abiheader).                                                                                              |
| 58   | External inbound message has no signature but has public key. See `pubkey` in [pragma AbiHeader](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#pragma-abiheader).                                                                     |
| 60   | Inbound message has wrong function id. In the contract there are no functions with such function id and there is no fallback function that could handle the message.                                                                                        |
| 61   | Deploying StateInit has no public key in data field.                                                                                                                                                                                                        |
| 62   | Reserved for internal usage.                                                                                                                                                                                                                                |
| 63   | See [`<optional(Type)>.get()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#optionaltypeget).                                                                                                                                        |
| 64   | [`tvm.buildExtMSg()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#tvmbuildextmsg) call with wrong parameters.                                                                                                                       |
| 65   | Call of the unassigned variable of function type. See [Function type](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#function-type).                                                                                                   |
| 66   | Convert an integer to a string with width less than number length. See [`format()`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#format).                                                                                            |
| 67   | See [`gasToValue`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#gastovalue) and [`valueToGas`](https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md#valuetogas).                                                      |
| 68   | There is no config parameter 20 or 21.                                                                                                                                                                                                                      |
| 69   | Zero to the power of zero calculation.                                                                                                                                                                                                                      |
| 70   | `string` method `substr` was called with substr longer than the whole string.                                                                                                                                                                               |
| 71   | Function marked by `externalMsg` was called by internal message.                                                                                                                                                                                            |
| 72   | Function marked by internalMsg was called by external message.                                                                                                                                                                                              |
| 73   | The value can't be converted to enum type.                                                                                                                                                                                                                  |
| 74   | Await answer message has wrong source address.                                                                                                                                                                                                              |
| 75   | Await answer message has wrong function id.                                                                                                                                                                                                                 |
| 76   | Public function was called before constructor.                                                                                                                                                                                                              |

:::

## Sending messages

TODO

::: warning
All functions can be executed either via external or internal messages. However, if function is not marked as `responsible`
it will not return anything when called via an internal message.
:::
