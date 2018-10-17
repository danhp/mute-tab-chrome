'use strict'
let stateAllTabs = false;

chrome.commands.onCommand.addListener(command => {
	switch (command) {
		case "mute_tab_current":
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([currentTab]) => {
				chrome.tabs.update(currentTab.id, { muted: !currentTab.mutedInfo.muted });
			});
			break;

		case "mute_tab_all":
			stateAllTabs = !stateAllTabs;
			chrome.tabs.query({}, tabs => {
				tabs
					.filter(tab => tab.audible || tab.mutedInfo.muted)
					.forEach(tab => {
						chrome.tabs.update(tab.id, { muted: stateAllTabs });
					});
			})
			break;

		case "mute_tab_all_except_current":
			chrome.tabs.query({}, tabs => {
				tabs
					.filter(tab => ((!tab.active) && tab.audible))
					.forEach(tab => {
						chrome.tabs.update(tab.id, { muted: true })
					});
			});
			break;

		default:
			break;
	}
});
