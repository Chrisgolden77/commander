let db = {
  name: "chris",
  creator: "chris",
  SP: {
    handleCOUNT: ({ database, value }) => {
      const valueOccurrences = Object.keys(db).filter(
        (key) => database[key] === value
      );
      console.log(valueOccurrences);
      return `${valueOccurrences.length} ${
        valueOccurrences.length > 1 ? "keys" : "key"
      } with the value "${value}":\n ${
        valueOccurrences.length && valueOccurrences.map((key) => `${key}\n`)
      }`;
    },
    handleDELETE: ({ database, key }) => {
      const keyExists = database[key];
      keyExists && delete database[key];
      return keyExists
        ? `"${key}" deleted successfully.`
        : `"${key}" does not exist in database.`;
    },
    handleGET: ({ database, key }) => {
      return (
        (database[key] && `${key}: ${database[key]}`) ||
        `"${key}" does not exist in database.`
      );
    },
    handleSET: ({ database, key, value }) => {
      const keyExists = database[key];
      !keyExists && (database[key] = value);
      return keyExists
        ? `Key "${key}" already exists in db. Use UPDATE to change this key's value.`
        : `Successfully added "${key}" = "${value}".`;
    },
    handleUPDATE: ({ database, key, value }) => {
      const keyExists = database[key];
      keyExists && (database[key] = value);
      return keyExists
        ? `Successfully updated: "${key}" = "${value}".`
        : `Key "${key}" doesn't exist in db.\nUse SET to add this key and value.`;
    },
  },
};
Object.defineProperty(db, 'SP', {configurable: false, writable: false});
module.exports = db;
