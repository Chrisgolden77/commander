let db = {
  name: "chris",
  creator: "chris",
  SP: {
    handleCOUNT: ({ value }) => {
      const valueOccurrences = Object.keys(db).filter((key) => db[key] === value);
      console.log(valueOccurrences);
      return `${valueOccurrences.length} ${
        valueOccurrences.length > 1 ? "keys" : "key"
      } with the value "${value}":\n ${
        valueOccurrences.length && valueOccurrences.map((key) => `${key}\n`)
      }`;
    },
    handleDELETE: ({ key }) => {
      const keyExists = db[key];
      keyExists && delete db[key];
      return keyExists
      ? `"${key}" deleted successfully.`
      : `"${key}" does not exist in database.`;
    },
    handleGET: ({ key }) => {
      return (
        (db[key] && `${key}: ${db[key]}`) ||
        `"${key}" does not exist in database.`
        );
      },
      handleSET: ({ key, value }) => {
        const keyExists = db[key];
        !keyExists && (db[key] = value);
        return keyExists
        ? `Key "${key}" already exists in db. Use UPDATE to change this key's value.`
        : `Successfully added "${key}" = "${value}".`;
      },
      handleUPDATE: ({ key, value }) => {
        const keyExists = db[key];
        keyExists && (db[key] = value);
        return keyExists
        ? `Successfully updated: "${key}" = "${value}".`
        : `Key "${key}" doesn't exist in db.\nUse SET to add this key and value.`;
      },
    }
};

module.exports = db;
