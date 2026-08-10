export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove non-word characters
        .replace(/\s+/g, "-"); // replace spaces with -
};
//# sourceMappingURL=generateSlug.js.map