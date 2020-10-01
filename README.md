### COMMANDER ###

Commander is a command line interface for transactional storing of data while the app is running. 
It's just a toy to practice running node for command line apps. 

Variables will be stored with case sensitive key value pairs in the following syntax: 
  - "COMMAND key and/or value" 

Commands: 
  - GET <key>= Retrieves value of given key
  - SET <key> <value> = Sets value for given key
  - DELETE <key> = Removes key value pair associated with given key
  - COUNT <value>  = Returns number over occurrences of a given value 
  - BEGIN = Opens a transaction
  - COMMIT = Commits current code within an open transaction
  - ROLLBACK = Discards changes within an open transaction, then closes transaction