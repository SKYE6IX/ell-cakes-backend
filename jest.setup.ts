jest.mock("nanoid", () => {
  return {
    customAlphabet: jest.fn(() => jest.fn()),
  };
});

// return { nanoid: () => "ORD-Y8SJSBLA" }
const now = Date.now();
jest.mock("uuid", () => {
  return { v4: () => "3261ea39-8380-44ba-9562-b2ffce8f3c1e" + now.toString() };
});
