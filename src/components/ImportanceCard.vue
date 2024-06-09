<template>
    <img class="svg-logo" :src="require(`@/assets/${filename}`)" />
</template>

<script>
export default {
    name: 'ImportanceCard',
    props: ['importance'],
    computed: {
        filename: function () {
            return this.importance + 'x.svg';
        },
    },
};
</script>