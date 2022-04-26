import Pact from "pact-lang-api";

const state = {
    //Our vue store state is located below, and in general contains all our apps state
    debug: false,
    loaded: false,
    owned_staff: "0",
    owned_bow: "0",
    owned_sword: "0",
    max_supply_staff: "500",
    max_supply_bow: "1000",
    max_supply_sword: "2000",
    current_supply_staff: "?",
    current_supply_bow: "?",
    current_supply_sword: "?",
    activeAccount: null,
    accountExists: null,
    senderAccountExists: null,
    accountData: null,
    receiverAccountData: null,
    accountName: null,
    accountConfirmed: false,
    accountKeys: [],
    accountPredicate: null,
    userRequests: [],
    transactionPolling: false,
    requestPending: false,
    transactionConfirmed: false,
    transactionFailed: null,
    transactionHash: null,
    transactionConfirmedResult: null,
    chainId: "1",
    //network: "https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact",
    network: "https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact",
    networkid: "testnet04",
    gasPrice: 0.000001,
    xwalletconnected: false,
};

const getters = {
    //Getters provide read access to our stores variables from outside of our store, such as from the homepage or navbar
    getOwnedStaff(state) {
        return state.owned_staff;
    },
    getOwnedBow(state) {
        return state.owned_bow;
    },
    getOwnedSword(state) {
        return state.owned_sword;
    },
    getMaxSupplyStaff(state) {
        return state.max_supply_staff;
    },
    getMaxSupplyBow(state) {
        return state.max_supply_bow;
    },
    getMaxSupplySword(state) {
        return state.max_supply_sword;
    },
    getCurrentSupplyStaff(state) {
        return state.current_supply_staff;
    },
    getCurrentSupplyBow(state) {
        return state.current_supply_bow;
    },
    getCurrentSupplySword(state) {
        return state.current_supply_sword;
    },
    getActiveAccount(state) {
        return state.activeAccount;
    },
    getAccountExists(state) {
        return state.accountExists;
    },
    getAccountKeys(state) {
        return state.accountKeys;
    },
    getAccountPredicate(state) {
        return state.accountPredicate;
    },
    getAccountData(state) {
        return state.accountData;
    },
    getAccountName(state) {
        if (state.debug) {
            console.log("Inside getAccountName");
        }
        return state.accountName;
    },
    getAccountConfirmed(state) {
        if (state.debug) {
            console.log("Inside store getAccountConfirmed");
            console.log("accountConfirmed:");
            console.log(state.accountConfirmed);
        }
        return state.accountConfirmed;
    },
    getStoreLoaded(state) {
        return state.loaded;
    },
    getTransactionPolling(state) {
        return state.transactionPolling;
    },
    getTransactionConfirmed(state) {
        return state.transactionConfirmed;
    },
    getTransactionFailed(state) {
        return state.transactionFailed;
    },
    getTransactionHash(state) {
        return state.transactionHash;
    },
    getTransactionConfirmedResult(state) {
        return state.transactionConfirmedResult;
    },
    getXWalletConnected(state) {
        return state.xwalletconnected;
    },
    getRequestPending(state) {
        return state.requestPending;
    },

};

const actions = {
    //Actions are all store functions that may or may not alter the vue stores state

    //connects xwallet
    async connectXwallet() {

        if (state.debug) {
            console.log("connectXwallet");
        }

        let kadena = window.kadena;
        let networkId = state.networkid;

        if (window.kadena.isKadena === true) {
            let accountResult = await kadena.request({
                method: "kda_requestAccount",
                networkId: networkId,
                domain: window.location.hostname
            });

            if (state.debug) {
                console.log("accountResult:");
                console.log(accountResult);
            }


            if (accountResult.status === "success") {
                if (state.debug) {
                    console.log(accountResult.message);
                    console.log(accountResult.wallet.account);
                }


                await this.dispatch("accounts/getAccountVerification", accountResult.wallet.account);

                let t_keys = state.accountKeys;
                let t_pred = state.accountPredicate;
                let t_accountdata = state.accountData;

                if (state.debug) {
                    console.log("keys got from store:");
                    console.log(t_keys);
                    console.log("predicate got from store:");
                    console.log(t_pred);
                    console.log("data got from store:");
                    console.log(t_accountdata);
                }


                if (state.debug) {
                    console.log("dispatching confirm to store with account name:");
                    console.log(accountResult.wallet.account);
                }
                await this.dispatch("accounts/confirmAccountExists", accountResult.wallet.account);

                if (state.debug) {
                    console.log("setting local storage up.");
                }
                localStorage.setItem("accountName", accountResult.wallet.account);
                localStorage.setItem("isConnected", true);
                localStorage.setItem("isUsingXwallet", true);
                state.xwalletconnected = true;
                if (state.debug) {
                    console.log("isConnected:");
                    let connected = localStorage.getItem("isConnected");
                    console.log(connected);
                    console.log("accountname:");
                    let aname = localStorage.getItem("accountName");
                    console.log(aname);
                    console.log("isUsingXwallet:");
                    let xwalconnect = localStorage.getItem("isUsingXwallet");
                    console.log(xwalconnect);
                }

            } else {
                console.log("Please connect X Wallet");
                localStorage.setItem("accountName", null);
                localStorage.setItem("isConnected", false);
                localStorage.setItem("isUsingXwallet", false);
                state.xwalletconnected = false;
            }
        }


        await kadena.request({method: "kda_connect", networkId: networkId});


    },

    //gets xwallet account
    async getXwalletAccount() {
        let kadena = window.kadena;
        if (state.debug) {
            console.log("getxwalletaccount");
        }


        let accountResult = await kadena.request({method: "kda_getSelectedAccount", networkId: state.networkid});

        if (state.debug) {
            console.log("accountResult:");

            console.log(accountResult);
        }

    },

    //Local call to verify if a coin account exists, used during account login to verify account existance
    async getAccountVerification({commit}, accountName) {
        if (state.debug) {
            console.log("Getting Kadena Account");
        }
        let exists = false;
        let dataResult = null;
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(coin.details ${JSON.stringify(accountName)})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Account Found");
                }
                if (state.debug) {
                    console.log(data.result);
                }
                dataResult = [{...data.result}];
                exists = true;
            } else {
                if (state.debug) {
                    console.log("No Account Found");
                }
                exists = false;
            }

        } catch (error) {
            console.log(error);
        }
        commit("setAccountExists", exists);
        if (exists === true) {
            commit("setAccountData", dataResult);
            commit("setAccountKeys", dataResult[0]["data"]["guard"]["keys"]);
            commit("setAccountPredicate", dataResult[0]["data"]["guard"]["pred"]);
            localStorage.setItem("accountPredicate", dataResult[0]["data"]["guard"]["pred"]);
            localStorage.setItem("accountPublicKey", dataResult[0]["data"]["guard"]["keys"][0]);
            if (state.debug) {
                console.log(dataResult);
                console.log(dataResult[0]["data"]["guard"]["keys"][0]);
                console.log(dataResult[0]["data"]["guard"]["keys"]);
            }
        }
    },

    //Local call to verify if a coin account exists, used during gallina transfers from account to account
    async getTransferVerification({commit}, accountName) {
        if (state.debug) {
            console.log("Getting Kadena Sender Account");
        }
        let exists = false;
        let dataResult = null;
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(coin.details ${JSON.stringify(accountName)})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Recipient Account Found");
                }
                if (state.debug) {
                    console.log(data.result);
                }
                exists = true;
                dataResult = [{...data.result}];
            } else {
                if (state.debug) {
                    console.log("Recipient Account NOT Found");
                }
                exists = false;
            }

        } catch (error) {
            console.log(error);
        }
        commit("setSenderAccountExists", exists);
        if (exists === true) {
            commit("setReceiverAccountData", dataResult);
        }
    },

    //Resets login, used when disconnecting/canceling the login screen
    async resetAccountExists({commit}) {
        let reset = null;
        this.accountExists = null;
        if (window.kadena && window.kadena.isKadna === true) {
            let result = await window.kadena.request({
                method: "kda_disconnect",
                networkId: state.networkid,
                domain: window.location.hostname
            });

            console.log(result);
        }

        commit("setAccountExists", reset);
        commit("setAccountConfirmed", false);
        commit("setXWalletConnected", false);
        localStorage.setItem("isUsingXwallet", false);
        localStorage.setItem("isUsingCloverwallet", false);
    },

    //Confirms login information and sets it in game state
    async confirmAccountExists({commit}, acctname) {
        if (state.debug) {
            console.log("inside confirm account exists in store");
            console.log("attempting commit account name with acct name:");
            console.log(acctname);
        }
        commit("setAccountName", acctname);
        if (state.debug) {
            console.log("attempting commit account exists with true");
        }
        commit("setAccountExists", true);
        if (state.debug) {
            console.log("attempting commit account confirmed with true");
        }
        commit("setAccountConfirmed", true);
    },

    //Transaction polling mechanism - polls pending transactions every 20 seconds
    async pollTransactionHash({commit}, hash) {
        if (state.debug) {
            console.log("Polling blockchain every 20 seconds for transaction confirmation:");
            console.log(hash);
        }
        let dataResult = null;
        try {

            let pollRes = await Pact.fetch.poll({
                requestKeys: [hash]
            }, state.network);

            if (state.debug) {
                console.log(pollRes[hash]);
            }

            if (pollRes[hash] === undefined) {
                console.log("Transaction is still confirming.. Checking again in 20 seconds..");
            } else {
                console.log(pollRes[hash]);
            }

            if (pollRes[hash] !== undefined) {

                if (pollRes[hash].result.status === "success") {

                    dataResult = [{...pollRes[hash].result}];
                    commit("setTransactionFailed", false);
                    commit("setTransactionConfirmedResult", dataResult);

                    await this.dispatch("accounts/getCurrentSupplyStaffs");
                    await this.dispatch("accounts/getCurrentSupplyBows");
                    await this.dispatch("accounts/getCurrentSupplySwords");
                    let name = localStorage.getItem("accountName");

                    if (name === null || name === "") {
                        if(this.debug){
                            console.log("No user local accountName found.")
                        }
                    }else {
                        await this.dispatch("accounts/getAllUserStaffs", name);
                        await this.dispatch("accounts/getAllUserBows", name);
                        await this.dispatch("accounts/getAllUserSwords", name);
                    }


                    commit("setTransactionPolling", false);

                    if (state.debug) {
                        console.log("Transaction Confirmed via blockchain:");
                        console.log(pollRes[hash].result);
                    }


                } else {
                    commit("setTransactionFailed", true);
                    commit("setTransactionConfirmedResult", dataResult);
                    if (state.debug) {
                        console.log("Could not confirm recent transaction:");
                        console.log(pollRes[hash].result);
                    }
                }

            } else {

                setTimeout(async () => {
                    this.dispatch("accounts/pollTransactionHash", hash);
                }, 20000);

            }


        } catch (error) {
            if(state.debug){
                console.log("TX Confirmation ERROR:");

                console.log(error);
                console.log(error.json());
            }

        }

    },

    //Resets our store of any pending transaction polling action it was performing
    async clearTransactionPoll({commit}) {
        await commit("setTransactionHash", null);

        await commit("setTransactionPolling", false);

        await commit("setTransactionConfirmed", false);

        await commit("setTransactionFailed", null);

        await commit("setTransactionConfirmedResult", null);

    },

    //Commits xwallet is not connected changes to vue store variables
    async setXWalletIsNotConnected({commit}) {
        await commit("setXWalletConnected", false);

    },

    //Commits xwallet is connected changes to vue store variables
    async setXWalletIsConnected({commit}) {
        await commit("setXWalletConnected", true);

    },

    //Buys a new staff off blockchain
    async buynewstaff({commit}, accountName) {
        if (state.debug) {
            console.log("Buying new Staff");
        }
        try {

            const publickey = state.accountData[0]["data"]["guard"]["keys"][0];
            const accountName2 = localStorage.getItem("accountName");
            const accountGuard = state.accountData[0]["data"]["guard"];
            if (state.debug) {
                console.log(accountGuard);
                console.log(publickey);
                console.log(accountName2);
            }
            if (accountName2 !== accountName) {
                console.log("ACCOUNT NAMES DIDNT MATCH!");
                console.log("accountName: " + accountName);
                console.log("accountName2: " + accountName2);
            }


            const legendofthanosbank = "legendofthanos-bank";
            const GAS_PRICE = 0.000001;
            const chainId = state.chainId;
            const NETWORKID = state.networkid;


            const pactCode = `(free.legendofthanos.buy-staff ${JSON.stringify(accountName2)} (read-keyset "user-ks") 0.1)`;
            const signCmd = {
                pactCode: pactCode,
                caps: [Pact.lang.mkCap("Gas Capability", "Agreement to Pay Gas", "coin.GAS", []), Pact.lang.mkCap("Transfer Capability", "Agreement to Transfer 0.1 KDA to the Legend of Thanos for 1 STAFF", "coin.TRANSFER", [accountName2, legendofthanosbank, 0.1])],
                sender: accountName2,
                gasLimit: 15000,
                gasPrice: GAS_PRICE,
                chainId: chainId,
                ttl: 600,
                envData: {
                    "user-ks": accountGuard
                },
                signingPubKey: publickey,
                networkId: NETWORKID
            }; //alert to sign tx


            if (state.debug) {
                console.log("signCmd:");
                console.log(signCmd);
            }

            let cmd = null;

            if (state.debug) {
                console.log("xwalletconnected:");
                console.log(this.getters["accounts/getXWalletConnected"]);
            }

            if (state.xwalletconnected === true) {
                const xwalletcode = `(free.legendofthanos.buy-staff ${JSON.stringify(accountName2)} (read-keyset 'userks) 0.1)`;
                const XWalletRequest = {

                    networkId: NETWORKID,
                    signingCmd: {
                        sender: accountName2,
                        chainId: "1",
                        gasPrice: 0.000001,
                        gasLimit: 15000,
                        ttl: 600,
                        caps: [Pact.lang.mkCap("Gas Capability", "Agreement to Pay Gas", "coin.GAS", []), Pact.lang.mkCap("Transfer Capability", "Agreement to Transfer 0.1 KDA to the Legend of Thanos for 1 STAFF", "coin.TRANSFER", [accountName2, legendofthanosbank, 0.1])],
                        pactCode: xwalletcode,
                        envData: {
                            userks: accountGuard
                        },
                        networkId: NETWORKID,
                        signingPubKey: publickey,

                    } //alert to sign tx

                };

                cmd = await window.kadena.request({
                    method: "kda_requestSign",
                    networkId: NETWORKID,
                    data: XWalletRequest
                });

            }else {
                if(state.debug){
                    console.log("OTHER WALLET SIGNING");
                }
                cmd = await Pact.wallet.sign(signCmd);
            }

            if (state.debug && state.xwalletconnected === true) {
                console.log("cmd response:");
                console.log(cmd);
                console.log("is xwallet connected:");
                console.log(state.xwalletconnected);
            }


            try{

                let res = null;

                if (state.xwalletconnected === true) {
                    if (cmd.status === "success") {
                        if (state.debug) {
                            console.log("sign success");
                            console.log("cmd:");
                            console.log(cmd);
                            console.log("cmd signed cmd");
                            console.log(cmd.signedCmd);
                            console.log("cmd signed type");
                            console.log(typeof (cmd.pactCode));
                        }
                        res = await Pact.wallet.sendSigned(cmd.signedCmd, state.network);
                    }
                } else {
                    res = await Pact.wallet.sendSigned(cmd, state.network);
                }



                if (state.debug) {
                    console.log("RES response");
                    console.log(res);
                }


                if (res !== undefined && res !== null) {

                    if (state.debug) {
                        console.log("RES:");
                        console.log(res);
                        if (state.xwalletconnected === true && res.signedCmd !== undefined) {
                            console.log(res.signedCmd);
                        }
                        console.log(res.requestKeys[0]);

                    }

                    if (state.xwalletconnected !== true) {
                        if (res.requestKeys[0]) {
                            await commit("setTransactionHash", res.requestKeys[0]);
                            await commit("setTransactionPolling", true);
                            await commit("setTransactionConfirmed", false);
                            await commit("setTransactionFailed", null);
                            await commit("setTransactionConfirmedResult", null);
                            await this.dispatch("accounts/pollTransactionHash", res.requestKeys[0]);

                        }
                    } else {
                        await commit("setTransactionHash", cmd.signedCmd.hash);
                        await commit("setTransactionPolling", true);
                        await commit("setTransactionConfirmed", false);
                        await commit("setTransactionFailed", null);
                        await commit("setTransactionConfirmedResult", null);
                        await this.dispatch("accounts/pollTransactionHash", cmd.signedCmd.hash);

                    }

                }

            }catch(error){
                if(state.debug){
                    console.log(error);
                }

            }



        } catch (error) {
            console.log(error);
        }
    },

    //Buys a new bow off blockchain
    async buynewbow({commit}, accountName) {
        if (state.debug) {
            console.log("Buying new Staff");
        }
        try {

            const publickey = state.accountData[0]["data"]["guard"]["keys"][0];
            const accountName2 = localStorage.getItem("accountName");
            const accountGuard = state.accountData[0]["data"]["guard"];
            if (state.debug) {
                console.log(accountGuard);
                console.log(publickey);
                console.log(accountName2);
            }
            if (accountName2 !== accountName) {
                console.log("ACCOUNT NAMES DIDNT MATCH!");
                console.log("accountName: " + accountName);
                console.log("accountName2: " + accountName2);
            }


            const legendofthanosbank = "legendofthanos-bank";
            const GAS_PRICE = 0.000001;
            const chainId = state.chainId;
            const NETWORKID = state.networkid;


            const pactCode = `(free.legendofthanos.buy-bow ${JSON.stringify(accountName2)} (read-keyset "user-ks") 0.5)`;
            const signCmd = {
                pactCode: pactCode,
                caps: [Pact.lang.mkCap("Gas Capability", "Agreement to Pay Gas", "coin.GAS", []), Pact.lang.mkCap("Transfer Capability", "Agreement to Transfer 0.5 KDA to the Legend of Thanos for 1 BOW", "coin.TRANSFER", [accountName2, legendofthanosbank, 0.5])],
                sender: accountName2,
                gasLimit: 15000,
                gasPrice: GAS_PRICE,
                chainId: chainId,
                ttl: 600,
                envData: {
                    "user-ks": accountGuard
                },
                signingPubKey: publickey,
                networkId: NETWORKID
            }; //alert to sign tx


            if (state.debug) {
                console.log("signCmd:");
                console.log(signCmd);
            }

            let cmd = null;

            if (state.debug) {
                console.log("xwalletconnected:");
                console.log(this.getters["accounts/getXWalletConnected"]);
            }

            if (state.xwalletconnected === true) {
                const xwalletcode = `(free.legendofthanos.buy-bow ${JSON.stringify(accountName2)} (read-keyset 'userks) 0.5)`;
                const XWalletRequest = {

                    networkId: NETWORKID,
                    signingCmd: {
                        sender: accountName2,
                        chainId: "1",
                        gasPrice: 0.000001,
                        gasLimit: 15000,
                        ttl: 600,
                        caps: [Pact.lang.mkCap("Gas Capability", "Agreement to Pay Gas", "coin.GAS", []), Pact.lang.mkCap("Transfer Capability", "Agreement to Transfer 0.1 KDA to the Legend of Thanos for 1 STAFF", "coin.TRANSFER", [accountName2, legendofthanosbank, 0.5])],
                        pactCode: xwalletcode,
                        envData: {
                            userks: accountGuard
                        },
                        networkId: NETWORKID,
                        signingPubKey: publickey,

                    } //alert to sign tx

                };

                cmd = await window.kadena.request({
                    method: "kda_requestSign",
                    networkId: NETWORKID,
                    data: XWalletRequest
                });

            }else {
                if(state.debug){
                    console.log("OTHER WALLET SIGNING");
                }
                cmd = await Pact.wallet.sign(signCmd);
            }

            if (state.debug && state.xwalletconnected === true) {
                console.log("cmd response:");
                console.log(cmd);
                console.log("is xwallet connected:");
                console.log(state.xwalletconnected);
            }


            try{

                let res = null;

                if (state.xwalletconnected === true) {
                    if (cmd.status === "success") {
                        if (state.debug) {
                            console.log("sign success");
                            console.log("cmd:");
                            console.log(cmd);
                            console.log("cmd signed cmd");
                            console.log(cmd.signedCmd);
                            console.log("cmd signed type");
                            console.log(typeof (cmd.pactCode));
                        }
                        res = await Pact.wallet.sendSigned(cmd.signedCmd, state.network);
                    }
                } else {
                    res = await Pact.wallet.sendSigned(cmd, state.network);
                }



                if (state.debug) {
                    console.log("RES response");
                    console.log(res);
                }


                if (res !== undefined && res !== null) {

                    if (state.debug) {
                        console.log("RES:");
                        console.log(res);
                        if (state.xwalletconnected === true && res.signedCmd !== undefined) {
                            console.log(res.signedCmd);
                        }
                        console.log(res.requestKeys[0]);

                    }

                    if (state.xwalletconnected !== true) {
                        if (res.requestKeys[0]) {
                            await commit("setTransactionHash", res.requestKeys[0]);
                            await commit("setTransactionPolling", true);
                            await commit("setTransactionConfirmed", false);
                            await commit("setTransactionFailed", null);
                            await commit("setTransactionConfirmedResult", null);
                            await this.dispatch("accounts/pollTransactionHash", res.requestKeys[0]);

                        }
                    } else {
                        await commit("setTransactionHash", cmd.signedCmd.hash);
                        await commit("setTransactionPolling", true);
                        await commit("setTransactionConfirmed", false);
                        await commit("setTransactionFailed", null);
                        await commit("setTransactionConfirmedResult", null);
                        await this.dispatch("accounts/pollTransactionHash", cmd.signedCmd.hash);

                    }

                }

            }catch(error){
                if(state.debug){
                    console.log(error);
                }

            }



        } catch (error) {
            console.log(error);
        }
    },

    //Buys a new sword off blockchain
    async buynewsword({commit}, accountName) {
        if (state.debug) {
            console.log("Buying new Staff");
        }
        try {

            const publickey = state.accountData[0]["data"]["guard"]["keys"][0];
            const accountName2 = localStorage.getItem("accountName");
            const accountGuard = state.accountData[0]["data"]["guard"];
            if (state.debug) {
                console.log(accountGuard);
                console.log(publickey);
                console.log(accountName2);
            }
            if (accountName2 !== accountName) {
                console.log("ACCOUNT NAMES DIDNT MATCH!");
                console.log("accountName: " + accountName);
                console.log("accountName2: " + accountName2);
            }


            const legendofthanosbank = "legendofthanos-bank";
            const GAS_PRICE = 0.000001;
            const chainId = state.chainId;
            const NETWORKID = state.networkid;


            const pactCode = `(free.legendofthanos.buy-sword ${JSON.stringify(accountName2)} (read-keyset "user-ks") 1.0)`;
            const signCmd = {
                pactCode: pactCode,
                caps: [Pact.lang.mkCap("Gas Capability", "Agreement to Pay Gas", "coin.GAS", []), Pact.lang.mkCap("Transfer Capability", "Agreement to Transfer 1.0 KDA to the Legend of Thanos for 1 SWORD", "coin.TRANSFER", [accountName2, legendofthanosbank, 1.00])],
                sender: accountName2,
                gasLimit: 15000,
                gasPrice: GAS_PRICE,
                chainId: chainId,
                ttl: 600,
                envData: {
                    "user-ks": accountGuard
                },
                signingPubKey: publickey,
                networkId: NETWORKID
            }; //alert to sign tx


            if (state.debug) {
                console.log("signCmd:");
                console.log(signCmd);
            }

            let cmd = null;

            if (state.debug) {
                console.log("xwalletconnected:");
                console.log(this.getters["accounts/getXWalletConnected"]);
            }

            if (state.xwalletconnected === true) {
                const xwalletcode = `(free.legendofthanos.buy-sword ${JSON.stringify(accountName2)} (read-keyset 'userks) 1.0)`;
                const XWalletRequest = {

                    networkId: NETWORKID,
                    signingCmd: {
                        sender: accountName2,
                        chainId: "1",
                        gasPrice: 0.000001,
                        gasLimit: 15000,
                        ttl: 600,
                        caps: [Pact.lang.mkCap("Gas Capability", "Agreement to Pay Gas", "coin.GAS", []), Pact.lang.mkCap("Transfer Capability", "Agreement to Transfer 1.0 KDA to the Legend of Thanos for 1 SWORD", "coin.TRANSFER", [accountName2, legendofthanosbank, 1.00])],
                        pactCode: xwalletcode,
                        envData: {
                            userks: accountGuard
                        },
                        networkId: NETWORKID,
                        signingPubKey: publickey,

                    } //alert to sign tx

                };

                cmd = await window.kadena.request({
                    method: "kda_requestSign",
                    networkId: NETWORKID,
                    data: XWalletRequest
                });

            }else {
                if(state.debug){
                    console.log("OTHER WALLET SIGNING");
                }
                cmd = await Pact.wallet.sign(signCmd);
            }

            if (state.debug && state.xwalletconnected === true) {
                console.log("cmd response:");
                console.log(cmd);
                console.log("is xwallet connected:");
                console.log(state.xwalletconnected);
            }


            try{

                let res = null;

                if (state.xwalletconnected === true) {
                    if (cmd.status === "success") {
                        if (state.debug) {
                            console.log("sign success");
                            console.log("cmd:");
                            console.log(cmd);
                            console.log("cmd signed cmd");
                            console.log(cmd.signedCmd);
                            console.log("cmd signed type");
                            console.log(typeof (cmd.pactCode));
                        }
                        res = await Pact.wallet.sendSigned(cmd.signedCmd, state.network);
                    }
                } else {
                    res = await Pact.wallet.sendSigned(cmd, state.network);
                }



                if (state.debug) {
                    console.log("RES response");
                    console.log(res);
                }


                if (res !== undefined && res !== null) {

                    if (state.debug) {
                        console.log("RES:");
                        console.log(res);
                        if (state.xwalletconnected === true && res.signedCmd !== undefined) {
                            console.log(res.signedCmd);
                        }
                        console.log(res.requestKeys[0]);

                    }

                    if (state.xwalletconnected !== true) {
                        if (res.requestKeys[0]) {
                            await commit("setTransactionHash", res.requestKeys[0]);
                            await commit("setTransactionPolling", true);
                            await commit("setTransactionConfirmed", false);
                            await commit("setTransactionFailed", null);
                            await commit("setTransactionConfirmedResult", null);
                            await this.dispatch("accounts/pollTransactionHash", res.requestKeys[0]);

                        }
                    } else {
                        await commit("setTransactionHash", cmd.signedCmd.hash);
                        await commit("setTransactionPolling", true);
                        await commit("setTransactionConfirmed", false);
                        await commit("setTransactionFailed", null);
                        await commit("setTransactionConfirmedResult", null);
                        await this.dispatch("accounts/pollTransactionHash", cmd.signedCmd.hash);

                    }

                }

            }catch(error){
                if(state.debug){
                    console.log(error);
                }

            }



        } catch (error) {
            console.log(error);
        }
    },

    //Gets user staff count
    async getAllUserStaffs({commit}, accountName) {
        if (state.debug) {
            console.log("Getting User STAFF Count For:");
            console.log(accountName);
        }
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(free.legendofthanos.get-balance ${JSON.stringify("STAFF")} ${JSON.stringify(accountName)})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Got User STAFF Count");
                    console.log(data.result.data);
                    //console.log(dataResult[0].data);
                }


                commit("setUserTotalStaff", data.result.data);

            } else {
                if (state.debug) {
                    console.log("Error: Could not get User STAFF Count.");
                    console.log(data.result);
                }
            }

        } catch (error) {
            console.log(error);
        }

    },

    //Gets user bow count
    async getAllUserBows({commit}, accountName) {
        if (state.debug) {
            console.log("Getting User BOW Count For:");
            console.log(accountName);
        }
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(free.legendofthanos.get-balance ${JSON.stringify("BOW")} ${JSON.stringify(accountName)})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Got User BOW Count");
                    console.log(data.result.data);
                    //console.log(dataResult[0].data);
                }


                commit("setUserTotalBow", data.result.data);

            } else {
                if (state.debug) {
                    console.log("Error: Could not get User BOW Count.");
                    console.log(data.result);
                }
            }

        } catch (error) {
            console.log(error);
        }

    },

    //Gets user sword count
    async getAllUserSwords({commit}, accountName) {
        if (state.debug) {
            console.log("Getting User SWORD Count For:");
            console.log(accountName);
        }
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(free.legendofthanos.get-balance ${JSON.stringify("SWORD")} ${JSON.stringify(accountName)})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Got User SWORD Count");
                    console.log(data.result.data);
                    //console.log(dataResult[0].data);
                }


                commit("setUserTotalSword", data.result.data);

            } else {
                if (state.debug) {
                    console.log("Error: Could not get User SWORD Count.");
                    console.log(data.result);
                }
            }

        } catch (error) {
            console.log(error);
        }

    },

    //Gets current supply staff count
    async getCurrentSupplyStaffs({commit}) {
        if (state.debug) {
            console.log("Getting current supply of STAFF");
        }
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(free.legendofthanos.total-supply ${JSON.stringify("STAFF")})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Got STAFF Count");
                    console.log(data.result.data);
                    //console.log(dataResult[0].data);
                }


                commit("setCurrentSupplyStaff", data.result.data);

            } else {
                if (state.debug) {
                    console.log("Error: Could not get current supply STAFF Count.");
                    console.log(data.result);
                }
            }

        } catch (error) {
            console.log(error);
        }

    },

    //Gets current supply bow count
    async getCurrentSupplyBows({commit}) {
        if (state.debug) {
            console.log("Getting current supply of BOW");
        }
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(free.legendofthanos.total-supply ${JSON.stringify("BOW")})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Got BOW Count");
                    console.log(data.result.data);
                    //console.log(dataResult[0].data);
                }


                commit("setCurrentSupplyBow", data.result.data);

            } else {
                if (state.debug) {
                    console.log("Error: Could not get current supply BOW Count.");
                    console.log(data.result);
                }
            }

        } catch (error) {
            console.log(error);
        }

    },

    //Gets current supply sword count
    async getCurrentSupplySwords({commit}) {
        if (state.debug) {
            console.log("Getting current supply of SWORD");
        }
        try {
            let t_creationTime = Math.round(new Date().getTime() / 1000) - 10;
            let data = await Pact.fetch.local({
                pactCode: `(free.legendofthanos.total-supply ${JSON.stringify("SWORD")})`,
                meta: Pact.lang.mkMeta("", "1", state.gasPrice, 150000, t_creationTime, 600)
            }, state.network);

            if (data.result.status === "success") {
                if (state.debug) {
                    console.log("Got SWORD Count");
                    console.log(data.result.data);
                    //console.log(dataResult[0].data);
                }


                commit("setCurrentSupplySword", data.result.data);

            } else {
                if (state.debug) {
                    console.log("Error: Could not get current supply SWORD Count.");
                    console.log(data.result);
                }
            }

        } catch (error) {
            console.log(error);
        }

    },

};


const mutations = {
    //Mutations are used to alter our store's state from outside of our store
    //These all SET our stores variables from outside of our store such as from the homepage or navbar

    setActiveAccount(state, selectedAddress) {
        state.activeAccount = selectedAddress;
    },
    setAccountExists(state, exists) {
        if (state.debug) {
            console.log("inside commit/set account exists");
            console.log("setting accountExists to:");
            console.log(exists);
        }
        state.accountExists = exists;
    },
    setAccountData(state, data) {
        state.accountData = data;
    },
    setAccountKeys(state, keys) {
        state.accountKeys = keys;
    },
    setAccountPredicate(state, pred) {
        state.accountPredicate = pred;
    },
    setAccountConfirmed(state, confirmed) {
        if (state.debug) {
            console.log("inside commit/set account confirmed");
            console.log("setting accountConfirmed to:");
            console.log(confirmed);
        }
        state.accountConfirmed = confirmed;
    },
    setAccountName(state, name) {
        if (state.debug) {
            console.log("inside commit/set account name");
            console.log("setting accountname to:");
            console.log(name);
        }
        state.accountName = name;
    },
    setStoreLoaded(state, isloaded) {
        state.loaded = isloaded;
    },
    setTransactionPolling(state, polling) {
        state.transactionPolling = polling;
    },
    setTransactionConfirmed(state, confirmed) {
        state.transactionConfirmed = confirmed;
    },
    setTransactionFailed(state, failed) {
        state.transactionFailed = failed;
    },
    setTransactionHash(state, hash) {
        state.transactionHash = hash;
    },
    setTransactionConfirmedResult(state, result) {
        state.transactionConfirmedResult = result;
    },
    setXWalletConnected(state, isconnected) {
        state.xwalletconnected = isconnected;
    },
    setUserRequests(state, requests) {
        state.userRequests = requests;
    },
    setRequestPending(state, pending) {
        state.requestPending = pending;
    },
    setUserTotalStaff(state, total) {
        state.owned_staff = total;
    },
    setUserTotalBow(state, total) {
        state.owned_bow = total;
    },
    setUserTotalSword(state, total) {
        state.owned_sword = total;
    },
    setCurrentSupplyStaff(state, total) {
        state.current_supply_staff = total;
    },
    setCurrentSupplyBow(state, total) {
        state.current_supply_bow = total;
    },
    setCurrentSupplySword(state, total) {
        state.current_supply_sword = total;
    },
    setMaxSupplyStaff(state, total) {
        state.max_supply_staff = total;
    },
    setMaxSupplyBow(state, total) {
        state.max_supply_bow = total;
    },
    setMaxSupplySword(state, total) {
        state.max_supply_sword = total;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
