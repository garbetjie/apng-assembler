#!/usr/bin/env node

const Assembler = require('../assembler');

/**
 * Configure the subParser for this command, and return a tuple that provides the command's name, as well as the function
 * to exucute.
 *
 * @param subParser
 * @return {[]}
 */
module.exports = function(subParser) {
    let command = 'assemble';
    let parser = subParser.addParser(command);

    // Add positional arguments.
    parser.addArgument(
        'input',
        {
            action: 'store',
            help: 'Input file glob to convert into an animated PNG.'
        }
    );

    parser.addArgument(
        'output',
        {
            action: 'store',
            help: 'File to which to save the animated PNG.'
        }
    );

    // Add optional flags.
    parser.addArgument(
        ['-l'],
        {
            action: 'store',
            help: 'Number of loops to animate for. Default: 0 (loop forever).',
            metavar: '<int>',
            defaultValue: 0,
            type: function(val) {
                val = parseInt(val);
                return val && val >= 0 ? val : 0;
            },
        }
    );

    parser.addArgument(
        ['-c'],
        {
            action: 'store',
            metavar: '<string>',
            choices: [Assembler.COMPRESS_ZLIB, Assembler.COMPRESS_ZOPFLI, Assembler.COMPRESS_7ZIP],
            defaultValue: Assembler.COMPRESS_7ZIP,
            help: 'The type of compression to use. Default: ' + Assembler.COMPRESS_7ZIP,
        }
    );

    parser.addArgument(
        ['-d'],
        {
            action: 'store',
            defaultValue: 100,
            metavar: '<int>',
            help: 'The duration of each frame (in milliseconds). Default: 100',
            type: function(val) {
                val = parseInt(val);
                return val && val > 0 ? val : 100;
            }
        }
    );

    return [command, execute];
};

/**
 * Execute the assembly of the input. Receives an object containing the command line paraeters as specified in the
 * module.exports() function.
 *
 * @param params
 */
function execute (params) {
    let exporter = new Assembler.Assembler(params.loops, params.delay, params.compression);

    exporter.assembleSync(params.input, params.output);

    console.log(`${params.output} assembled successfully.`);
}