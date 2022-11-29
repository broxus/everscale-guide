const ExampleAbi = {
  "ABI version": 2,
  version: "2.3",
  header: ["time"],
  functions: [
    {
      name: "constructor",
      inputs: [
        { name: "someParam", type: "uint128" },
        { name: "second", type: "string" },
      ],
      outputs: [],
    },
    {
      name: "setVariable",
      inputs: [{ name: "someParam", type: "uint128" }],
      outputs: [],
    },
    {
      name: "getState",
      inputs: [
        { name: "answerId", type: "uint32" },
        { name: "offset", type: "uint32" },
      ],
      outputs: [
        {
          components: [
            { name: "first", type: "uint32" },
            { name: "second", type: "string" },
          ],
          name: "res",
          type: "tuple",
        },
      ],
    },
    {
      name: "simpleState",
      inputs: [],
      outputs: [{ name: "simpleState", type: "uint128" }],
    },
  ],
  data: [{ key: 1, name: "nonce", type: "uint32" }],
  events: [
    {
      name: "StateChanged",
      inputs: [
        {
          components: [
            { name: "first", type: "uint32" },
            { name: "second", type: "string" },
          ],
          name: "complexState",
          type: "tuple",
        },
      ],
      outputs: [],
    },
  ],
};
