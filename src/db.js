let db = {
  handleCOUNT: ({ value }) => {
    db.en
  },
  handleDELETE: ({ key }) => {
    return delete db[key] || `"${key}" doees not exist in database yet`;
  },
  handleGET: ({ key }) => {
    return db[key] &&  `${key}: ${db[key]}` || `"${key}" does not exist in database yet`;
  },
  handleSET: ({ key, value }) => {
    db[key] = value;
    return `successfully added ${key} = ${value}`;
  },
};

module.exports = db;
