module.exports = {
    messageRegex: {
        echo: /\/echo (.+)/,
        iv: /\/iv (\w+) ((cp:)?(\d+)) ((hp:)?(\d+)) ((s:)?(\d+))? ((c:)?(\d+))/,
        teams: /Instinct|Valor|Mystic/,
        start: /\/start/,
        support: /\/support/
    },
    debug: false
};