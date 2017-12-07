const Path = require('path');
const ChildProcess = require('child_process');
const Promise = require('promise');

const loopCountMap = new WeakMap();
const frameDelayMap = new WeakMap();
const compressionMap = new WeakMap();

const COMPRESS_7ZIP = module.exports.COMPRESS_7ZIP = '7zip';
const COMPRESS_ZLIB = module.exports.COMPRESS_ZLIB= 'zlib';
const COMPRESS_ZOPFLI = module.exports.COMPRESS_ZOPFLI = 'zopfli';


class Assembler
{
    /**
     * Verify and format the assembly options that are available.
     *
     * @param {Number} [loopCount]
     * @param {Number} [frameDelay]
     * @param {String} [compression]
     */
    constructor(loopCount, frameDelay, compression)
    {
        // Set default properties.
        loopCountMap.set(this, 0);
        frameDelayMap.set(this, 100);
        compressionMap.set(this, COMPRESS_7ZIP);

        // Populate loop count.
        loopCount = parseInt(loopCount, 10);
        if (! isNaN(loopCount) && loopCount >= 0) {
            loopCountMap.set(this, loopCount);
        }

        // Populate the delay between frames.
        frameDelay = parseInt(frameDelay, 10);
        if (! isNaN(frameDelay) && frameDelay >= 1) {
            frameDelayMap.set(this, frameDelay);
        }

        // Populate the compression to use.
        switch(compression) {
            case COMPRESS_7ZIP:
            case COMPRESS_ZLIB:
            case COMPRESS_ZOPFLI:
                compressionMap.set(this, compression);
                break;

            default:
                // No action.
                break;
        }
    }

    /**
     * Synchronous assembly of an animated PNG from the given input file (or file glob), with it being written to the
     * specified output file.
     *
     * Throws an exception if the assembly failed.
     *
     * @param {String} inputFile
     * @param {String} outputFile
     * @throws {Error}
     */
    assembleSync(inputFile, outputFile)
    {
        try {
            ChildProcess.execSync(
                buildShellCommand(this, inputFile, outputFile).join(' ')
            );
        } catch (e) {
            throw wrapError(e);
        }
    }

    /**
     * Asynchronous assembly of an animated PNG from the given input file (or file glob), with it being written to the
     * specified output file.
     *
     * Returns a promise that is resolved if assembly was successful, and rejected if assembly failed.
     *
     * @param {String} inputFile
     * @param {String} outputFile
     * @return {Promise}
     */
    assemble(inputFile, outputFile)
    {
        return new Promise(
            (resolve, reject) => {
                ChildProcess.exec(
                    buildShellCommand(this, inputFile, outputFile).join(' '),
                    (error, stdout, stderr) => {
                        if (error) {
                            reject(
                                wrapError(
                                    error, stdout, stderr
                                )
                            );
                        } else {
                            resolve(outputFile);
                        }
                    }
                );
            }
        );
    }
}

// Export assembler.
module.exports.Assembler = Assembler;


/**
 * Wrap the given error, and ensure that the `message`, `stdout`, and `stderr` properties are populated.
 *
 * @param {Error} error
 * @param {Buffer} [stdout]
 * @param {Buffer} [stderr]
 *
 * @return {Error}
 */
function wrapError(error, stdout, stderr) {
    if (! error.stdout && stdout) {
        error.stdout = stdout;
    }

    if (! error.stderr && stderr) {
        error.stderr = stderr;
    }

    if (! error.message) {
        let stdout = error.stdout.toString();
        let errorRegex = /^Error:\s+(.*)$/m;

        if (errorRegex.test(stdout)) {
            error.message = stdout.match(errorRegex)[1];
        }
    }

    return error;
}


/**
 * Receives the encoder instance to build the command for, as well as the input and output file. Returns a string
 * containing the shell command to run.
 *
 * @param encoder
 * @param inputFile
 * @param outputFile
 * @return String[]
 */
function buildShellCommand(encoder, inputFile, outputFile) {
    let cmd = [
        Path.join(__dirname, '..', 'bin', 'apngasm-' + process.platform.toString().toLowerCase()),
        outputFile,
        inputFile,
        frameDelayMap.get(encoder) + ' 1000',
        '-l' + loopCountMap.get(encoder)
    ];

    switch (compressionMap.get(encoder)) {
        case COMPRESS_ZOPFLI:
            cmd.push('-z2');
            break;

        case COMPRESS_ZLIB:
            cmd.push('-z0');
            break;

        case COMPRESS_7ZIP:
            cmd.push('-z1');
            break;

        default:
            // No action.
            break;
    }

    return cmd;
}