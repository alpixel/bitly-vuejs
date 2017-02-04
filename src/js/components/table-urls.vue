<template>
	<table>
        <thead>
            <tr>
                <th>#</th>
                <th>Long URL</th>
                <th>Shorten URL</th>
                <th></th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>#</th>
                <th>Long URL</th>
                <th>Shorten URL</th>
                <th></th>
            </tr>
        </tfoot>
        <tbody>
            <tr v-for="(url,index) in taburl">
                <td>
                    {{url.uid}}
                </td>
                <td>
                    <span>{{url.url}}</span>
                </td>
                <td>
                    <a :href="url.shortenUrl" target="_blank">{{url.shortenUrl}}</a>
                </td>
                <td>
                    <button class="cc-bg-red cc-thin" @click.prevent="deleteUrl(index)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>


<script>
    export default {
        props : {
            taburl : Array
        },
        methods: {
            // Delete an url
            deleteUrl : function(index) {
                this.$emit('deleteUrl',index);
            }
        }
    }
</script>