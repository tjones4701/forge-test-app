import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("getText", (req) => {
  console.log(req);
  return JSON.stringify(req, null, 3);
});

export const handler = resolver.getDefinitions();
