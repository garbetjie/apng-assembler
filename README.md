APNG Assembler
--------------

Simple wrapper around the excellent [APNG Assembler](https://sourceforge.net/projects/apngasm) command line binary.


## Usage

```js
const Assembler = require('apng-assembler');

// Assemble file asynchronously.
Assembler.assemble(
    'input*.png',
    'output.png',
    {
        loopCount: 0,
        frameDelay: 100,
        compression: Assembler.COMPRESS_7ZIP
    }
).then(
    function(outputFile) {
        console.log(`${outputFile} has been assembled successfully.`);
    },
    function(error) {
        console.error(`Failed to assemble: ${error.message}`);
        console.error(`stdout: ${error.stdout}`);
        console.error(`stderr: ${error.stderr}`);
    }
);

// Assemble file synchronously.
try {
    Assembler.assembleSync(
        'input*.png',
        'output.png',
        {
            loopCount: 0,
            frameDelay: 100,
            compression: Assembler.COMPRESS_7ZIP
        }
    );
} catch (e) {
    console.error(`Failed to assemble: ${error.message}`);
    console.error(`stdout: ${error.stdout}`);
    console.error(`stderr: ${error.stderr}`);
}

// Pass an instance of the assembler around.
let assembler = new Assembler.Assembler(loopCount, frameDelay, compression);
assembler.assemble('input*.png', 'output.png');
assembler.assembleSync('input*.png', 'output.png');
```


## Credits

* [APNG Assembler](https://sourceforge.net/projects/apngasm) by Max Stepin.