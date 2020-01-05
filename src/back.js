var tabs = new Map()
// grab the image when tab is switched
chrome.tabs.onActiveChanged.addListener(captureTab)
// remove tab from tabs map when tab is closed
chrome.tabs.onRemoved.addListener(function (tabId) {
    tabs.delete(tabId);
    saveTabs();
});
// grab the image when page is loaded
chrome.webNavigation.onCompleted.addListener(function (details) {
    console.log("here")
    if (details.frameId != 0) return
    setTimeout(function () { captureTab(details.tabId) }, 100)
}
)
// get the image of the active tab
function captureTab(tabid, callback = null, args) {
    try {
        chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 1 }, function (data) {
            chrome.tabs.get(tabid, function (val) {
                console.log(val)
                tabs.set(tabid, { title: val.title, data: data })
                saveTabs()
                if (callback) {
                    callback(...args)
                }
            })
        })
    } catch (e) {
        console.log(e)
        if (tabs.has(tabid))
            tabs.delete(tabid)
        saveTabs()
    }
}
// save tabs the local storage
function saveTabs() {
    chrome.storage.local.set({ tabs: Array.from(tabs) })
}
// to be impllemented later
// function swap() {
//     chrome.tabs.query({}, tabs => {
//         rCap(tabs)
//     })
// }
// function rCap(tabs, i = 0) {
//     var tab = tabs[i]
//     chrome.tabs.update(tab.id, { active: true }, () => {
//         i++
//         if (i == tabs.length) {
//             captureTab(tab.id)
//         } else {
//             captureTab(tab.id, rCap, [tabs, i])
//         }
//     })
// }