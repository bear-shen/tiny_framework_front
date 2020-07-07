<template>
    <div :class="['fileDetail','fileDetail_'+detail.type]">
        <template v-if="!detail.type"></template>
        <template v-else-if="detail.type==='binary'"></template>
        <template v-else-if="detail.type==='folder'"></template>
        <template v-else-if="detail.type==='text'">
            <div class="ct_content">
            </div>
        </template>
        <template v-else-if="detail.type==='audio'">
            <div class="ct_content">
            </div>
        </template>
        <template v-else-if="detail.type==='video'">
            <div class="ct_content">
            </div>
        </template>
        <template v-else-if="detail.type==='image'">
            <div class="ct_content">
            </div>
        </template>
        <div class="ct_alpha">
            <span :class="['ct_icon','listIcon','listIcon_file_'+detail.type]"></span>
        </div>
        <div class="ct_title">{{detail.title}}</div>
        <div class="ct_description">{{detail.description}}</div>
        <div class="ct_type">{{detail.type}}</div>
        <div class="ct_size">{{detail.size}}</div>
        <div class="ct_hash">{{detail.hash}}</div>
        <div class="ct_time_create">{{detail.time_create}}</div>
        <div class="ct_time_update">{{detail.time_update}}</div>
        <div v-if="detail.tag.length" class="ct_tag">
            <dl v-for="group in detail.tag" :data-id="group.id">
                <dt>{{group.name}}:</dt>
                <dd v-for="tag in group.sub" :data-id="tag.id" class="btn btn-dark">{{tag.name}}</dd>
            </dl>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>

<script>
    export default {
        name : 'fileDetail',
        props: ['fileDetail'],
        data : function () {
            return {
                detail: this.fileDetail
            }
        }
    }
</script>
