const skipifyScript = document.createElement('script');
skipifyScript.src = chrome.runtime.getURL('skipify.js');

skipifyScript.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(skipifyScript);