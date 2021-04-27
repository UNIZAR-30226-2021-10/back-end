const mysql = require('mysql');


const db_config = {
    host: 'eu-cdbr-west-03.cleardb.net',
    user: 'baaa8387acfc19',
    password: '2ae0a14b',
    database:'heroku_c579bffd070869c',
    multipleStatements:true
};

var connection;

function handleDisconnect() {
    connection = mysql.createPool(db_config); 


connection.getConnection(function (err) {
    if(err) {
        console.log(err);
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
        return;
    } else {
        console.log('Db is connected');
    }
});

connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
  handleDisconnect();

module.exports = connection;