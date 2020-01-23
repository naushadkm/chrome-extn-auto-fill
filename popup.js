// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let openTestHarness1 = document.getElementById('openTestHarness1');
let openTestHarness = document.getElementById('openTestHarness');
let setIdentityProviderAndEnv = document.getElementById('setIdentityProviderAndEnv');
let postUserID = document.getElementById('postUserID');

let environments = document.getElementsByName("environment");
let selectedEnv;
let selectedEnvIndex;

let userID = 'user-name';
let txtUserID = document.getElementById('userId');
txtUserID.value = userID;

let changeColor = document.getElementById('changeColor');
let counter = 0;
let colors = ['red', 'green', 'blue', 'yellow', 'aqua'];

/** Declarations */
function _postUserID() {
  return new Promise(resolve => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: `
          document.querySelector('input[name="userid"]').value ='`+ txtUserID.value +`'
          document.querySelector('input[type="submit"]').click();
        `}, function() {
          resolve(tabs[0]);
        });
    });
  });
}
/** Declarations */

function _openTestHarness(tab) {
  var url = 'https://www.google.com/';
  return new Promise(resolve => {
      chrome.tabs.update(tab.id, {url: url}, async tab => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            // console.log('addListener::', tab);
            if (info.status === 'complete' && tabId === tab.id) {
              if (tab.title === "ANG SSO Test Harness") {
                console.log('ANG SSO Test Harness');
              }
              if (tab.title === "LFG SSO test harness site") {
                console.log('LFG SSO test harness site');
              }
              _postUserID();
              // chrome.tabs.onUpdated.removeListener(listener);
              resolve(tab);
            }
          });
      });
  });
}

openTestHarness1.onclick = function(element) {
  var callback = function () {
    // Do something clever here once data has been removed.
    for(var i = 0; i < environments.length; i++) {
      if(environments[i].checked) {
        selectedEnvIndex = i;
        selectedEnv = environments[i].value;
      }
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
      let gTab = _openTestHarness(tab);
      gTab.then(
        (tab) => {
          chrome.tabs.executeScript(
            tab.id,
            { code: `
              var h1 = document.getElementsByTagName('h1')[0];
              h1.style.backgroundColor = "blue";
              console.log('nkm');

              // setIdentityProviderAndEnv
              document.getElementById('client').selectedIndex = 4;
              document.querySelectorAll('input[name="environment"]')[`+ selectedEnvIndex +`].checked = true;
              document.querySelector('input[name="submit"]').click();
            `}, function(res) {
              console.log('openTestHarness1 executeScript completed.', res);
            });
        },
        error => console.log('Error....123', error) // doesn't run
      );
    });
  };
  
  // var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var millisecondsPerDay = 1000 * 60 * 60 * 24 * 1;
  // var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
  var oneDayAgo = (new Date()).getTime() - millisecondsPerDay;
  chrome.browsingData.remove({
    "since": oneDayAgo
  }, {
    "serviceWorkers": true,
    "localStorage": true,
    "indexedDB": true,
    "webSQL": true,
    "cookies": true,
    "appcache": true,
    "cacheStorage": true,
  }, callback);
};

txtUserID.onchange = function(ev) {
  console.log('onchange ', ev.target.value);
  userID = ev.target.value;
};

openTestHarness.onclick = function(element) {
  var tabId = null;
  var url = 'https://www.google.com/';
 
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    console.log('query active tab callback: ', tab);
    chrome.tabs.update(tab.id, {url: url}, function(tab) {
      console.log('Tab update callback: ', tab);
      chrome.tabs.executeScript(tab.id, {
        code: `
          console.log('tab loaded man!');
          var h1 = document.getElementsByTagName('h1')[0];
          h1.style.backgroundColor = "blue";
        `, 
        runAt: "document_end",
        allFrames: true
      }, function(result) {
        console.log('executeScript callback:: ', result);
      });
    });
  });

  // chrome.tabs.create({
  //   url: 'https://www.google.com/'
  // }, function(tab) {
  //   console.log('loaded new tab', tab);
  //   tab.executeScript(
  //     tab.id,
  //       { code: `
          
  //         console.log('tab loaded man!');
          
  //       `});

  //   // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   //   chrome.tabs.executeScript(
  //   //     tabs[0].id,
  //   //       { code: `
  //   //         window.onload
  //   //         var h1 = document.getElementsByTagName('h1')[0];
  //   //         h1.style.backgroundColor = "blue";
  //   //         console.log('nkm');
  //   //         document.getElementById('client').selectedIndex = 4;
  //   //         document.querySelectorAll('input[name="environment"]')[2].checked = true;
  //   //         document.querySelector('input[name="submit"]').click();
  //   //       `});
  //   // });
  // });
};

setIdentityProviderAndEnv.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
        { code: `
          var h1 = document.getElementsByTagName('h1')[0];
          h1.style.backgroundColor = "blue";
          console.log('nkm');
          document.getElementById('client').selectedIndex = 4;
          document.querySelectorAll('input[name="environment"]')[2].checked = true;
          document.querySelector('input[name="submit"]').click();
        `});
  });
};

postUserID.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
        { code: `
          document.querySelector('input[name="userid"]').value = 'webtpa10';
          document.querySelector('input[type="submit"]').click();
        `});
  });
};

changeColor.onclick = function(element) {
  counter++;

  chrome.storage.sync.set({color: colors[counter]}, function() {
    console.log("The color set is.", colors[counter]);
  });

  chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
    console.log("The color GET is.", colors[counter]);
  });

  if (counter > 3) {
    counter = 0;
  }
};