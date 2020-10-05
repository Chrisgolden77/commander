let db = {
  name: "chris",
  creator: "chris",
  handleCOUNT: ({ value }) => {
    const valueOccurrences = Object.keys(db).filter((key) => db[key] === value);
    console.log(valueOccurrences);
    return `${valueOccurrences.length} ${
      valueOccurrences.length > 1 ? "keys" : "key"
    } with the value "${value}":\n ${
      valueOccurrences.length && valueOccurrences.map(key => `${key}\n`)
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
    db[key] = value;
    return `successfully added "${key}" = "${value}".`;
  },
};

module.exports = db;
