const fs = require('fs');

const cssConfig = require('./KeywordsAndErrorConfigs/cssConfig.json');
const tsxConfig = require('./KeywordsAndErrorConfigs/tsxConfig.json');
const commonConfig = require('./KeywordsAndErrorConfigs/commonConfig.json');



const loadConfigs = (fileExtension)=>{
    // let keywords = [...commonConfig?.keywords];
    // let errors =  commonConfig?.errors;

    let keywords=[];
    let errors={};
    if(fileExtension === '.tsx'){
        keywords =  [...keywords, ...tsxConfig?.keywords];
        errors = {...errors, ...tsxConfig?.errors};
    }
    else{
        keywords =  [...keywords, ...cssConfig?.keywords];
        errors = {...errors, ...cssConfig?.errors};
    }
    return {keywords, errors};
}

const findMistakesInFile = (file, keywords, errors)=>{
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let corrections = [];
    lines.map((line, index) =>{
        line = line.trim();
        if(line){
            keywords.map((keyword)=>{   
                line.indexOf(keyword) !== -1 && corrections.push(`at line number ${index+1}, ${errors[keyword]}`);
            });
        }
         return corrections;
    });

    return corrections;

}

let args = process.argv.slice(2);
console.log('-------------------------------------------------------------------------------');
console.log('Initialising...');

// Check if there are enough arguments
if (args.length < 1  ) {
    console.error('Usage: node script.js <file1> <file2>');
    process.exit(1);
}
args.map((file)=>{
    const fileName = file.split('\\')[file.split('\\').length - 1];
    const fileExt = fileName.slice(fileName.indexOf('.'));
    const {keywords, errors} = loadConfigs(fileExt);
    if(fileExt === '.tsx' || fileExt === '.styles.ts'|| fileExt === '.style.ts' || fileExt === '.spec.ts'){
        console.log(`checking the ${fileExt} file ${fileName}...`);
        const corrections = findMistakesInFile(file, keywords, errors);
        if(corrections?.length > 0){
            console.log(`Found ${corrections?.length} mistakes`)
            console.error("list of mistakes :", corrections);
        }
        else{
            console.log("Great! the file looks fine ..!");
        }
    console.log('check completed');
    console.log('-------------------------------------------------------------------------------')
    }
    else{
        console.log(`checking the file ${fileName} ${fileExt}...`);
        console.error(`Apologies !, Currently we dont support this extension ${fileExt}`);
        process.exit(1);
    }
})

