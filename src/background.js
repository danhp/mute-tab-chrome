'use strict'

let stateAllTabs = false;
let automute = false;

function muteAll(muted, excludeId) {
	chrome.windows.getAll({populate: true}, windowList => {
		windowList.forEach(window => {
			window.tabs.forEach(tab => {
				if (tab.id === excludeId) { return; }
				if (tab.audible || tab.mutedInfo.muted) {
					chrome.tabs.update(tab.id, {'muted': muted});
				}
			});
		});
	});
};

function automuteOtherTabs(tabId) {
	if(!automute || stateAllTabs) { return; }

	chrome.tabs.get(tabId, tab => {
		muteAll(true, tab.id);
		chrome.tabs.update(tab.id, {muted: false});
	});
}

chrome.tabs.onActivated.addListener(activeInfo => {
	automuteOtherTabs(activeInfo.tabId);
});

chrome.commands.onCommand.addListener(command => {
	switch (command) {
		case "mute_tab_current":
			chrome.tabs.getSelected(null, tab => {
				chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
			});
			break;

		case "mute_tab_all":
			stateAllTabs = !stateAllTabs;
			if (stateAllTabs) { automute = false; }
			muteAll(stateAllTabs);
			break;

		case "mute_tab_all_except_current":
			chrome.tabs.getSelected(null, tab => {
				muteAll(true, tab.id);
				chrome.tabs.update(tab.id, {muted: false});
			});
			break;

		case "automute_tab_all_except_current":
			automute = !automute;
			stateAllTabs = false;
			chrome.tabs.getSelected(null, tab => {
				automuteOtherTabs(tab.id);
			});
			break;

		default:
			break;
	}
});
