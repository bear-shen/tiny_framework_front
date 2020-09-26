import Vue  from 'vue'
import Vuex from 'vuex'
import App  from "../App";

Vue.use(Vuex)

export default new Vuex.Store(
    {
        state    : {
            query            : {},
            //
            page             : 1,
            paginatorCallback: function (page) {
            },
            popupDOM         : null,
        },
        mutations: {
            setPage             : (state, page) => {
                console.info(`Store setPage: ${page}`);
                if (state.page === page) return;
                state.page = page;
                state.paginatorCallback(page);
            },
            setPaginatorCallback: (state, callback) => {
                console.info(`Store setPaginatorCallback: `);
                state.paginatorCallback = callback;
            },
            setQuery            : (state, query) => {
                console.info(`Store setQuery: `);
                state.query = query;
            },
            showFileList        : function (state, payload) {
                console.info('store showFileList');
                console.info(state.popupDOM);
                console.info(state.popupDOM.show());
                /*this.popupData = {
                 type: 'file',
                 data: payload,
                 };*/
            },
            registerPopupDOM    : function (state, payload) {
                console.info('store registerPopupDOM');
                state.popupDOM = payload;
            }
        },
        actions  : {},
        modules  : {}
    })
