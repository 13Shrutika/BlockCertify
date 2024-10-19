module.exports = {
    networks: {
      ganache: {
        host: "127.0.0.1",           // Localhost
        port: 7545,                  // Ganache GUI default port
        network_id: "*",             // Match any network id
        gas: 6721975,                // Increase the gas limit here (you can adjust as needed)
        gasPrice: 20000000000        // Adjust gas price if necessary (20 gwei)
      },
    },
    compilers: {
      solc: {
        version: "0.8.0",            // Specify your Solidity version
        settings: {
          optimizer: {
            enabled: true,           // Enable the optimizer for deployment
            runs: 200                // Set the number of optimization runs
          }
        }
      },
    },
  };
  