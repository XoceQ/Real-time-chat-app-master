/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        });
        return config;
    },
    images: {
        domains: ['utfs.io']
/* usar para correr test cypress/component/file-upload.cy.tsx
        domains: ['utfs.io', 'dfstudio-d420.kxcdn.com']
*/

    }
}

module.exports = nextConfig
