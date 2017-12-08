const AssemblerModule = require('./assembler');

// Export the assembler.
module.exports.Assembler = AssemblerModule.Assembler;
module.exports.COMPRESS_7ZIP = AssemblerModule.COMPRESS_7ZIP;
module.exports.COMPRESS_ZOPFLI = AssemblerModule.COMPRESS_ZOPFLI;
module.exports.COMPRESS_ZLIB = AssemblerModule.COMPRESS_ZLIB;


/**
 * Assemble the given input files into an animated PNG synchronously.
 *
 * @param {String} inputFiles
 * @param {String} outputFile
 * @param {Object} [options]
 */
module.exports.assembleSync = function (inputFiles, outputFile /*, options*/) {
    let options = arguments[2] || {};
    let assembler = new AssemblerModule.Assembler(options.loopCount, options.frameDelay, options.compression);

    assembler.assembleSync(inputFiles, outputFile);
};


/**
 * Assemble the given input files into an animated PNG asynchronously. Returns a Promise that is resolved when complete.
 *
 * @param inputFiles
 * @param outputFile
 * @return {Promise}
 */
module.exports.assemble = function (inputFiles, outputFile /*, options */) {
    let options = arguments[2] || {};
    let assembler = new AssemblerModule.Assembler(options.loopCount, options.frameDelay, options.compression);

    return assembler.assemble(inputFiles, outputFile);
};