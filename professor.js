const fs = require('fs');
const cssErrorMap = new Map([['px','px value found, use rem instead. 1 px = 0.0625 rem do the math !'],
['!','!important found, try not to use override'],
['#','hex code is found, use color from themes'],
['?','optional chaining can be added, please re-check']
]);

let corrections = new Set();

const addLog = (type, index)=>{
    corrections.add(`at line number ${index}, ${cssErrorMap.get(type)}`);
};

function findMistakesInStylesFile(File) {
    // Parse CSS files
        const content = fs.readFileSync(File, 'utf-8');
        const lines = content.split('\n');
        lines.map((line, index) =>{
            if(line.match(/\$/)){
                const subLine = line.substring(line.indexOf('{'), line.indexOf('}'));
                const operatorIndex = [subLine.indexOf('?'),subLine.indexOf('.'),subLine.lastIndexOf('?'),subLine.lastIndexOf('.')];
                if((operatorIndex[0] !== (operatorIndex[1]-1))||(operatorIndex[2] !== (operatorIndex[3]-1))){
                    addLog('?',index+1);
                }
            } 
            line.match(/px/) && addLog('px',index+1);
            line.match(/!important/) && addLog('!',index+1);
            line.match(/#/) && addLog('#',index+1);
        });

    // Generate report
    let report = {
        corrections: [...corrections],
    };

    return report;
}



// Get command-line arguments excluding the first two elements (node executable and script path)
const args = process.argv.slice(1);

// Check if there are enough arguments
if (args.length !== 2  ) {
    console.error('Usage: node script.js <file1>');
    process.exit(1);
}

// Separate CSS and TSX files based on file extension
if (args[1].endsWith('styles.ts')){
    console.log(`checking the style file ${args[1]} ...`);
    const result = findMistakesInStylesFile(args[1]);
    console.error("Found below mistakes :", result.corrections);
}
else if(args[1].endsWith('spec.ts')){
    console.log(`checking the tests in file ${args[1]} ...`);
}
else if(args[1].endsWith('.tsx')){
    console.log(`checking the Component file ${args[1]} ...`);
    // const result = findMistakesInComponentFile(args[1]);
    // console.error("Found below mistakes :", result.corrections);
}
else{
    console.error('Apologies !, Currently we dont support this extension');
    process.exit(1);
}
