const resolvers = require('./resolvers');

exports.handler = async (event) => {
  console.log(event);
  const { typeName, fieldName } = event;
  const typeHandler = resolvers[typeName];
  if (typeHandler) {
    const resolver = typeHandler[fieldName];
    if (resolver) {
      try {
        return resolver(event);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
  throw new Error(`Resolver ${typeName}/${fieldName} not found.`);
};
