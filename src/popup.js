// var tabids=[]
// Injects the tabs on the page
function publishTabs(obj) {
    chrome.tabs.query({ active: true }, function (acttab) {
        var activeTabid = acttab[0].id
        parent = document.getElementById("tabgroup")
        var tabArr = obj.tabs
        for (let i = 0; i < tabArr.length; i++) {
            var t = tabArr[i];
            // tabids.push(t[0])
            var tab = document.createElement("div")
            tab.classList.add("t", "drop-shadow")
            if(t[0]==activeTabid) tab.classList.add("active")
            tab.setAttribute("tabid", "" + t[0])
            tab.innerHTML = `<div class="cross">&#xE711</div>
        <div class="tname">
            ${t[1].title||"New Tab"}
        </div>`
            var img = document.createElement("img")
            img.src = t[1].data||"empty.jpg"
            tab.append(img)
            tab.addEventListener("click", tabSwithcer)
            parent.append(tab)
        }
        // Add event handler to the close buttons
        assignHandler()
    })
}
// tabs are stored in local storage by the back.js
chrome.storage.local.get("tabs",publishTabs)
// Add the tab close button a event handler
function assignHandler() {
    var elems = document.getElementsByClassName("cross")
    for (elem of elems) {
        elem.addEventListener("click", tabCloser,true)
    }
}
function tabCloser() {
    // ele is the close btn
    var ele = this
    tabid = parseInt(ele.parentElement.getAttribute("tabid"))
    // close the tab with chrome api
    chrome.tabs.remove(tabid, function () {
        // remove the tab element from the page
        ele.parentElement.remove()
        // tabids.splice(tabids.indexOf(tabid),1)
    })
}
// changes the active tab
function tabSwithcer() {
    // disable close btn events being captured
    if(!event.target.classList.contains("cross")){
    tabid = parseInt(this.getAttribute("tabid"))
    // change active tab
    chrome.tabs.update(tabid, { active: true })
    }
}
// Current only save the tabs to local storage and tab recover will added soon
function setTabsAside() {
    chrome.tabs.getAllInWindow((tabs) => {
        chrome.storage.local.get("tabDump", (obj => {
            var oldTabs=obj.tabDump||[]
            // use the date time to create a unique tabs backup
            var time=""+(new Date().getTime())
            oldTabs.push({time:time,tabs:tabs})
            chrome.storage.local.set({ tabDump: oldTabs })
            // create new tab before closing others else browser will close
            chrome.tabs.create({ active: false })
            // remove all the tabs except the newly created tab
            chrome.tabs.remove(tabs.map(tab => { return tab.id }))
        }))
    })
}
// add event handlers the start fresh and new tab buton
document.getElementById("start-fresh").onclick=setTabsAside
document.getElementById("new-tab").onclick=function(){
    chrome.tabs.create({})
}
