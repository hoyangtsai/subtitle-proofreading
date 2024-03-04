const path = require('path')
const fs = require('fs-extra')

// const filename = 'test.txt'
const filename = 'BeautifulDuckling_Sample_20240119.txt'
const outputFile = 'output.txt'

const content = fs.readFileSync(path.join(__dirname, filename), 'utf8')

const endingSymbols = ['.', '!', '?', ')']
const startingSymbols = ['(']

// test a segment is english or chinese
const isEnglish = (str) => {
  if (!str) return false
  if (startingSymbols.some(s => str.startsWith(s))) {
    return isEnglish(str.slice(1))
  }
  return (str.charCodeAt(0) >= 'a'.charCodeAt() && str.charCodeAt(0) <= 'z'.charCodeAt()) || (str.charCodeAt(0) >= 'A'.charCodeAt() && str.charCodeAt(0) <= 'Z'.charCodeAt())
}

let outputStr = '';
let english = ''
let chinese = ''
let time = ''
let startLineCount = 1;
let endLineCount = 1;
content.split('\n').forEach((line, index) => {
  if (line) {
    const matches = line.match(/(\d{2}:\d{2}:\d{2}:\d{2}\s\d{2}:\d{2}:\d{2}:\d{2}\s+)(.*)/);
    // console.log('matches =>', matches);
    
    if (matches) {
      time = time ? time + '\n' + matches[1] : matches[1];
      const seg = matches[2].split('\\\\')

      seg.forEach(s => {
        if (isEnglish(s)) {
          english = english ? english + '\n' + s : s;
        } else {
          chinese = chinese ? chinese + '\n' + s : s;
        }
      })

      if (endingSymbols.some(s => english.endsWith(s))) {
        // console.log('line :>> ', `${startLineCount} - ${endLineCount}`);
        outputStr += time + '\n'
        outputStr += chinese.split('\n').join('') + '\n'
        outputStr += english.split('\n').join(' ') + '\n'
        outputStr += '\n'

        english = '';
        chinese = '';
        time = '';
      }
    }
  }
  endLineCount ++;
})

fs.outputFileSync(outputFile, outputStr)
