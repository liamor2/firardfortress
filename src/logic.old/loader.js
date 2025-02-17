async function loadTemplate(path) {
    const response = await fetch(path);
    const text = await response.text();
    return Handlebars.compile(text);
}

export {
    loadTemplate
}