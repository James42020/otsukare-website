const ORDER = [
    "kana",
    "kanji",
    "particles",
    "conjugations",
    "numbers & counters",
    "places",
    "time",
    "people",
    "this & that",
    "questions",
    "new"
]

const fs = require('fs');
const path = require('path');

function generateCode(number){
    if(number > 26**3-1){return -1}
    var base = 65
    var result =
        String.fromCharCode(base + (Math.floor(Math.floor(number / 26) / 26) % 26))+
        String.fromCharCode(base + (Math.floor(number / 26) % 26))+
        String.fromCharCode(base + (number % 26))
    return result
}

module.exports = function(){
    var dir = "./private/html/content"
    var filesDir = fs.readdirSync(dir)
    for(i=0;i<ORDER.length;i++){
        var code = generateCode(i)
        for(j=0;j<filesDir.length;j++){
            var search = path.basename(filesDir[j],".html").replace(/[A-Z]/g,"")
            if(ORDER[i] == search){
                fs.rename(
                    `${dir}/${filesDir[j]}`,
                    `${dir}/${code}${search}.html`,
                    (err) => {}
                )
            }
        }
    }
}