<template>
    <div id="popup" v-if="isShow" :style="{opacity:isTransparent?0:1}">
        <template v-if="type==='form'">
            <popup-form v-bind:info="popupInfo"></popup-form>
        </template>
        <template v-else-if="type==='loader'">
            <popup-loader></popup-loader>
        </template>
        <template v-else-if="type==='confirm'">
            <popup-confirm v-bind:info="popupInfo"></popup-confirm>
        </template>
        <template v-else-if="type==='uploader'">
            <popup-uploader v-bind:info="popupInfo"></popup-uploader>
        </template>
        <template v-else-if="type==='file'">
            <popup-file-detail v-bind:info="popupInfo"></popup-file-detail>
        </template>
        <template v-else-if="type==='list'">
            <popup-file-list v-bind:info="popupInfo"></popup-file-list>
        </template>
        <template v-else-if="type==='login'">
            <popup-login v-bind:info="popupInfo"></popup-login>
        </template>
        <template v-else-if="type==='version'">
            <popup-file-version v-bind:info="popupInfo"></popup-file-version>
        </template>
        <template v-else-if="type==='register'">
            <popup-register v-bind:info="popupInfo"></popup-register>
        </template>
    </div>
</template>

<style lang="scss">
    //和loader相似但是多少有些区别，因此单独写
    #popup {
        //background-color: rgba(0, 0, 0, 0.25);
        width: 100vw;
        height: calc(100vh - #{$headerHeight});
        position: fixed;
        top: $headerHeight;
        z-index: $alphaIndex;
        background-image: url(../assets/bg.png);
        backdrop-filter: blur(2px);
        opacity: 0;
        &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media(max-width: $mobileWidth) {
        #popup {
            top: 0;
            height: 100vh;
        }
    }
</style>

<script>
    import PopupLoader      from "./popup/Loader";
    import PopupForm        from "./popup/Form";
    import PopupConfirm     from "./popup/Confirm";
    import PopupUploader    from "./popup/Uploader";
    import PopupFileDetail  from "./popup/FileDetail";
    import PopupFileList    from "./popup/FileList";
    import PopupLogin       from "./popup/Login";
    import PopupFileVersion from "./popup/FileVersion";
    import PopupRegister    from "./popup/Register";

    /**
     * @var isShow          (internal)
     * @var isTransparent   (internal)
     * @var data            (internal)
     * @var callback        (internal)
     * @method show     (data, template, success, cancel, error)
     * @method hide     ()
     * @method reset    ()
     * @method submit   ()
     *
     * show -> data {name:value}
     * show -> template {name:{type:('text'|'datetime'),default:'',editable:(true|false)}}
     * */
    export default {
        name      : "Popup",
        components: {PopupRegister, PopupFileVersion, PopupLogin, PopupFileList, PopupFileDetail, PopupUploader, PopupConfirm, PopupForm, PopupLoader},
        // el     : '#popup',
        watch     : {},
        data      : function () {
            return {
                type         : 'form',
                popupInfo    : {},
                //
                isShow       : false,
                isTransparent: false,
            }
        },
        created   : function () {
            console.info(this);
            this.$store.commit('registerPopupDOM', this)
        },
        methods   : {
            show : function (data) {
                if (data.type === 'hide') {
                    this.hide();
                    return;
                }
                this.type      = data.type;
                this.popupInfo = data.info ? data.info : {};
                this.isShow    = true;
                //做个延迟不然特效不会出来……
                setTimeout(() => {
                    this.isTransparent = false;
                }, 10);
            },
            hide : function () {
                //清空数据
                this.type          = '';
                this.popupInfo     = {};
                this.isTransparent = true;
                setTimeout(() => {
                    this.isShow = false;
                }, 500);
            },
            empty: function () {
            },
        }
    }
</script>