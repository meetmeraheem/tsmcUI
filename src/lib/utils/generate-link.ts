export function generateLink(template: string, params: { [key: string]: string | number }) {
    let formattedString = template;
    const matches = formattedString.match(/:[a-zA-Z0-9]*/g);
    if (matches) {
        matches.forEach((i: string) => {
            const variable = i.replace(/:/g, '');
            const matchData = params[variable];
            formattedString = formattedString.replace(i, matchData.toString());
        });
    }
    return formattedString;
}
