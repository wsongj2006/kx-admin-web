import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    //所有的数据都放在state中
    state:{
        parentMenu: '',
        childMenu: '',
        childMenuCode: '',
        parentMenuCode: '',
        subAction: ''
    },

    //操作数据，唯一的通道是mutations
    mutations:{
        updateMenu(state,data) {
          state.parentMenu = data.parentMenu
          state.childMenu = data.childMenu
          state.parentMenuCode = data.parentMenuCode
        },
        updateSubAction(state,data) {
          state.subAction = data.subAction
        }
    },

    //actions,可以来做异步操作，然后提交给mutations，而后再对state(数据)进行操作
    actions:{}
})
