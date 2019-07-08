const fs = require('fs')

let rawdata = fs.readFileSync('motifs.json')
let motifs = JSON.parse(rawdata)

let newMotifs = motifs.map(m => {
  let obj = m
  obj.parsedWords = m.name.split(' ').map(w => ({
    word: w,
    selected: true,
  }))
  return m
})
console.log(newMotifs[0])
console.log(motifs[0])
