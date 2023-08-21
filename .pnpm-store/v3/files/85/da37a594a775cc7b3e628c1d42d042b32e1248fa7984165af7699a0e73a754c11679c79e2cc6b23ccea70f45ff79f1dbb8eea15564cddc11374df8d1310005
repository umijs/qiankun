"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const utils_2 = require("../utils");
exports.default = (api) => {
    api.registerCommand({
        name: 'help',
        alias: 'h',
        description: 'show father usage',
        configResolveMode: 'loose',
        fn() {
            const subCommand = api.args._[0];
            if (subCommand) {
                if (subCommand in api.service.commands) {
                    showHelp(api.service.commands[subCommand]);
                }
                else {
                    utils_2.logger.error(`Invalid sub command ${subCommand}.`);
                }
            }
            else {
                showHelps(api.service.commands);
            }
        },
    });
};
function showHelp(command) {
    console.log([
        `\nUsage: father ${command.name}${command.options ? ` [options]` : ''}`,
        command.description ? `\n${utils_1.chalk.gray(command.description)}.` : '',
        command.options ? `\n\nOptions:\n${padLeft(command.options)}` : '',
        command.details ? `\n\nDetails:\n${padLeft(command.details)}` : '',
    ].join(''));
}
function showHelps(commands) {
    console.log(`
Usage: father <command> [options]

Commands:
${getDeps(commands)}
`);
    console.log(`Run \`${utils_1.chalk.bold('father help <command>')}\` for more information of specific commands.`);
    console.log(`Visit ${utils_1.chalk.bold('https://github.com/umijs/father')} to learn more about father.`);
}
function getDeps(commands) {
    return Object.keys(commands)
        .map((key) => {
        return `    ${utils_1.chalk.green(utils_1.lodash.padEnd(key, 10))}${commands[key].description || ''}`;
    })
        .join('\n');
}
function padLeft(str) {
    return str
        .trim()
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n');
}
