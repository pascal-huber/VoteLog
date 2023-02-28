<template>
    <InlineSvg class="svg-logo" :src="require(`@/assets/${icon}.svg`)" />
</template>

<script>
import InlineSvg from 'vue-inline-svg';
export default {
    components: {
        InlineSvg,
    },
    props: ['icon'],
};
</script>
