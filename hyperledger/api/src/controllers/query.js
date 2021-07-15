'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'network-connection', 'connection.json');


exports.query = async function query(req, res) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('admin');
        if (!userExists) {
            console.log('An identity for the user "admin" does not exist in the wallet. Run the /enrollAdmin endpoint before retrying');
            res.send('An identity for the user "admin" does not exist in the wallet. Run the /enrollAdmin endpoint before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('landrec');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryLand', 'LAND4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllLands')
        const result = await contract.evaluateTransaction('queryAllLands');
        // res.send(`Transaction has been evaluated, result is: ${result.toString()}`);
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(JSON.parse(result.toString()), null, 3));

    } catch (error) {
        res.send(`Failed to evaluate transaction: ${error}`);
    }
}

