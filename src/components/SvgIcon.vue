<template>
    <InlineSvg
        class="svg-logo"
        :src="require(`@/assets/${icon}.svg`)"/>
</template>

<script>
 import InlineSvg from 'vue-inline-svg';
 export default {
     props: ['icon'],
     components: {
         InlineSvg,
     }

 }
</script>
