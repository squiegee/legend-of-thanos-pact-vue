<template>
  <section>

    <!--    Bulma Navbar-->
    <b-navbar class="has-background-black-ter">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="../assets/castle.svg" height="50px" width="50px" alt="NFT Tutorial">
          <span class="logotitle">The Legend of Thanos</span>
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item class="greenish" href="#">
          Tutorial
        </b-navbar-item>
        <b-navbar-item class="greenish" target="_blank" href="https://pact-language.readthedocs.io/en/stable/index.html">
          Pact Docs
        </b-navbar-item>
        <b-navbar-item class="greenish" target="_blank" href="https://faucet.testnet.chainweb.com/">
          Testnet Faucet
        </b-navbar-item>
      </template>
      <template :showTransactionButton="this.showTransactionButton" :getRequestPending="this.getRequestPending()" :xwalletconnected="this.xwalletconnected" :accountConfirmedNavBar="this.accountConfirmedNavBar" :displayFixedAccountName="this.displayFixedAccountName()" #end>
        <b-navbar-item v-if="showTransactionButton === true" tag="div">
          <div class="buttons" @click="clickShowTransactionModal">
            <a class="button is-primary">
              <div class="clockloader"></div>
            </a>
          </div>
        </b-navbar-item>
        <b-navbar-item tag="div">
          <div v-if="accountConfirmedNavBar && displayFixedAccountName !== null && displayFixedAccountName !== 'null'" class="buttons" @click="clickDisconnect">
            <a class="button is-primary">
              <strong>{{ displayFixedAccountName }}</strong>
            </a>
          </div>
          <div v-if="accountConfirmedNavBar === false || displayFixedAccountName === null || displayFixedAccountName === 'null'" class="buttons" @click="connectWallet">
            <a class="button is-primary">
              <strong>Connect Wallet</strong>
            </a>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <!--Connect Wallet Modal-->
    <b-modal v-if="this.showConnectWalletModal === true" v-model="showConnectWalletModal" :width="640" scroll="keep">
      <div class="card has-background-black-ter">
        <div class="card-content">
          <div class="content">
            <div class="container">
              <nav class="level has-background-black-ter">
                <div class="level-item has-text-centered">
                  <b-message class="accountHeader">
                    Connect your Kadena K:Account or X-Wallet
                  </b-message>
                </div>
              </nav>
            </div>

            <div v-if="this.getAccountExists() === true" class="columns is-centered pt-4 pb-0">
              <div class="column is-centered">
                <div class="container">
                  <nav class="level">
                    <div class="level-item has-text-centered">
                      <b-message class="is-success">
                        K:Account Found!
                      </b-message>
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            <div v-if="this.getAccountExists() === false" class="columns is-centered pt-4 pb-0">
              <div class="column is-centered">
                <div class="container">
                  <nav class="level">
                    <div class="level-item has-text-centered">
                      <b-message class="is-danger">
                        No K:Account Found on Chain 1!
                      </b-message>
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            <div class="columns is-centered pt-0 pb-0">
              <div class="column is-centered">
                <section class="section pt-4 pb-4">
                  <div class="container">
                    <nav class="level">
                      <div class="level-item has-text-centered">
                        <b-field label="">
                          <b-input @change="autoVerify()" @input="autoVerify()" class="accountInputField"
                                   v-model="accountNameToVerify" placeholder="My K:Account"></b-input>
                        </b-field>
                      </div>
                    </nav>
                  </div>
                </section>

                <div class="columns is-mobile is-centered">
                  <div class="column">
                    <p class="notification is-info has-text-centered">
                      <b-button @click="clickConfirm" v-if="this.getAccountExists() === true" type="is-primary">Connect
                        K:Account
                      </b-button>
                      <b-button disabled
                                v-if="this.getAccountExists() === false || this.getAccountExists() === '' || this.getAccountExists() === null || this.getAccountExists() === undefined"
                                type="is-primary">Connect K:Account
                      </b-button>
                    </p>
                  </div>
                  <div class="column">
                    <p class="notification is-info has-text-centered">
                      <b-button @click="connectxwallet" type="is-primary">Connect X-Wallet</b-button>
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </b-modal>

    <!--Confirm X-Wallet Modal- shown after user clicks 'connect xwallet'-->
    <b-modal v-if="this.showXWalletFinalModal === true" v-model="showXWalletFinalModal" :width="640" scroll="keep">
      <div class="card has-background-black-ter">
        <div class="card-content">
          <div class="content">
            <div class="container">
              <nav class="level has-background-black-ter">
                <div class="level-item has-text-centered">
                  <b-message class="accountHeader">
                    Confirm X-Wallet Account
                  </b-message>
                </div>
              </nav>
            </div>

            <div v-if="this.getAccountExists() === true" class="columns is-centered pt-4 pb-0">
              <div class="column is-centered">
                <div class="container">
                  <nav class="level">
                    <div class="level-item has-text-centered">
                      <b-message class="is-success">
                        K:Account Found!
                      </b-message>
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            <div v-if="this.getAccountExists() === false" class="columns is-centered pt-4 pb-0">
              <div class="column is-centered">
                <div class="container">
                  <nav class="level">
                    <div class="level-item has-text-centered">
                      <b-message class="is-danger">
                        No K:Account Found on Chain 1!
                      </b-message>
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            <div class="columns is-centered pt-0 pb-0">
              <div class="column is-centered">
                <section class="section pt-4 pb-4">
                  <div class="container">
                    <nav class="level">
                      <div class="level-item has-text-centered">
                        <b-button @click="confirmxwallet" type="is-primary">Confirm</b-button>
                      </div>
                    </nav>
                  </div>
                </section>
              </div>
            </div>


          </div>
        </div>
      </div>
    </b-modal>

    <!--Transaction Pending Modal- shown when user clicks pending click icon-->
    <b-modal v-if="this.showTransactionModal === true" v-model="showTransactionModal" :width="640" scroll="keep">
      <div class="card has-background-black-ter">
        <div class="card-content">
          <div class="content">
            <div class="container">
              <nav class="level has-background-black-ter">
                <div class="level-item has-text-centered">
                  <b-message class="accountHeader">
                    Awaiting pending transaction confirmation:
                  </b-message>
                </div>
              </nav>
            </div>

            <div class="container">
              <nav class="level has-background-black-ter">
                <div class="level-item has-text-centered">
                  <b-message class="accountHeader">
                    <a :href="exploerLink" target="_blank" style="color: #8b1b93">{{this.getTransactionHash()}}</a>
                  </b-message>
                </div>
              </nav>
            </div>



            <div class="columns is-centered pt-0 pb-0">
              <div class="column is-centered">
                <section class="section pt-4 pb-4">
                  <div class="container">
                    <nav class="level">
                      <div class="level-item has-text-centered">
                        <b-button @click="closeTransactionModal" type="is-primary">Confirm</b-button>
                      </div>
                    </nav>
                  </div>
                </section>
              </div>
            </div>


          </div>
        </div>
      </div>
    </b-modal>
  </section>

</template>

<script>
//import vue store variables
import {mapActions, mapGetters, mapState} from "vuex";

export default {
  name: "Navbar",
  components: {},
  watch: {
    //lets watch if our xwalletconnected variable changes in the vue store and update our navbar when it does
    xwalletconnected: function (val, oldval) {
      if (this.debug) {
        console.log("xwalletconnected state change detected");
        console.log("new val:");
        console.log(val);
        console.log("old val:");
        console.log(oldval);
      }
      this.accountConfirmedNavBar = val;
    },
    //lets watch our transactionPolling variable in the vue store and update our navbar with a clock icon when it does
    transactionPolling: function (newValue, oldValue) {
      if(this.debug) {
        console.log("getTransactionPolling newValue: " + newValue);
        console.log("getTransactionPolling oldValue: " + oldValue);
      }
      if (newValue === true) {
        this.showTransactionButton = true;
      } else if (newValue === false) {
        this.showTransactionButton = false;
      }

    },

  },
  data() {
    return {
      debug: false, //enables console debug info
      showConnectWalletModal: false, //shows connect wallet modal
      showTransactionButton: false, //shows pending transaciton icon in navbar
      showTransactionModal: false, //shows pending transaction modal
      showXWalletFinalModal: false, //shows confirm xwallet modal
      accountNameToVerify: "", //Account name to attempt to verify on connect wallet modal
      accountConfirmedNavBar: false, //confirms our navbar is finished loading a new user and can display it's information
    };
  },
  computed: {
    //import state variables from our vue store
    ...mapState("accounts", ["transactionPolling", "xwalletconnected"]),

    //Displays account name as '123124234...'
    displayFixedAccountName() {
      if (this.getXWalletConnected() === false) {
        if (this.accountNameToVerify.length > 12) {
          return this.accountNameToVerify.slice(0, 12) + "....";
        } else {
          return this.accountNameToVerify;
        }
      } else if (this.getXWalletConnected() === true) {
        if (this.getAccountName().length > 12) {
          return this.getAccountName().slice(0, 12) + "....";
        } else {
          return this.getAccountName();
        }
      } else {
        return this.accountNameToVerify;
      }
    },

    //returns transaction hash link for pending transaction modal
    exploerLink(){
      return 'https://explorer.chainweb.com/testnet/tx/'+this.getTransactionHash().toString();
    }
    ,
  },
  methods: {
    //map getters and actions for vue store
    ...mapGetters("accounts", ["getAccountExists", "getAccountName", "getAccountKeys", "getAccountPredicate", "getAccountData", "getAccountConfirmed", "getTransactionPolling", "getTransactionConfirmed", "getTransactionFailed", "getTransactionHash", "getTransactionConfirmedResult", "getXWalletConnected", "getRequestPending"]),
    ...mapActions("accounts", ["getAccountVerification"]),


    //shows transaction modal when user clicks clock icon
    clickShowTransactionModal(){
      this.showTransactionModal = !this.showTransactionModal;
    },

    //closes transaction modal when user clicks confirm button from transaction modal
    closeTransactionModal(){
      this.showTransactionModal = !this.showTransactionModal;
    },

    //Handles when user clicks 'connect wallet' button from navbar & displays our connect wallet modal window to the user
    async connectWallet() {
      this.showConnectWalletModal = true;
    },

    //Handles disconnecting wallets when the user clicks disconnect
    async clickDisconnect() {
      if (this.getXWalletConnected() === false) {
        //Are we not using xwallet? If not, clickCancel
        await this.clickCancel();
      } else if (this.getXWalletConnected() === true) {
        //Are we using xwallet? If so, clickCancel + clickDisconnect
        await this.clickCancel();
        await this.clickDisconnectXwallet();
      }
    },

    //Disconnects Xwallet properly
    async clickDisconnectXwallet() {
      if (this.debug) {
        console.log("disconnecting");
      }

      //xwallet injects itself into the window as kadena, lets look for it:
      let kadena = window.kadena;

      //lets send xwallet its kda_disconnect request and disconnect it
      let accountResult = await kadena.request({
        method: "kda_disconnect",
        networkId: "testnet04",
        domain: window.location.hostname
      });

      if (this.debug) {
        console.log(accountResult.status);
      }

    },

    //Handles resetting account information when a user disconnects their wallet
    async clickCancel() {
      //Close modal
      this.showConnectWalletModal = false;
      //Clear account input field
      this.accountNameToVerify = "";
      //Reset account information in the vue store
      await this.$store.dispatch("accounts/resetAccountExists");
      //Reset local storage variables
      localStorage.setItem("accountName", "");
      localStorage.setItem("isConnected", false);
      localStorage.setItem("isUsingXwallet", false);
      //Reset navbar and redirect user to home page
      this.accountConfirmedNavBar = false;
      if (this.$route.name !== "home") {
        await this.$router.push({path: `/`});
      }
    },

    //Handles connecting to xwallet
    async connectxwallet() {
      //Close connect wallet modal
      this.showConnectWalletModal = false;
      //Show Confirm xwallet final modal
      this.showXWalletFinalModal = true;
      //Connect xwallet via vue store
      await this.$store.dispatch("accounts/connectXwallet");
    },

    async confirmxwallet() {
      //Close connect wallet modal
      this.showConnectWalletModal = false;
      //Show Confirm xwallet final modal
      this.showXWalletFinalModal = false;
      //Connect xwallet via vue store
      await this.$store.dispatch("accounts/connectXwallet");
    },

    //Attempts to verify kadena account as user types their k:account in the connect wallet input field
    async autoVerify() {
      let payload = this.accountNameToVerify;
      await this.$store.dispatch("accounts/getAccountVerification", payload);
    },

    //Handles what happens when a user clicks 'connect k:account"
    async clickConfirm() {
      //Close the connect wallet modal
      this.showConnectWalletModal = false;

      //Get our k:account information from the vue store
      let t_keys = this.getAccountKeys();
      let t_pred = this.getAccountPredicate();
      let t_accountdata = this.getAccountData();
      if (this.debug) {
        console.log("keys from store:");
        console.log(t_keys);
        console.log("predicate from store:");
        console.log(t_pred);
        console.log("account data from store:");
        console.log(t_accountdata);
      }

      if (this.debug) {
        console.log("Dispatching confirmAccountExists to vue store for account name:");
        console.log(this.accountNameToVerify);
      }
      //Confirm the user wants to connect this account via the vue store
      await this.$store.dispatch("accounts/confirmAccountExists", this.accountNameToVerify);

      if (this.debug) {
        console.log("Setting local storage up.");
      }
      //Set up local storage variables to help us detect if the user ever comes back to our game after they leave
      localStorage.setItem("isUsingXwallet", false);
      localStorage.setItem("accountName", this.accountNameToVerify);
      localStorage.setItem("isConnected", true);
      this.accountConfirmedNavBar = true;
    },


  },
  //Executes 1 frame before our navbar appears
  async created() {

    //Is our user already connected?
    let checkConfirmed = this.getAccountConfirmed();

    //Lets display the account data we have available at this point
    if (this.debug) {
      console.log("Navbar created!");
      console.log("Checking if we are already connected..");
      console.log("accountConfirmedNavBar:");
      console.log(this.accountConfirmedNavBar);
      console.log("checkConfirmed:");
      console.log(checkConfirmed);
      console.log("localstorage isConnected:");
      console.log(localStorage.getItem("isConnected"));
      console.log("localstorage accountName:");
      console.log(localStorage.getItem("accountName"));
      console.log("localstorage predicate:");
      console.log(localStorage.getItem("accountPredicate"));
      console.log("localstorage account public key:");
      console.log(localStorage.getItem("accountPublicKey"));
      console.log("isUsingXwallet");
      console.log(localStorage.getItem("isUsingXwallet"));
    }

    //Does our user have any of the localstorage variables we set up previously present in their browser?
    if (localStorage.getItem("accountName")) {

      //Lets get the accountName from local storage
      this.accountNameToVerify = localStorage.getItem("accountName");
      if (this.debug) {
        console.log("this.accountNameToVerify:");
        console.log(this.accountNameToVerify);
      }

      //Lets veryify the account from local storage with the vue store and store its data in the store
      await this.$store.dispatch("accounts/getAccountVerification", this.accountNameToVerify);
      await this.$store.dispatch("accounts/confirmAccountExists", this.accountNameToVerify);


      //Lets check if Xwallet is present in the users browser
      if (this.debug) {
        console.log("window.kadena");
        console.log(window.kadena);
        console.log("xwallet isKadena:");
        console.log(window.kadena.isKadena);
      }

      if (window.kadena && window.kadena.isKadena === true) {
        //Xwallet is present

        if (this.debug) {
          console.log("XWallet is available");
        }

        //Lets check to confirm if the user is using xwallet by checking for our local storage variable
        let xwalletconnect = localStorage.getItem("isUsingXwallet");
        if (this.debug) {
          console.log("xwalletconnect:");
          console.log(xwalletconnect);
        }

        if (localStorage.getItem("isUsingXwallet") === "true") {
          //Our user is using Xwallet

          if (this.debug) {
            console.log("XWallet IS being used");
          }

          //Lets update the store that Xwallet is connected
          await this.$store.dispatch("accounts/setXWalletIsConnected");

        } else {

          if (this.debug) {
            console.log("Xwallet is NOT being used");
          }

        }

      }

      //Lets update the navbar
      this.accountConfirmedNavBar = true;


    }

  },

};
</script>

<!--Css styles scoped only to this page-->
<style scoped>

.accountInputField {
  width: 400px;
}

.accountHeader {
  width: 600px;
}

.navbar {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-top: .5rem;
  padding-bottom: .5rem;
  font-family: 'Iceberg', sans-serif;
}

.navbar-link {
  color: #87ba74 !important;
}

.logotitle {
  color: #bab474 !important;
}

.navbar-item:hover {
  background-color: #3d3549;
}

.navbar-item:active {
  background-color: #242424;
}

.navbar-item:focus {
  background-color: #242424;
}

.navbar-item.has-dropdown:focus .navbar-link, .navbar-item.has-dropdown:hover .navbar-link, .navbar-item.has-dropdown.is-active .navbar-link {
  background-color: #875ed2 !important;
}

.clockloader{
  background: repeating-linear-gradient(to bottom,#fff 10px,#f5f5f5 20px);
  background-blend-mode: multiply;
  height: 40px;
  width: 40px;
  margin: 0 auto 0;
  border: 5px solid #87ba74;
  box-shadow: 0 0 5px #87ba74 inset;
  border-radius: 50%;
  position: relative;
  top:0px;
}
.clockloader:before,
.clockloader:after{
  content: '';
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transform: translate(-50%);
  transform-origin: bottom;
  position: absolute;
  left: 50%;
  bottom: 50%;
}
.clockloader:before{
  background-color: #eb3b5a;
  width: 3px;
  height: 31%;
  animation: rotate 5s linear infinite;
}
.clockloader:after{
  background-color: #2c3e50;
  width: 3px;
  height: 40%;
  animation: rotate 2s linear infinite;
}
@keyframes rotate{
  from{ transform: rotate(0); }
  to{ transform: rotate(360deg); }
}


</style>
