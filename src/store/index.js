import Vue from 'vue' //vue
import Vuex from 'vuex' //vuex
import accounts from "./modules/accounts.js" //all Legend Of Thanos store variables here for now

Vue.use(Vuex);

//store is not empty, see accounts.js module
export const store = new Vuex.Store({
    state:{

    },
    getters:{

    },
    modules: {
        accounts,
    },
    mutations:{

    },
    actions:{

    },
});
