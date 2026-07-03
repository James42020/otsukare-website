console.log("āīūēō")

function goToPage(link){
    window.location.href = `${window.location.origin}/search/${encodeURIComponent(link.toLowerCase())}`
}

$(document).on("keypress click",".search-link",function(e){
    console.log("test")
    if(e.type=="click"||e.code == "Enter"){
        goToPage(e.target.dataset.search)
    }
})

$(document).on("keypress","#search-input",function(e){
    if(e.code == "Enter"){
        goToPage($("#search-input").val())
    }
})

$(document).on("keypress click","#search-button",function(e){
    if(e.type=="click"||e.code == "Enter"){
        goToPage($("#search-input").val())
    }
})

$(document).ready(function(){
    $("#search-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#search-terms div").filter(function() {
            $(this).toggle($(this).attr("data-search").toLowerCase().indexOf(value) > -1)
        });
        
    });
});


function navbarMode(value){
    if(value){
        $(".navbar").removeClass("navbar-default")
        $(".navbar").addClass("navbar-inverse")
    } else {
        $(".navbar").addClass("navbar-default")
        $(".navbar").removeClass("navbar-inverse")
    }
}

var qrDark, qrLight // for qr code
function QRStatus(mode){
    if(mode){ // dark mode on
        qrDark = "#FFFFFF"
        qrLight = "#222222"
    } else {
        qrDark = "#000000"
        qrLight = "#FFFFFF"
    }
    $("#qrcode").empty()
    new QRCode(document.getElementById('qrcode'), {
        text: window.location.href,
        width: 250,
        height: 250,
        colorDark: qrDark,
        colorLight: qrLight,
    });
    $("#qrcode").removeAttr("title")
}

function flip(){
    if(localStorage.getItem("DarkMode") == "0"){
        $(':root').css('color-scheme', 'dark')
        navbarMode(true)
        QRStatus(true)
        $("#modeName").text(" LIGHT MODE")
        localStorage.setItem("DarkMode","1")
    } else {
        $(':root').css('color-scheme', 'light')
        navbarMode(false)
        QRStatus(false)
        $("#modeName").text(" DARK MODE")
        qrDark = "#000000"
        qrLight = "#FFFFFF"
        localStorage.setItem("DarkMode","0")
    }
}

$(document).on("DOMContentLoaded",function(){
    if(localStorage.getItem("DarkMode") == undefined){
        $(':root').css('color-scheme', 'light')
        navbarMode(false)
        QRStatus(false)
        $("#modeName").text(" DARK MODE")
        qrDark = "#000000"
        qrLight = "#FFFFFF"
        localStorage.setItem("DarkMode","0")
    } else{
        if(localStorage.getItem("DarkMode") == "0"){
            $(':root').css('color-scheme', 'light')
            navbarMode(false)
            QRStatus(false)
            qrDark = "#000000"
            qrLight = "#FFFFFF"
            $("#modeName").text(" DARK MODE")
        } else {
            $(':root').css('color-scheme', 'dark')
            navbarMode(true)
            QRStatus(true)
            qrDark = "#FFFFFF"
            qrLight = "#222222"
            $("#modeName").text(" LIGHT MODE")
        }
    }
})




$(document).on("click",".navbar-toggle",function(){
    if(!$('#nav-target').hasClass('in')&&$('.navbar-toggle').hasClass('collapsed')){
        localStorage.setItem("nav-dropdown","0")
    } else {
        localStorage.setItem("nav-dropdown","1")
    }
})

$(document).on("DOMContentLoaded",function(){
    function navDrop(){
        $('#nav-target').addClass('in');
        $('.navbar-toggle').removeClass('collapsed');
    }
    function navUp(){
        $('#nav-target').removeClass('in');
        $('.navbar-toggle').addClass('collapsed');
    }
    
    if(localStorage.getItem("nav-dropdown") == undefined){
        navUp()
        localStorage.setItem("nav-dropdown","0")
    } else{
        if(localStorage.getItem("nav-dropdown") == "0"){
            navUp()
        } else {
            navDrop()
        }
    }
})



var allPages = []
$(document).on("DOMContentLoaded",function(){
    for(i=0;i<$(".search-link").length;i++){
        allPages.push($(".search-link")[i])
    }
})

function setRandomPage(){
    var randomIndex = Math.round(Math.random() * (allPages.length-1))
    var url = encodeURIComponent($(allPages[randomIndex]).attr("data-search").toLowerCase())
    window.location.href = `${window.location.protocol}//${window.location.host}/search/${url}`
}

// Debug Favourites
//localStorage.setItem("Favourites", "")

var favourites = localStorage.getItem("Favourites").split(",")

function updateFavs(){
    var textData = favourites.toString()
    if(textData[0] == ","){
        textData = textData.substring(1,textData.length)
    }
    localStorage.setItem("Favourites", textData)

}

function updateFavModal(){
    $("#favourite-links").empty()
    for(j=favourites.length;j>=0;j--){
        for(k=0;k<$(".search-link").length;k++){
            if($(".search-link")[k].dataset.search == favourites[j]){
                var currentLink = $(".search-link")[k].cloneNode(true)
                $(currentLink).removeClass("search-link")
                $(currentLink).addClass("fav-link")
                $(currentLink).on("keypress click",function(e){
                    console.log("test")
                    if(e.type=="click"||e.code == "Enter"){
                        goToPage(e.target.dataset.search)
                    }
                })
                $("#favourite-links")[0].appendChild(currentLink)
            }
        }
    }
    if($("#favourite-links").children("div").length == 0){
        var emptyText = document.createElement("p")
        emptyText.innerText = "You have no Favourites"
        $("#favourite-links")[0].appendChild(emptyText)
    }
}

$(document).on("DOMContentLoaded",function(){
    console.log("trigger")
    var titleURL = $("h1")[0].innerText
    var favouritesList = localStorage.getItem("Favourites").split(",")
    if($("#favourite")[0] != undefined){
        $("#favourite").attr("data-title",titleURL)
        if(favouritesList.includes(titleURL)){
            $("#favourite")[0].innerText = "Remove from Favourites"
            $("#favourite").attr("data-fav","1")
        } else {
            $("#favourite")[0].innerText = "Add to Favourites"
            $("#favourite").attr("data-fav","0")
        }
    }
    updateFavModal()
    
})

$(document).on("click","#favourite",function(e){
    var pageName = $(e.target).attr("data-title")
    if($("#favourite").attr("data-fav") == "0"){
        favourites.push(pageName)
        updateFavs()
        $("#favourite")[0].innerText = "Remove from Favourites"
        $("#favourite").attr("data-fav","1")
        updateFavModal()
    } else {
        for(i=0;i<favourites.length;i++){
            if(favourites[i] == pageName){
                favourites.splice(i, 1)
            }
        }
        updateFavs()
        $("#favourite")[0].innerText = "Add to Favourites"
        $("#favourite").attr("data-fav","0")
        updateFavModal()
    }
})