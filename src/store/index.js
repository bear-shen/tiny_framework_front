import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store(
    {
        state    : {
            query            : {},
            //
            page             : 1,
            paginatorCallback: function (page) {
            }
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
        },
        actions  : {},
        modules  : {}
    })
