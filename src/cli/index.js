#!/usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
const AssembleCommand = require('./assemble');

// Create the root parser.
let parser = new ArgumentParser({
    version: require('../../package.json').version,
    addHelp: true,
    description: 'Animated PNG CLI',
});

// Create the sub-parser.
let subParser = parser.addSubparsers({
    title: 'Commands',
    dest: 'command'
});

// Add parsers for sub-commands.
let commands = [
    AssembleCommand(subParser)
];


// Parse out arguments.
let parsed = parser.parseArgs();
let executed = false;

try {
    commands.forEach(
        function (commandTuple) {
            if (executed || commandTuple.length < 2 || typeof commandTuple[1] !== 'function') {
                return;
            }

            if (commandTuple[0] === parsed.command) {
                commandTuple[1](parsed);
                executed = true;
            }
        }
    );
} catch (e) {
    console.error('An error occurred:\n');
    console.error(e.message || e);
}