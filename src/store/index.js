import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store(
    {
        state    : {
            page : 1,
            query: {},
        },
        mutations: {
            setPage : (state, page) => {
                state.page = page;
            },
            setQuery: (state, query) => {
                state.query = query;
            },
        },
        actions  : {},
        modules  : {}
    })
