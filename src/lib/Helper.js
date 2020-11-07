import config from "../config";

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
    query      : function (api, data) {
        return new Promise(((resolve, reject) => {
            let targetUrl              = config.api(api);
            let xmlHttp                = new XMLHttpRequest();
            xmlHttp.withCredentials    = true;
            xmlHttp.open('POST', targetUrl, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState !== 4 /*&& xmlhttp.status < 400*/) return ;
                // console.warn(xmlHttp.responseText);
                if (xmlHttp.status > 400) return reject(xmlHttp.responseText);

                let targetData = JSON.parse(xmlHttp.responseText);
                if (!targetData) return reject(xmlHttp.responseText);
                return resolve(targetData);
            };
            xmlHttp.send(JSON.stringify(data?data:{}));
        }));
    }
};
export {Helper as default};