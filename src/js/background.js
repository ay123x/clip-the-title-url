function copyToClipboard(tab) {
  const textToCopy = `▼${tab.title}\n${tab.url}`;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: (text) => {
      navigator.clipboard.writeText(text).then(() => {
        console.log('[Chrome Extensions: Clip the title and url] Copied to clipboard:', text);
        chrome.runtime.sendMessage({ success: true });
      }).catch(err => {
        console.error('[Chrome Extensions: Clip the title and url] Failed to copy text:', err);
        chrome.runtime.sendMessage({ success: false });
      });
    },
    args: [textToCopy]
  });
}
chrome.runtime.onMessage.addListener((message) => {
  if (message.success) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/image/icon128.png',
      title: 'コピー完了',
      message: 'URLとタイトルをクリップボードにコピーしました',
      priority: 1
    });
  } else {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/image/icon128.png',
      title: 'コピー失敗',
      message: 'クリップボードにコピーできませんでした。',
      priority: 1
    });
  }
});

// トリガー1: ツールバーのアイコンがクリックされたとき
chrome.action.onClicked.addListener((tab) => {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.windows.update(activeTab.windowId, { focused: true }, () => {
        copyToClipboard(activeTab);
      });
    });
  } catch (err) {
    console.error('[Chrome Extensions: Clip the title and url]', err);
  }

});

// トリガー2: コンテキストメニューのメニュークリック
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "copyTitleAndUrl",
      title: 'このサイトのURLとタイトルをコピー',
      contexts: ["page"]
    });
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyTitleAndUrl") {
    copyToClipboard(tab);
  }
});