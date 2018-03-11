if (localStorage['enabled'] == undefined) {
    setVars({'enabled': 1});
}
if (localStorage['websites'] == undefined) {
    setVars({'websites': new Array()});
}
function getVars() {
    var enabled = localStorage['enabled'];
    var websites = JSON.parse(localStorage['websites']);
    return ([enabled, websites]);
}
function setVars(vars) {
    if (vars['enabled'] != undefined) {
        localStorage['enabled'] = vars['enabled'];
    }
    if (vars['websites'] != undefined) {
        localStorage['websites'] = JSON.stringify(vars['websites']);
    }
}
function setBadge() {
    var enabled = getVars()[0];
    chrome.browserAction.setBadgeText({1: {text: "On"}, 0: {text: "Off"}}[enabled]);
    chrome.browserAction.setBadgeBackgroundColor({0: {color: 'red'}, 1: {color: 'green'}}[enabled]);
}
function incog(tabID, changeInfo, tab) {
    var vars = getVars();
    var enabled = vars[0];
    var websites = vars[1];
    if (enabled == 1) {
        for (var i = 0; i < websites.length; i++) {
            if (tab.url.indexOf(websites[i]) > -1) {
                if (changeInfo.status == "loading") {
                    chrome.history.deleteUrl({url: tab.url});
                    chrome.tabs.remove(tabID);
                    chrome.windows.create({'url': tab.url, 'focused': true, 'incognito': true});
                    break;
                }
            }
        }
    }
}

setBadge();
chrome.browserAction.onClicked.addListener(function() {chrome.tabs.create({url: "options.html"})});
chrome.tabs.onUpdated.addListener(incog);