const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;

// ejs
app.set('view engine', 'ejs');
app.set('views', './view');

// files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, "node_modules/jquery/dist/")));

var content = fs.readdirSync("./private/html/content")
var searchItems = []
content.forEach(function(item){
    var lines = fs.readFileSync(`./private/html/content/${item}`)
    .toString().replace(/<[^>]*>/g,"").split("\n")
    console.log(lines)
    var title = lines[0]
    var description = lines[1]
    searchItems.push({title:title, description:description})
})

app.get("/search/:page", (req, res) => {
    var input = req.params.page
    var found = false
    for(i=0;i<content.length;i++){
        var current = path.basename(content[i],".html").replace(/[0-9A-Z]/g,"")
        if(current == input){
            found = true
            const data = {
                isJStrue: fs.existsSync(`./public/js/${current}.js`),
                isCSStrue: fs.existsSync(`./public/css/${current}.css`),
                file: current,
                search: searchItems,
                content: fs.readFileSync(`./private/html/content/${content[i]}`, 'utf8'),
                favouritable: true
            }
            res.render('index', data)
        }
    }
    if(!found){
        const data = {
            isJStrue: false,
            isCSStrue: false,
            file: "404",
            search: searchItems,
            content: fs.readFileSync(`./private/html/404.html`, 'utf8'),
            favouritable: false
        }
        res.status(404).render('index', data);
    }
    
})

// main pages
var navbar = ["home","favourites"]
navbar.forEach(function(item){
    app.get("/"+item.replace("home",""), (req, res) => {
        const data = {
            isJStrue: fs.existsSync(`./public/js/${item}.js`),
            isCSStrue: fs.existsSync(`./public/css/${item}.css`),
            file: item,
            search: searchItems,
            content: fs.readFileSync(`./private/html/${item}.html`, 'utf8'),
            favouritable: false
        }
        res.render('index', data)
    })
})

app.post('/log', (req, res) => {
    console.log('Data from frontend:', req.body);
    res.sendStatus(200);
});

app.all('*splat', (req, res) => {
    const data = {
        isJStrue: false,
        isCSStrue: false,
        file: "404",
        search: searchItems,
        content: fs.readFileSync(`./private/html/404.html`, 'utf8'),
        favouritable: false
    }
    res.status(404).render('index', data);
});

// misc
app.listen(port, (err) => {
    console.log(`Express server running at http://localhost:${port}`);
});
