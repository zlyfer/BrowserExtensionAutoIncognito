function setBadge() {
    var enabled = getVars()[0];
    chrome.browserAction.setBadgeText({1: {text: "On"}, 0: {text: "Off"}}[enabled]);
    chrome.browserAction.setBadgeBackgroundColor({0: {color: 'red'}, 1: {color: 'green'}}[enabled]);
}
function getVars() {
    var enabled = localStorage['enabled'];
    var websites = JSON.parse(localStorage['websites']);
    return ([enabled, websites]);
}
function setVars(vars) {
    if (vars['enabled'] != undefined) {
        localStorage['enabled'] = vars['enabled'];
        setBadge();
    }
    if (vars['websites'] != undefined) {
        localStorage['websites'] = JSON.stringify(vars['websites']);
    }
}
function list() {
    var websites = JSON.parse(localStorage["websites"]);
    var list = document.getElementById("list");
    for (var i = 0; i < websites.length; i++) {
        var option = document.createElement("option");
        option.text = websites[i];
        list.add(option);
        document.getElementById("remAll").style.backgroundColor = "var(--red)";
    }
}
function currentTabsList() {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        var list = document.getElementById("currentTabsList");
        var option = document.createElement("option");
        option.text = "Current tabs:";
        option.disabled = true;
        list.add(option);
        option = document.createElement("option");
        option.text = "";
        option.disabled = true;
        list.add(option);
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url != "chrome-extension://"+chrome.runtime.id+"/options.html") {
                list = document.getElementById("currentTabsList");
                option = document.createElement("option");
                option.text = tabs[i].url;
                option.disabled = 1;
                list.add(option);
            }
        }
    });
}
function changeAddSingle() {
    var input = document.getElementById("new").value;
    if (input != "" && input != "chrome-extension://"+chrome.runtime.id+"/options.html") {
        document.getElementById("add").style.backgroundColor = "var(--green)";
    } else {
        document.getElementById("add").style.backgroundColor = "var(--light-background-color)";
    }
}
function changeEnable() {
    var enabled = getVars()[0];
    if (enabled == 0) {
        document.getElementById("enabled").innerHTML = "Disabled";
        document.getElementById("enabled").style.backgroundColor = "var(--red)";
    } else if (enabled == 1) {
        document.getElementById("enabled").innerHTML = "Enabled";
        document.getElementById("enabled").style.backgroundColor = "var(--green)";
    }
}
function addSingle() {
    var input = document.getElementById("new").value;
    var websites = getVars()[1];
    if (input != "chrome-extension://"+chrome.runtime.id+"/options.html") {
        var website = document.getElementById("new").value;
        if (website != "") {
            websites.push(website);
            setVars({'websites': websites});
            var list = document.getElementById("list");
            var option = document.createElement("option");
            option.text = website;
            list.add(option);
            document.getElementById("add").style.backgroundColor = "var(--light-background-color)";
            document.getElementById("new").value = "";
        }
    }
}
function addAll() {
    var currentTabsList = document.getElementById("currentTabsList");
    var list = document.getElementById("list");
    for (var i = 0; i < currentTabsList.length; i++) {
        if (currentTabsList[i].text != "" && currentTabsList[i].text != "Current tabs:") {
            var websites = getVars()[1];
            websites.push(currentTabsList[i].text);
            setVars({'websites': websites});
            var option = document.createElement("option");
            option.text = currentTabsList[i].text;
            list.add(option);
            document.getElementById("remAll").style.backgroundColor = "var(--red)";
        }
    }
}
function remSingle() {
    var websites = JSON.parse(localStorage["websites"]);
    var item = websites.indexOf(document.getElementById("list").value);
    if(item != -1) {
        websites.splice(item, 1);
    }
    setVars({'websites': websites});
    var list = document.getElementById("list");
    list.remove(list.selectedIndex);
    document.getElementById("rem").style.backgroundColor = "var(--light-background-color)";
}
function remAll() {
    var list = document.getElementById("list");
    for (var i = list.length; i >= 0; i--) {
        list.remove(i);
    }
    setVars({'websites': new Array()});
    document.getElementById("rem").style.backgroundColor = "var(--light-background-color)";
    document.getElementById("remAll").style.backgroundColor = "var(--light-background-color)";
}
function toggle() {
    var enabled = localStorage['enabled'];
    if (enabled == 1) {
        setVars({'enabled': 0});
        changeEnable();
    } else if (enabled == 0) {
        setVars({'enabled': 1});
        changeEnable();
    }
}
document.getElementById('enabled').onclick = function() {toggle();};
document.getElementById('add').onclick = function() {addSingle();};
document.getElementById('addAll').onclick = function() {addAll();};
document.getElementById('rem').onclick = function() {remSingle();};
document.getElementById('remAll').onclick = function() {remAll();};
document.getElementById('new').oninput = function() {changeAddSingle();};
document.getElementById('list').onchange = function() {document.getElementById("rem").style.backgroundColor = "var(--red)";};
list();
currentTabsList();
changeEnable();