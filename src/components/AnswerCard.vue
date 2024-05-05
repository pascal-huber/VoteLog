<template>
    <img class="svg-logo" :src="require(`@/assets/${filename}`)" />
</template>

<script>
import { Answer } from '@/Answer.js';
export default {
    name: 'AnswerCard',
    props: ['answer'],
    // TODO: add question mark
    computed: {
        filename: function () {
            const filename = Object.keys(Answer)
                .find((key) => Answer[key] == this.answer)
                .toLowerCase();
            return filename + '.svg';
        },
    },
};
</script>