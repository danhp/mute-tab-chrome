'use strict'
let stateAllTabs = false;

chrome.commands.onCommand.addListener(command => {
	switch (command) {
		case "mute_tab_current":
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
				chrome.tabs.update(tabs[0].id, {muted: !tabs[0].mutedInfo.muted});
			});
			break;

		case "mute_tab_all":
			stateAllTabs = !stateAllTabs;
			chrome.tabs.query({},function(tabs){     
				tabs.filter(tab=>tab.audible||tab.mutedInfo.muted).forEach(function(tab){
					chrome.tabs.update(tab.id, {muted: stateAllTabs});
				});
			 });
			break;

		case "mute_tab_all_except_current":
			chrome.tabs.query({},function(tabs){     
				tabs.filter(tab=>tab.audible).forEach(function(tab){
					chrome.tabs.update(tab.id, {muted: true});
				});
			});
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
				chrome.tabs.update(tabs[0].id, {muted: false});
			});
			break;
			
		default:
			break;
	}
});
