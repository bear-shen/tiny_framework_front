import Vue    from 'vue'
import Vuex   from 'vuex'
import App    from "../App";
import router from "../router";

Vue.use(Vuex)

export default new Vuex.Store(
    {
        state    : {
            //列表页用的跳转方法，想了想还是用 $parent 干脆一些
            gotoFunc: null,
            //
            paginatorDOM: null,
            //
            msgDOM: null,
            //
            popupDOM: null,
            //
            floatPusher: null,
        },
        mutations: {
            //
            pushFloat        : (state, payload) => {
            },
            registerPushFloat: (state, func) => {
                state.floatPusher = func;
            },
            // -------------------------------
            usePagination    : (state) => {
                // if (!state.paginatorDOM) return false;
                state.paginatorDOM.usePagination = true;
            },
            closePagination  : (state) => {
                // if (!state.paginatorDOM) return false;
                state.paginatorDOM.usePagination = false;
            },
            registerPaginator: (state, dom) => {
                console.info(`Store registerPaginator`);
                state.paginatorDOM = dom;
            },
            // -------------------------------
            /*goto             : (state, query) => {
             console.info(`Store goto`);
             if (!state.paginatorDOM) return false;
             //
             let routeData = Object.assign({path: '', query: {}}, query);
             router.push(routeData);
             },
             registerGoto     : (state, func) => {
             console.info(`Store registerGoto`);
             state.gotoFunc = func;
             },*/
            // -------------------------------
            pushMsg       : (state, payload) => {
                console.info('store pushMsg');
                if (!state.msgDOM) return false;
                state.msgDOM.push(payload.data, payload.type);
            },
            registerMsgDOM: (state, dom) => {
                console.info('store registerMsgDOM');
                state.msgDOM = dom;
            },
            // -------------------------------
            popup           : (state, payload) => {
                console.info('store popup');
                /**
                 * ----
                 * type:'form'
                 * info:{
                 *     title   : '',
                 *     data    : {name:value},
                 *     template: {
                 *          name        :{
                 *          type        :('text'|'datetime'|'textarea'|'checkbox'),
                 *          default     :'',
                 *          editable    :(true|false)
                 *          }
                 *     },
                 *     submit  : function ({name:value}) {},
                 *     cancel  : function () {},
                 *     error   : function () {},
                 * }
                 * ----
                 * type:'loader'
                 * info:null
                 * ----
                 * type:'confirm'
                 * info:{
                 *     data    : '',
                 *     submit  : function () {},
                 *     cancel  : function () {},
                 * }
                 * ----
                 * type:'uploader'
                 * info:{
                 *     dir_id  : '',
                 * }
                 * ----
                 * type:'file'
                 * info:{
                 *     currentId  : 0,
                 *     query      : function(){},
                 *     queryData  : {},
                 *     goto       : {},
                 * }
                 * ----
                 * type:'list'
                 * info:{
                 *     title  : '',
                 *     submit : function({id:0,title:'',type:'folder'},[id,id,id]){},
                 *     cancel : function(){},
                 * }
                 * ----
                 * type:'hide'
                 * info:null
                 * ----
                 * */
                if (!state.popupDOM) return false;
                state.popupDOM.show(payload);
            },
            registerPopupDOM: (state, dom) => {
                console.info('store registerPopupDOM');
                state.popupDOM = dom;
            },
        },
        actions  : {},
        modules  : {}
    })
