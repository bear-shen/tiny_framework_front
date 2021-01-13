<template>
    <div id="footer">
        <!--            <div class="">-->
        <Msg/>
        <Paginator/>
        <!--            </div>-->
    </div>
</template>
<style lang="scss">
    #footer {
        display: flex;
        height: $headerHeight;
        line-height: $headerHeight;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: map_get($colors, bar_bk);
        z-index: $layoutIndex;
    }
    @media (max-width: $tabletWidth) {
        #footer {
        }
    }
    @media (max-width: $mobileWidth) {
        #footer {
        }
    }
</style>

<script>
    import Msg       from "../components/Msg";
    import Paginator from "../components/Paginator";

    /**
     * @var list
     * @var current
     * @var title
     * @var time
     * @var timer (internal)
     * */
    export default {
        name      : "Footer",
        // el     : '#header',
        components: {
            Msg      : Msg,
            Paginator: Paginator,
        },
        data      : function () {
            return {};
        },
        created   : function () {
        },
        methods   : {}
    }
</script>