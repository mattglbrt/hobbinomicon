//Any files that are not part of the template languages that you want to be present on the site will need to have a Pass Through Copy - that goes for images, local fonts, icons etc

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/css/style.css");
    eleventyConfig.addPassthroughCopy("src/assets/images");
    return {
        dir: {
            input: "src",
            data: "_data",
            includes: "_includes",
            layouts: "_layouts",
        },
    };
};
