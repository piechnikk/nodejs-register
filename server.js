var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;

var users = [
    { id: 1, log: "aaa", pass: "haslo", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, log: "bbb", pass: "haslo", wiek: 12, uczen: "", plec: "k" },
    { id: 3, log: "ccc", pass: "haslo", wiek: 9, uczen: "checked", plec: "m" },
    { id: 4, log: "ddd", pass: "haslo", wiek: 14, uczen: "", plec: "k" },
    { id: 5, log: "eee", pass: "haslo", wiek: 3, uczen: "checked", plec: "m" }
]
var idUser = users.length
var zalogowano = false

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

var path = require("path")
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"))
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"))
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"))
})

app.get("/admin", function (req, res) {
    if (zalogowano)
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    else
        res.sendFile(path.join(__dirname + "/static/brak-dostepu.html"))
})

app.get("/logout", function (req, res) {
    zalogowano = false
    res.redirect("/")
})

app.post("/register", function (req, res) {
    var sprawdzanie = false
    for (var i = 0; i < users.length; i++) {
        if (req.body.log == users[i].log) {
            sprawdzanie = true
            break;
        }
    }
    if (sprawdzanie)
        res.send("Login " + req.body.log + " już istnieje w bazie")
    else {
        idUser++
        var uczen = ""
        if (req.body.uczen == "on")
            uczen = "checked"
        users.push({ id: idUser, log: req.body.log, pass: req.body.pass, wiek: parseInt(req.body.wiek), uczen: uczen, plec: req.body.plec })
        if (req.body.plec == "m")
            res.send("Witaj " + req.body.log + " zostałeś zarejestrowany!")
        else
            res.send("Witaj " + req.body.log + " zostałaś zarejestrowana!")
    }
})

app.post("/login", function (req, res) {
    for (var i = 0; i < users.length; i++) {
        if (req.body.log == users[i].log && req.body.pass == users[i].pass) {
            zalogowano = true
            res.redirect("/admin")
            break
        }
    } if (!zalogowano) {
        res.send("Niepoprawny login lub hasło!")
    }
})


var ros = true
app.get("/sort", function (req, res) {
    if (zalogowano) {
        var sortedUsers = [...users]
        if (ros) {
            var html = '<style>*{font-family: DejaVu Sans Mono, monospace; color: white;} body{margin: 0; background-color: #333;} #admin-navbar{display: flex;} .admin-navItem{float: left; padding: 10px;} .row {display: flex;} .col {padding: 10px; border: 1px gold solid; margin: 1px;} #c1 {width: 14%;} #c2 {width: 35%;} #c3 {width: 15%;} #c4 {width: 18%;} #c5 {width: 18%} #cg {width: 50%;} #cs1 {width: 25%;} #cs2 {width: 50%;} #cs3 {width: 25%;}</style><div id="admin-navbar"><div class="admin-navItem"><a href="/sort">sort</a></div><div class="admin-navItem"><a href="/gender">gender</a></div><div class="admin-navItem"><a href="/show">show</a></div></div><form action="/sort" method="post" onchange="this.submit()"><input type="radio" name="sort" value="r" checked>rosnąco<input type="radio" name="sort" value="m">malejąco</form>'
            sortedUsers.sort(function (a, b) {
                return parseFloat(a.wiek) - parseFloat(b.wiek)
            })
        } else {
            var html = '<style>*{font-family: DejaVu Sans Mono, monospace; color: white;} body{margin: 0; background-color: #333;} #admin-navbar{display: flex;} .admin-navItem{float: left; padding: 10px;} .row {display: flex;} .col {padding: 10px; border: 1px gold solid; margin: 1px;} #c1 {width: 14%;} #c2 {width: 35%;} #c3 {width: 15%;} #c4 {width: 18%;} #c5 {width: 18%} #cg {width: 50%;} #cs1 {width: 25%;} #cs2 {width: 50%;} #cs3 {width: 25%;}</style><div id="admin-navbar"><div class="admin-navItem"><a href="/sort">sort</a></div><div class="admin-navItem"><a href="/gender">gender</a></div><div class="admin-navItem"><a href="/show">show</a></div></div><form action="/sort" method="post" onchange="this.submit()"><input type="radio" name="sort" value="r">rosnąco<input type="radio" name="sort" value="m" checked>malejąco</form>'
            sortedUsers.sort(function (a, b) {
                return parseFloat(b.wiek) - parseFloat(a.wiek)
            })
        }
        for (var i = 0; i < sortedUsers.length; i++) {
            html += '<div class="row"><div id="cs1" class="col">'
            html += 'id: ' + sortedUsers[i].id
            html += '</div><div id="cs2" class="col">'
            html += 'user: ' + sortedUsers[i].log + ' - ' + sortedUsers[i].pass
            html += '</div><div id="cs3" class="col">'
            html += 'wiek: ' + sortedUsers[i].wiek
            html += '</div></div>'
        }
        res.send(html)
    } else
        res.sendFile(path.join(__dirname + "/static/brak-dostepu.html"))
})

app.post("/sort", function (req, res) {
    if (zalogowano) {
        var sortedUsers = [...users]
        if (req.body.sort == "r") {
            ros = true
            var html = '<style>*{font-family: DejaVu Sans Mono, monospace; color: white;} body{margin: 0; background-color: #333;} #admin-navbar{display: flex;} .admin-navItem{float: left; padding: 10px;} .row {display: flex;} .col {padding: 10px; border: 1px gold solid; margin: 1px;} #c1 {width: 14%;} #c2 {width: 35%;} #c3 {width: 15%;} #c4 {width: 18%;} #c5 {width: 18%} #cg {width: 50%;} #cs1 {width: 25%;} #cs2 {width: 50%;} #cs3 {width: 25%;}</style><div id="admin-navbar"><div class="admin-navItem"><a href="/sort">sort</a></div><div class="admin-navItem"><a href="/gender">gender</a></div><div class="admin-navItem"><a href="/show">show</a></div></div><form action="/sort" method="post" onchange="this.submit()"><input type="radio" name="sort" value="r" checked>rosnąco<input type="radio" name="sort" value="m">malejąco</form>'
            sortedUsers.sort(function (a, b) {
                return parseFloat(a.wiek) - parseFloat(b.wiek)
            })
        } else {
            ros = false
            var html = '<style>*{font-family: DejaVu Sans Mono, monospace; color: white;} body{margin: 0; background-color: #333;} #admin-navbar{display: flex;} .admin-navItem{float: left; padding: 10px;} .row {display: flex;} .col {padding: 10px; border: 1px gold solid; margin: 1px;} #c1 {width: 14%;} #c2 {width: 35%;} #c3 {width: 15%;} #c4 {width: 18%;} #c5 {width: 18%} #cg {width: 50%;} #cs1 {width: 25%;} #cs2 {width: 50%;} #cs3 {width: 25%;}</style><div id="admin-navbar"><div class="admin-navItem"><a href="/sort">sort</a></div><div class="admin-navItem"><a href="/gender">gender</a></div><div class="admin-navItem"><a href="/show">show</a></div></div><form action="/sort" method="post" onchange="this.submit()"><input type="radio" name="sort" value="r">rosnąco<input type="radio" name="sort" value="m" checked>malejąco</form>'
            sortedUsers.sort(function (a, b) {
                return parseFloat(b.wiek) - parseFloat(a.wiek)
            })
        }
        for (var i = 0; i < sortedUsers.length; i++) {
            html += '<div class="row"><div id="cs1" class="col">'
            html += 'id: ' + sortedUsers[i].id
            html += '</div><div id="cs2" class="col">'
            html += 'user: ' + sortedUsers[i].log + ' - ' + sortedUsers[i].pass
            html += '</div><div id="cs3" class="col">'
            html += 'wiek: ' + sortedUsers[i].wiek
            html += '</div></div>'
        }
        res.send(html)
    } else
        res.sendFile(path.join(__dirname + "/static/brak-dostepu.html"))
})

app.get("/gender", function (req, res) {
    if (zalogowano) {
        var html = '<style>*{font-family: DejaVu Sans Mono, monospace; color: white;} body{margin: 0; background-color: #333;} #admin-navbar{display: flex;} .admin-navItem{float: left; padding: 10px;} .row {display: flex;} .col {padding: 10px; border: 1px gold solid; margin: 1px;} #c1 {width: 14%;} #c2 {width: 35%;} #c3 {width: 15%;} #c4 {width: 18%;} #c5 {width: 18%} #cg {width: 50%;}</style><div id="admin-navbar"><div class="admin-navItem"><a href="/sort">sort</a></div><div class="admin-navItem"><a href="/gender">gender</a></div><div class="admin-navItem"><a href="/show">show</a></div></div>'
        var k = ""
        var m = ""
        for (var i = 0; i < users.length; i++) {
            if (users[i].plec == "k") {
                k += '<div class="row"><div id="cg" class="col">id: ' + users[i].id + '</div><div id="cg" class="col">płeć: ' + users[i].plec + '</div></div>'
            } else if (users[i].plec == "m") {
                m += '<div class="row"><div id="cg" class="col">id: ' + users[i].id + '</div><div id="cg" class="col">płeć: ' + users[i].plec + '</div></div>'
            }
        }
        html += k + '<br>' + m
        res.send(html)
    } else
        res.sendFile(path.join(__dirname + "/static/brak-dostepu.html"))
})

app.get("/show", function (req, res) {
    if (zalogowano) {
        var html = '<style>*{font-family: DejaVu Sans Mono, monospace; color: white;} body{margin: 0; background-color: #333;} #admin-navbar{display: flex;} .admin-navItem{float: left; padding: 10px;} .row {display: flex;} .col {padding: 10px; border: 1px gold solid; margin: 1px;} #c1 {width: 14%;} #c2 {width: 35%;} #c3 {width: 15%;} #c4 {width: 18%;} #c5 {width: 18%} #cg {width: 50%;}</style><div id="admin-navbar"><div class="admin-navItem"><a href="/sort">sort</a></div><div class="admin-navItem"><a href="/gender">gender</a></div><div class="admin-navItem"><a href="/show">show</a></div></div>'
        for (var i = 0; i < users.length; i++) {
            html += '<div class="row"><div id="c1" class="col">'
            html += 'id: ' + users[i].id
            html += '</div><div id="c2" class="col">'
            html += 'user: ' + users[i].log + ' - ' + users[i].pass
            html += '</div><div id="c3" class="col">'
            html += 'uczeń: <input type="checkbox" ' + users[i].uczen + ' disabled>'
            html += '</div><div id="c4" class="col">'
            html += 'wiek: ' + users[i].wiek
            html += '</div><div id="c5" class="col">'
            html += 'płeć: ' + users[i].plec
            html += '</div></div>'
        }
        res.send(html)
    } else
        res.sendFile(path.join(__dirname + "/static/brak-dostepu.html"))
})


app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})