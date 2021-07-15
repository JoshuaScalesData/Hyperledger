'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'network-connection', 'connection.json');


exports.invokecc = async function invokecc(req, res) {
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
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: false, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('landrec');

        const result = await contract.submitTransaction('createLand', 'LAND12', '1434 45th St E, Redmond WA, 98052', 
                                                        '[{lat: 3534.3, lon: 2423}, {lat: 3534.3, lon: 2341}, {lat: 3534.3, lon: 24.23}]',
                                                        'Timmy');
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.send(`Transaction has been submitted to peer0 successfully. Query to verify the new state`);

    } catch (error) {
        res.send(`Failed to submit transaction: ${error}`);
    }
}

