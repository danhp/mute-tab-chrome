chrome.commands.onCommand.addListener(function(command) {
    var newIndex;

    switch (command) {
        case "mute_tab_current":
            chrome.tabs.getSelected(null, function(tab){
                chrome.tabs.update(tab.id, {muted: !tab.muted});
            });
            break;

        case "mute_tab_all":
            chrome.windows.getCurrent({populate: true}, function(window) {
                window.tabs.forEach(function(tab) {
                    chrome.tabs.update(tab.id, {muted: true});
                });
            });
            break;

        case "mute_tab_unmute_all":
            chrome.windows.getCurrent({populate: true}, function(window) {
                window.tabs.forEach(function(tab) {
                    chrome.tabs.update(tab.id, {muted: false});
                });
            });
            break;

        default:
            break;
    }
});
