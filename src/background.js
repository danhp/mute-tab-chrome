'use-strict'
let stateAllTabs = false;

chrome.commands.onCommand.addListener((command) => {
	switch (command) {
		case "mute_tab_current":
			chrome.tabs.getSelected(null, (tab) => {
				chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
			});
			break;

		case "mute_tab_all":
			stateAllTabs = !stateAllTabs;
			chrome.windows.getAll({populate: true}, (windowList) => {
				windowList.forEach((window) => {
					window.tabs.forEach((tab) => {
						if (tab.audible || tab.mutedInfo.muted) {
							chrome.tabs.update(tab.id, {muted: stateAllTabs});
						}
					});
				});
			});
			break;

		case "mute_tab_all_except_current":
			chrome.windows.getAll({populate: true}, (windowList) => {
				windowList.forEach((window) => {
					window.tabs.forEach((tab) => {
						if (tab.audible) {
							chrome.tabs.update(tab.id, {muted: true})
						}
					});
				});
			});
			chrome.tabs.getSelected(null, (tab) => {
				chrome.tabs.update(tab.id, {muted: false});
			});
			break;

		default:
			break;
	}
});
