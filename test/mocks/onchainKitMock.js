export const getName = jest.fn().mockImplementation((address) => {
  if (address === "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82") {
    return Promise.resolve("test.base");
  }
  return Promise.resolve(null);
});

export const getEnsName = jest.fn().mockImplementation((address) => {
  if (address === "0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82") {
    return Promise.resolve("test.eth");
  }
  return Promise.resolve(null);
});
