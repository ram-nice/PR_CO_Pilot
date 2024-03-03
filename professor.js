const fs = require('fs');

const cssConfig = require('./KeywordsAndErrorConfigs/cssConfig.json');
const tsxConfig = require('./KeywordsAndErrorConfigs/tsxConfig.json');
const commonConfig = require('./KeywordsAndErrorConfigs/commonConfig.json');

let corrections = new Set();

const addLog = (checkType, index, fileType)=>{
    if(fileType === 'css'){
        corrections.add(`at line number ${index}, ${cssConfig[checkType]}`);
    }
    else if(fileType === 'tsx'){
        corrections.add(`at line number ${index}, ${tsxConfig[checkType]}`);
    }
    else if(fileType === 'common'){
        corrections.add(`at line number ${index}, ${commonConfig[checkType]}`);
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


let args = process.argv.slice(2);
const content = fs.readFileSync(args[1], 'utf-8');
console.log('-------------------------------------------------------------------------------');
console.log('Initialising...');

// Check if there are enough arguments
if (args.length < 2  ) {
    console.error('Usage: node script.js <file1> <file2>');
    process.exit(1);
}

args = args.slice(1);

args.map((file)=>{
    const fileName = file.split('\\')[file.split('\\').length - 1];
    const fileExt = fileName.slice(fileName.indexOf('.'));
   // loadConfigs(fileName,fileExt);
    if (file.endsWith('styles.ts')){
        console.log(`checking the style file ${fileName} ${fileExt}...`);
        const result = findMistakesInStylesFile(content);
        displayResults(result.corrections);
    }
    else if(file.endsWith('spec.ts')){
        console.log(`checking the tests in file ${file} ...`);
    }
    else if(file.endsWith('.tsx')){
        console.log(`checking the Component file ${file} ${fileExt}...`);
        const result = findMistakesInComponentFile(file);
        displayResults(result.corrections);
    }
    else{
        console.log(`checking the file ${fileName} ${fileExt}...`);
        console.error('Apologies !, Currently we dont support this extension');
        process.exit(1);
    }
})

