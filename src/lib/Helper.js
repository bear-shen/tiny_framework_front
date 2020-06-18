const Helper = {
    isSameRoute:function (from,to) {
        let modified = false;
        if (to.name !== from.name) modified = true;
        for (let k in from.params) {
            if (k === 'page') continue;
            if (to.params[k] !== from.params[k]) {
                modified = true;
                break;
            }
        }
        for (let k in to.params) {
            if (k === 'page') continue;
            if (to.params[k] !== from.params[k]) {
                modified = true;
                break;
            }
        }
        return !modified;
    },
};
export {Helper as default};