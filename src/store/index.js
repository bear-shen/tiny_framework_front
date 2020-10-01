import Vue    from 'vue'
import Vuex   from 'vuex'
import App    from "../App";
import router from "../router";

Vue.use(Vuex)

export default new Vuex.Store(
    {
        state    : {
            paginatorDOM: null,
            //
            msgDOM      : null,
            //
            popupDOM    : null,
        },
        mutations: {
            // -------------------------------
            registerPaginator: (state, dom) => {
                console.info(`Store registerPaginator`);
                state.paginatorDOM = dom;
            },
            // -------------------------------
            goto             : (state, query) => {
                console.info(`Store goto`);
                if (!state.paginatorDOM) return false;
                //
                let routeData = Object.assign({path: '', query: {}}, query);
                router.push(routeData);
            },
            // -------------------------------
            pushMsg          : (state, payload) => {
                console.info('store pushMsg');
                if (!state.msgDOM) return false;
                state.msgDOM.push(payload.type, payload.data);
            },
            registerMsgDOM   : (state, dom) => {
                console.info('store registerMsgDOM');
                state.msgDOM = dom;
            },
            // -------------------------------
            popup            : (state, payload) => {
                console.info('store popup');
                if (!state.popupDOM) return false;
            },
            registerPopupDOM : (state, dom) => {
                console.info('store registerPopupDOM');
                state.popupDOM = dom;
            },
        },
        actions  : {},
        modules  : {}
    })
