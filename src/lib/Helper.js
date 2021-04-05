import config from "../config";
import store  from "../store";

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
    query      : function (api, data, extra) {
        return new Promise(((resolve, reject) => {
            let targetUrl           = config.api(api);
            let xmlHttp             = new XMLHttpRequest();
            xmlHttp.withCredentials = true;
            if (extra && extra.progress) {
                xmlHttp.addEventListener("progress", extra.progress)
            }
            xmlHttp.open('POST', targetUrl, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState !== 4 /*&& xmlhttp.status < 400*/) return;
                // console.warn(xmlHttp.responseText);
                if (xmlHttp.status > 400) return reject(xmlHttp.responseText);

                let targetData = JSON.parse(xmlHttp.responseText);
                if (!targetData) return reject(xmlHttp.responseText);
                if (targetData.code === 401) {
                    store.commit(
                        'popup',
                        {type: 'login',}
                    );
                    reject();
                } else if (targetData.code != 0) {
                    store.commit(
                        'pushMsg',
                        {type: 'error', data: `${targetData.code}:${targetData.msg}`,}
                    );
                    reject();
                }
                return resolve(targetData.data ? targetData.data : null);
            };
            // 要传文件还是得formdata，json不能用，
            // 虽然也可以base64再说，不过大文件总归不好
            let formData = new FormData();
            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    formData.append(k, data[k]);
                }
            }
            // xmlHttp.send(JSON.stringify(data ? data : {}));
            xmlHttp.send(formData);
        }));
    }
};
export {Helper as default};