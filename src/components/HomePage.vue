<template>
  <div style="overflow-x: hidden !important">

    <!--    Page loading animation section-->
    <div v-if="this.showLoadingModal">
      <div class="container ontop loaderstyle">

        <div>

          <div class="cube h1 w1 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w1 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w1 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w2 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w2 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w2 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w3 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w3 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h1 w3 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>
        </div>

        <div class="h2Container">

          <div class="cube h2 w1 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w1 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w1 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w2 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w2 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w2 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w3 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w3 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h2 w3 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>
        </div>

        <div class="h3Container">

          <div class="cube h3 w1 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w1 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w1 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w2 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w2 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w2 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w3 l1">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w3 l2">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>

          <div class="cube h3 w3 l3">
            <div class="face top"></div>
            <div class="face left"></div>
            <div class="face right"></div>
          </div>
        </div>

      </div>
    </div>

    <!--    Homepage shown after loading is completed-->
    <section class="moveup">

      <!--      vue-scroll-div container section-->
      <Scroll-Div width="100%" height="100vh" view-class="scrollstyle" v-if="this.showLoadingModal === false">

        <div>

          <!--          Cave background -->
          <div class="cavebg" style="z-index: 0;"></div>

          <!--          Oldman speech bubbles-->
          <div class="columns is-mobile mt-5">
            <div v-if="showOldmanVanish === false" class="column is-4 is-offset-4" style="z-index:1">
              <blockquote class="oldman-speechbubble"><p>It's dangerous to go alone, take one of these..</p>
              </blockquote>
            </div>
            <div v-if="showOldmanVanish === true" class="column is-4 is-offset-4" style="z-index:1">
              <blockquote class="oldman-speechbubble"><p>Your journey awaits you..</p></blockquote>
            </div>
          </div>

          <!--          Oldman images-->
          <div class="columns is-mobile">
            <div class="column is-one-third mt-6" style="z-index:1">
              <img src="../assets/Fire.gif" width="100px" alt="Fire" style="position: relative; top:100px; left: 45%;">
            </div>
            <div v-if="showOldmanVanish === false" class="column is-one-third" style="z-index:1">
              <img src="../assets/oldman_communicating.gif" width="300px" alt="Oldman">
            </div>
            <div v-if="showOldmanVanish === true" class="column is-one-third" style="z-index:1">
              <img src="../assets/oldman-vanish.gif" width="300px" alt="Oldman">
            </div>
            <div class="column is-one-third mt-6" style="z-index:1">
              <img src="../assets/Fire.gif" width="100px" alt="Fire" style="position: relative; top:100px; right: 40%;">
            </div>
          </div>

          <!--          Items section-->
          <div class="columns ontop ml-2 mr-2">

            <!--          Staff item-->
            <div class="column is-one-third">

              <div class="card has-background-black-ter cardborder">

                <div class="card-content">
                  <p class="title has-background-grey-dark pt-2 pb-2" expanded>
                    Staff
                  </p>
                </div>
                <div class="card-image">
                  <img src="../assets/Staff.svg" alt="Staff" width="100" height="100">
                </div>
                <div class="columns is-centered pt-4 pb-0">
                  <div class="column is-centered">
                    <div class="container">
                      <nav class="level">
                        <div class="level-item has-text-centered">
                          <b-button @click="buyastaff" class="buybutton" type="is-primary">Buy for 0.1 KDA</b-button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
                <footer class="card-footer">
                  <p class="card-footer-item">
                    <span>
                      Max Supply: {{ this.getMaxSupplyStaff() }}
                    </span>
                                </p>
                                <p class="card-footer-item">
                    <span>
                      Current Supply: {{ this.getCurrentSupplyStaff() }}
                    </span>
                                </p>
                                <p class="card-footer-item">
                    <span>
                     Owned: {{ this.getOwnedStaff() }}
                    </span>
                  </p>
                </footer>
              </div>

            </div>

            <!--          Bow item-->
            <div class="column is-one-third">

              <div class="card has-background-black-ter cardborder">

                <div class="card-content">
                  <p class="title has-background-grey-dark pt-2 pb-2">
                    Bow
                  </p>
                </div>
                <div class="card-image">
                  <img src="../assets/Bow.svg" alt="Staff" width="34" height="100">
                </div>
                <div class="columns is-centered pt-4 pb-0">
                  <div class="column is-centered">
                    <div class="container">
                      <nav class="level">
                        <div class="level-item has-text-centered">
                          <b-button @click="buyabow" class="buybutton" type="is-primary">Buy for 0.5 KDA</b-button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
                <footer class="card-footer">
                  <p class="card-footer-item">
                    <span>
                      Max Supply: {{ this.getMaxSupplyBow() }}
                    </span>
                                </p>
                                <p class="card-footer-item">
                    <span>
                      Current Supply: {{ this.getCurrentSupplyBow() }}
                    </span>
                                </p>
                                <p class="card-footer-item">
                    <span>
                     Owned: {{ this.getOwnedBow() }}
                    </span>
                  </p>
                </footer>
              </div>

            </div>

            <!--          Sword item-->
            <div class="column is-one-third">

              <div class="card has-background-black-ter cardborder">

                <div class="card-content">
                  <p class="title has-background-grey-dark pt-2 pb-2">
                    Sword
                  </p>
                </div>
                <div class="card-image">
                  <img src="../assets/Sword.svg" alt="Staff" width="100" height="100">
                </div>
                <div class="columns is-centered pt-4 pb-0">
                  <div class="column is-centered">
                    <div class="container">
                      <nav class="level">
                        <div class="level-item has-text-centered">
                          <b-button @click="buyasword" class="buybutton" type="is-primary">Buy for 1 KDA</b-button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
                <footer class="card-footer">
                  <p class="card-footer-item">
                    <span>
                      Max Supply: {{ this.getMaxSupplySword() }}
                    </span>
                                </p>
                                <p class="card-footer-item">
                    <span>
                      Current Supply: {{ this.getCurrentSupplySword() }}
                    </span>
                                </p>
                                <p class="card-footer-item">
                    <span>
                     Owned: {{ this.getOwnedSword() }}
                    </span>
                  </p>
                </footer>
              </div>

            </div>
          </div>
        </div>
      </Scroll-Div>
    </section>


  </div>
</template>

<script>
//import vue store variables to this page
import {mapGetters, mapState} from "vuex";

//local state
export default {
  name: "HomePage",
  data() {
    return {
      debug: false,
      showLoadingModal: true,
      showOldmanVanish: false,
    };
  },
  watch: {
    //lets watch our transactionPolling variable in the vue store and update our homepage images after it does
    transactionPolling: function (newValue, oldValue) {
      if (this.debug) {
        console.log("getTransactionPolling newValue: " + newValue);
        console.log("getTransactionPolling oldValue: " + oldValue);
      }
      if (newValue === false && oldValue === true) {
        this.showOldmanVanish = true;
      }

    },

  },
  computed: {
    //import state variables from our vue store
    ...mapState("accounts", ["transactionPolling"]),
  },
  methods: {
    //map getters from vue store
    ...mapGetters("accounts", ["getAccountExists", "getOwnedStaff", "getOwnedBow", "getOwnedSword", "getAccountConfirmed", "getMaxSupplyStaff", "getMaxSupplyBow", "getMaxSupplySword", "getCurrentSupplyStaff", "getCurrentSupplyBow", "getCurrentSupplySword"]),

    //handles buying a staff
    async buyastaff() {

      //check for users account name from local storage
      let theAccountName = localStorage.getItem("accountName");
      //dispatch buy staff method via vue store
      await this.$store.dispatch("accounts/buynewstaff", theAccountName);
      console.log("Buying new STAFF with account: " + theAccountName);


    },
    async buyabow() {
      let theAccountName = localStorage.getItem("accountName");
      await this.$store.dispatch("accounts/buynewbow", theAccountName);
      console.log("Buying new BOW with account: " + theAccountName);
    },
    async buyasword() {
      let theAccountName = localStorage.getItem("accountName");
      await this.$store.dispatch("accounts/buynewsword", theAccountName);
      console.log("Buying new SWORD with account: " + theAccountName);
    },
  },
  //created() executes 1 frame before our page is shown
  async created() {

    //Lets load the blockchains state and get current supply of NFTs
    await this.$store.dispatch("accounts/getCurrentSupplyStaffs");
    await this.$store.dispatch("accounts/getCurrentSupplyBows");
    await this.$store.dispatch("accounts/getCurrentSupplySwords");

    //Lets get the users account from local storage if it exists
    let name = localStorage.getItem("accountName");

    //Lets check if our user is logged in, if so, lets grab the users state from the blockchain, including their NFT balances
    if (name === null || name === "") {
      if (this.debug) {
        console.log("No user local accountName found.");
      }
    } else {
      //Get staffs
      await this.$store.dispatch("accounts/getAllUserStaffs", name);
      //Get bows
      await this.$store.dispatch("accounts/getAllUserBows", name);
      //Get swords
      await this.$store.dispatch("accounts/getAllUserSwords", name);
    }

    //Close loading screen
    setTimeout(async () => {
      this.showLoadingModal = false;
    }, 1000);
  }
};
</script>

<style scoped>

/* background */
.cavebg {
  background-image: url('../assets/cave.png');
  background-size: cover !important;
  background-repeat: repeat;
  background-position: 0% 30%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  zIndex: -1;
  margin: 0px;
  padding: 10px;
  height: 110vh;
  position: absolute;
}

/* oldman speech bubble */
.oldman-speechbubble {
  position: relative;
  padding: 15px 30px;
  margin: 0;
  font-size: 16px;
  color: #fff;
  background: #5a8f00; /* default background for browsers without gradient support */
  /* css3 */
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#b8db29), to(#5a8f00));
  background: -moz-linear-gradient(#b8db29, #5a8f00);
  background: -o-linear-gradient(#b8db29, #5a8f00);
  background: linear-gradient(#b8db29, #5a8f00);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  font-family: 'Iceberg', sans-serif;
}

/* oldman speech bubble */
.oldman-speechbubble + p {
  margin: 15px 0 2em 85px;
  font-style: italic;
}

/* creates the triangle for speechbubble*/
.oldman-speechbubble:after {
  content: "";
  position: absolute;
  bottom: -50px;
  left: 50px;
  border-width: 0 20px 50px 0px;
  border-style: solid;
  border-color: transparent #5a8f00;
  display: block;
  width: 0;
}

/* border for item cards */
.cardborder {
  border: 5px outset #87ba74;
  border-radius: 1rem;
  color: #87ba74;
}

/* item card titles */
.title {
  color: #176505;
  font-family: 'Iceberg', sans-serif;
  background: #5a8f00; /* default background for browsers without gradient support */
  /* css3 */
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#b8db29), to(#5a8f00));
  background: -moz-linear-gradient(#b8db29, #5a8f00);
  background: -o-linear-gradient(#b8db29, #5a8f00);
  background: linear-gradient(#b8db29, #5a8f00);
}

/* buy button */
.buybutton {
  font-family: 'Iceberg', sans-serif;
}

/* item card footer */
.card-footer {
  border-top: 1px solid #87ba74 !important;
  font-family: 'Iceberg', sans-serif !important;
}

/* item card footer  */
.card-footer-item:not(:last-child) {
  border-right: 1px solid #87ba74 !important;
}

/* page loading style */
.loaderstyle {
  z-index: 1;
  position: absolute !important;
  top: 40%;
  left: 47%;
  background-color: #0c0c0c;
}

/* scroll div styles */
.scrollstyle {
  overflow-x: hidden !important;
}

</style>

<style lang="scss" scoped>
/* SCSS for page loading animation */
$background: #222;
$leftFace: linear-gradient(#7029db, #6b008f);
$rightFace: linear-gradient(#b8db29, #5a8f00);
$topFace: linear-gradient(#2b282f, #1b1a1f);
$scale: 1;
$duration: 3s;
$timingFunction: ease;

.cube {
  position: absolute;
  width: 86px;
  height: 100px;
}

.right {
  background: $rightFace;
  transform: rotate(-30deg) skewX(-30deg) translate(49px, 65px) scaleY(0.86);
}

.left {
  background: $leftFace;
  transform: rotate(90deg) skewX(-30deg) scaleY(0.86) translate(25px, -50px);
}

.top {
  background: $topFace;
  transform: rotate(210deg) skew(-30deg) translate(-75px, -22px) scaleY(0.86);
  z-index: 2;
}

.face {
  height: 50px;
  width: 50px;
  position: absolute;
  transform-origin: 0 0;
}

@mixin slice($h, $w, $l) {
  .h#{$h}.w#{$w}.l#{$l} {
    z-index: (-#{$h});
    animation-name: h#{$h}w#{$w}l#{$l};
    animation-timing-function: $timingFunction;
    animation-duration: $duration;
    animation-iteration-count: infinite;
  }
  @keyframes h#{$h}w#{$w}l#{$l} {
    0% {
      transform: translate(($w * -50% - 50%) + ($l * 50% + 50%), ($h * 50 - 200%) + ($w * 25% - 25%) + ($l * 25 + 25%));
    }
    14% {
      transform: translate(($w * -50% - 50%) + ($l * 100% - 50%), ($h * 50 - 200%) + ($w * 25% - 25%) + ($l * 50 - 25%));
    }
    28% {
      transform: translate(($w * -100% + 50%) + ($l * 100% - 50%), ($h * 50 - 200%) + ($w * 50% - 75%) + ($l * 50 - 25%));
    }
    43% {
      transform: translate(($w * -100% - 100%) + ($l * 100% + 100%), ($h * 100 - 400%) + ($w * 50% - 50%) + ($l * 50 + 50%));
    }
    57% {
      transform: translate(($w * -100% - 100%) + ($l * 50% + 200%), ($h * 100 - 400%) + ($w * 50% - 50%) + ($l * 25 + 100%));
    }
    71% {
      transform: translate(($w * -50% - 200%) + ($l * 50% + 200%), ($h * 100 - 375%) + ($w * 25% - 25%) + ($l * 25 + 100%));
    }
    85% {
      transform: translate(($w * -50% - 50%) + ($l * 50% + 50%), ($h * 50 - 200%) + ($w * 25% - 25%) + ($l * 25 + 25%));
    }
    100% {
      transform: translate(($w * -50% - 50%) + ($l * 50% + 50%), ($h * 50 - 200%) + ($w * 25% - 25%) + ($l * 25 + 25%));
    }
  }
}

@mixin generateSlice() {
  @for $i from 1 to 4 {
    @for $j from 1 to 4 {
      @for $k from 1 to 4 {
        @include slice($i, $j, $k);
      }
    }
  }
}

@include generateSlice();
</style>
