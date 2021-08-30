const evmVersion = 'byzantium'
const contractsBuildDirectory = './contracts/build/contracts'

module.exports = {
    contracts_build_directory: contractsBuildDirectory,
    networks: {
        ganache: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*', // eslint-disable-line camelcase
            gasPrice: 100000000000,
            gas: 10000000
        }
    },
    compilers: {
        solc: {
            version: '0.4.24',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion
            }
        }
    },
}