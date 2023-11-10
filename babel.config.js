// module.exports = {
//     presets: ['@vue/cli-plugin-babel/preset'],
// };

module.exports = {
    presets: [
        [
            '@vue/app',
            {
                targets: { esmodules: true },
                polyfills: false,
            },
        ],
    ],
};
