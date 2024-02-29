const fs = require('fs');

const cssErrorObj = {
    'px':'px value found, use rem instead. 1 px = 0.0625 rem do the math !',
    '!important':'!important found, try not to use override',   
    '#':'hex code is found, use color from themes'   
};

const tsxErrorObj = {
    'any':'key word any found, try to use proper type or create an interface',
    '"':'double quotes have been found, we use single quotes across the project',
    'px':'inline styles have been found, consider moving styles to the style file, all the styles must come from styles file',
    'console':'please remove console messages',         
}

const commonErrorObj ={
    '?':'optional chaining can be added, please re-check'
}

let corrections = new Set();

const addLog = (checkType, index, fileType)=>{
    if(fileType === 'css'){
        corrections.add(`at line number ${index}, ${cssErrorObj[checkType]}`);
    }
    else if(fileType === 'tsx'){
        corrections.add(`at line number ${index}, ${tsxErrorObj[checkType]}`);
    }
    else if(fileType === 'common'){
        corrections.add(`at line number ${index}, ${commonErrorObj[checkType]}`);
    }
};

const checkInLine = (keyword, line, index, checkType)=>{
    line.match(new RegExp(keyword)) && addLog(keyword,index+1,checkType);
}
function findMistakesInStylesFile(fileContent) {
    // Parse CSS files
        const lines = fileContent.split('\n');
        lines.map((line, index) =>{
            line=line.trim();
            if(line.match(/\$/)){
                const subLine = line.substring(line.indexOf('{'), line.indexOf('}'));
                const operatorIndex = [subLine.indexOf('?'),subLine.indexOf('.'),subLine.lastIndexOf('?'),subLine.lastIndexOf('.')];
                if((operatorIndex[0] !== (operatorIndex[1]-1))||(operatorIndex[2] !== (operatorIndex[3]-1))){
                    addLog('?',index+1, 'common');
                }
            };
            checkInLine('px',line, index,'css');
            checkInLine('!important',line, index, 'css');
            checkInLine('#',line, index, 'css');
        });

    // Generate report
    let report = {
        corrections: [...corrections],
    };

    return report;
}

const findMistakesInComponentFile=(File)=> {
    // Parse Component files
        const content = fs.readFileSync(File, 'utf-8');
        const lines = content.split('\n');

        lines.map((line, index) =>{
            checkInLine('any', line, index, 'tsx');
            checkInLine('"', line, index, 'tsx');
            checkInLine('console', line, index,'tsx');
        });

    // Generate report
    let report = {
        corrections: [...corrections],
    };

    return report;
}
const displayResults=(corrections)=> {
    if(corrections?.length > 0){
        console.error("Found below mistakes :", corrections);
    }
    else{
        console.log("Great! the file looks fine ..!");
    }
console.log('check completed');
console.log('-------------------------------------------------------------------------------')
}
// Get command-line arguments excluding the first two elements (node executable and script path)
const args = process.argv.slice(1);
const content = fs.readFileSync(args[1], 'utf-8');
console.log('-------------------------------------------------------------------------------');
console.log('Initialising...');
// Check if there are enough arguments
if (args.length < 2  ) {
    console.error('Usage: node script.js <file1> <file2>');
    process.exit(1);
}

// Separate CSS and TSX files based on file extension
if (args[1].endsWith('styles.ts')){
    console.log(`checking the style file ${args[1]} ...`);
    const result = findMistakesInStylesFile(content);
    displayResults(result.corrections);
}
else if(args[1].endsWith('spec.ts')){
    console.log(`checking the tests in file ${args[1]} ...`);
}
else if(args[1].endsWith('.tsx')){
    console.log(`checking the Component file ${args[1]} ...`);
    const result = findMistakesInComponentFile(args[1]);
    displayResults(result.corrections);
}
else{
    console.error('Apologies !, Currently we dont support this extension');
    process.exit(1);
}
