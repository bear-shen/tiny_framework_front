const Helper = {
    /**
     * @param from Object
     * @param to Object
     * format {path:'',query:{'param':''}}
     * */
    isSameRoute:function (from,to) {
        let modified = false;
        if (to.path !== from.path) modified = true;
        for (let k in from.query) {
            if (k === 'page') continue;
            if (to.query[k] !== from.query[k]) {
                modified = true;
                break;
            }
        }
        for (let k in to.query) {
            if (k === 'page') continue;
            if (to.query[k] !== from.query[k]) {
                modified = true;
                break;
            }
        }
        return !modified;
    },
};
export {Helper as default};