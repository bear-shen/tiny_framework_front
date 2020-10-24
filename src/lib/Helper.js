const Helper = {
    /**
     * @param from Object
     * @param to Object
     * format {path:'',query:{'param':''}}
     * @see https://www.cnblogs.com/oulae/p/10777117.html
     * */
    isSameRoute: function (from, to) {
        let modified = false;
        if (to.path !== from.path) modified = true;
        //
        console.info(from.query);
        console.info(to.query);
        let fromNames = Object.getOwnPropertyNames(from.query);
        let toNames   = Object.getOwnPropertyNames(to.query);
        //
        if (fromNames.length !== toNames.length) modified = true;
        if (!modified) {
            for (let i1 = 0; i1 < fromNames.length; i1++) {
                //这边不使用全等符号，因为参数类型经常有问题
                if (from.query[fromNames[i1]] == to.query[fromNames[i1]]) continue;
                modified = true;
                break;
            }
        }
        return !modified;
    },
    query:function (path,data) {

    }
};
export {Helper as default};