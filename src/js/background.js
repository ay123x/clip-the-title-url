{
  chrome.contextMenus.create({
    "type"  : 'normal',
    "title" : 'このサイトのURLとタイトルをコピー',
    "contexts" : ['all'],
    "onclick" : copy()
  });

  /**
   *
   * @param Object info https://developer.chrome.com/docs/extensions/reference/contextMenus/#type-OnClickData
   * @param Object tab https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab
   * @returns
   */
  function copy(info, tab) {
    return function(info, tab) {
      let url = tab.url;
      let title = tab.title;
      let str = `▼${title}\n${url}`;
      copyToclipboard(str);
    }
  }

  /**
   *
   * @param string str
   */
  function copyToclipboard(str) {
    let textArea = document.createElement('textarea');
    document.body.appendChild(textArea);
    textArea.value = str;
    textArea.select();
    document.execCommand('copy');
  }
}
