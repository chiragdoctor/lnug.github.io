#!/usr/bin/env node

'use strict';
/**

Todo -

* fetch name
* generate html
* better archive.
**/


var superagent = require('superagent');
var fs = require('fs');
var _ = require('lodash');

var old = require('../archive5.json');


function modelTalk(talk) {
  return {
    '.name': talk.name,
    '.title': talk.title,
    '.desc': talk.body,
    'img': {
      src: talk.user.avatar_url
    },
    '.lnug-twitterhandle a': {
      innerHTML: '@' + talk.user.login,
      href: 'https://github.com/' + talk.user.login
    }
  }
};

function modelArchive(talk) {
  return {
    name: talk.user.login,
    url:  talk.user.url,
    title: talk.title
  };
};

function modelTalks(talks) {
  return talks.map(modelTalk);
};

function archive(talks) {
  var recentMonths = talks.reduce(function(dates, talk) {
    dates[talk.milestone.title] = modelArchive(talk);
    return dates;
  }, {});

  var newArchive = _.merge(old, recentMonths);
  fs.writeFile('./old.json', JSON.stringify(newArchive, null, 4));

};

superagent.get('https://api.github.com/repos/lnug/speakers/issues')
  .end(function(error, data) {
    if (error) {
      throw Error('Cannot Reach github', error);
      console.log(error);
    }
    var out = data.body.filter(onlyAccepted);

    archive(out);

    console.log(modelTalks(out));

    return;
    // we only have the github url of the creator, we need to fetch their name.
    var fetched = out.map(fetchName);

    out.map(function(talk) {
      return {
        title: talk.title,
        name: 'value',
        // username:
        // avatar:
        // desc:
        // date:
      }
    });

    console.log(fetched);
})
