
var JapaneseVoice = null
function setVoice(){
    var voices = window.speechSynthesis.getVoices();
    console.log(voices)
    for(i=0;i<voices.length;i++){
        if(voices[i].name == "Google 日本語"){ //"Google 日本語"
            JapaneseVoice = voices[i]
            return
        }
    }
    if(!JapaneseVoice){
        JapaneseVoice = null
    }
}
setVoice()
speechSynthesis.addEventListener("voiceschanged", setVoice)

function tts(){
    if(this.className!=""){return}
    window.speechSynthesis.cancel()
    const synth = new SpeechSynthesisUtterance()
    synth.lang = 'ja-JP';
    try{if(JapaneseVoice.name == "Google 日本語"){ synth.voice = JapaneseVoice }}catch{}
    synth.text = this.innerText.replace(/[a-zA-Z]/g,"")
    window.speechSynthesis.speak(synth)
    console.log('voice:', synth.voice);
    console.log('lang:', synth.lang);
    console.log('text:', synth.text);
    console.log('japaneseVoice variable:', JapaneseVoice);
}

// speechSynthesis.addEventListener('voiceschanged', () => {
//     const voices = speechSynthesis.getVoices();
//     console.log('Total voices:', voices.length);
//     voices.forEach(v => console.log(v.name, v.lang, v.localService));
// });

function safeAppend(item1,item2){
    try{item1.appendChild(item2)}catch{}
}

function createTable(filename, hiraganaElem, katakanaElem, inputVowels, inputConsonants){
    fetch(`../json/${filename}.json`)
    .then(response=>{return response.json()})
    .then(function(data){
        var rows = Object.keys(data)
        var hiraTable = hiraganaElem 
        var kataTable = katakanaElem
        inputVowels.unshift("")
        const vowels = inputVowels
        const consonants = inputConsonants
        var titleRow = document.createElement("tr")
        for(i=0;i<vowels.length;i++){
            var titleitem = document.createElement("td")
            titleitem.className += "title title-row"
            if(vowels[i]!=""){titleitem.innerText=`/${vowels[i]}/`}
            titleRow.appendChild(titleitem)
        }
        safeAppend(hiraganaElem,titleRow)
        safeAppend(katakanaElem,titleRow.cloneNode(true))
        for(i=0;i<rows.length;i++){
            var kana = Object.keys(data[rows[i]])
            var romaji = Object.values(data[rows[i]])
            var hiraRow = document.createElement("tr")
            var kataRow = document.createElement("tr")
            var rowTitle = document.createElement("td")
            if(consonants[i]!=""&&!/[\u30A0-\u30FF\u31F0-\u31FF∅]+/g.test(consonants[i]))
                {rowTitle.innerText=`/${consonants[i]}/`}
            else
                {rowTitle.innerText=consonants[i]}
            rowTitle.className += "title title-row"
            if(rowTitle.innerText == "/N/"){
                hiraRow.className += "active "
                kataRow.className += "active "
            }
            hiraRow.appendChild(rowTitle)
            kataRow.appendChild(rowTitle.cloneNode(true))
            for(j=0;j<kana.length;j++){
                var kanaArray = kana[j].split("・")
                var defaultItem = document.createElement("td")
                defaultItem.style.cursor = "help"
                var innerObject = document.createElement("span")
                innerObject.setAttribute("data-toggle","tooltip")
                innerObject.setAttribute("data-placement","top")
                innerObject.setAttribute("title",romaji[j])
                var hiraItem = defaultItem.cloneNode(true)
                var kataItem = defaultItem.cloneNode(true)
                defaultItem.onclick = tts
                hiraItem.onclick = tts
                kataItem.onclick = tts
                var infoArray = ["ゐ","ゑ","ヰ","ヱ"]
                if(kanaArray[0].includes("-")){
                    innerObjectC = innerObject.cloneNode(true)
                    innerObjectC.innerText = "\uFFFF"
                    $(innerObjectC).tooltip()
                    safeAppend(defaultItem,innerObjectC)
                    defaultItem.className = "info"
                    defaultItem.style.cursor = "default"
                    safeAppend(hiraRow,defaultItem)
                    safeAppend(kataRow,defaultItem.cloneNode(true))
                } else if (kanaArray[0].includes("_")){
                    defaultItem.innerText = ""
                    defaultItem.style.cursor = "default"
                    safeAppend(hiraRow,defaultItem)
                    safeAppend(kataRow,defaultItem.cloneNode(true))
                } else if (infoArray.includes(kanaArray[0])){
                    innerObject1 = innerObject.cloneNode(true)
                    innerObject1.innerText = kanaArray[0]
                    $(innerObject1).tooltip()
                    safeAppend(hiraItem,innerObject1)
                    hiraItem.className += "info"
                    hiraItem.style.cursor = "default"
                    safeAppend(hiraRow,hiraItem)

                    innerObject2 = innerObject.cloneNode(true)
                    innerObject2.innerText = kanaArray[1]
                    $(innerObject2).tooltip()
                    safeAppend(kataItem,innerObject2)
                    kataItem.className += "info"
                    kataItem.style.cursor = "default"
                    safeAppend(kataRow,kataItem)
                }
                else {
                    innerObject1 = innerObject.cloneNode(true)
                    innerObject1.innerText = kanaArray[0]
                    $(innerObject1).tooltip()
                    safeAppend(hiraItem,innerObject1)
                    safeAppend(hiraRow,hiraItem)
                    

                    innerObject2 = innerObject.cloneNode(true)
                    innerObject2.innerText = kanaArray[1]
                    $(innerObject2).tooltip()
                    safeAppend(kataItem,innerObject2)
                    safeAppend(kataRow,kataItem)
                }
            }
            safeAppend(hiraTable,hiraRow)
            safeAppend(kataTable,kataRow)
        }
    })
}

    

document.addEventListener("DOMContentLoaded",function(){
    
    createTable(
        "kana",
        document.getElementById("hiragana-default"),
        document.getElementById("katakana-default"),
        ["a","i","u","e","o"],
        ["∅","k","s","t","n","h","m","y","r","w","N"]
    )
    createTable(
        "dakuon",
        document.getElementById("hiragana-dakuon"),
        document.getElementById("katakana-dakuon"),
        ["a","i","u","e","o"],
        ["g","z","d","b","p"]
    )
    createTable(
        "yoon",
        document.getElementById("hiragana-yoon"),
        document.getElementById("katakana-yoon"),
        ["ya","yu","yo"],
        ["k","sh","ch","n","h","m","r","g","j","b","p"]
    )
    createTable(
        "special",
        document.getElementById("kakuchou"),
        null,
        ["a","i","u","e","o","yu"],
        ["イ","ウ","ヴ","ク","グ","ツ","テ","ト","デ","ド","フ","シ","ジ","チ","",]
    )

    
})