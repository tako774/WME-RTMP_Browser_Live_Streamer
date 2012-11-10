// Twitter API クラス
// 下記の oauth.js, sha1.js が必要
// http://code.google.com/p/oauth/

function TwitterAPI(consumer) {
  this.consumer = consumer;
}

TwitterAPI.prototype.API_BASE_URL = "https://api.twitter.com/"
TwitterAPI.prototype.API_VERSION = 1.1
TwitterAPI.prototype.post_sequence = 0
TwitterAPI.prototype.requestToken = '';
TwitterAPI.prototype.requestTokenSecret = '';
TwitterAPI.prototype.accessToken = '';
TwitterAPI.prototype.accessTokenSecret = '';

// Request Token, Request Token Secret 取得画面URLを返す
TwitterAPI.prototype.getRequestTokenUrl = function() {
  var accessor = {
    consumerSecret: this.consumer.consumerSecret,
    consumerKey: this.consumer.consumerKey,
    tokenSecret: ''
  };
  var message = {
    method: "GET",
    action: this.API_BASE_URL + "oauth/request_token",
    parameters: {
      oauth_signature_method: "HMAC-SHA1",
      oauth_consumer_key: this.consumer.consumerKey,
      oauth_callback: "oob"
    }
  };
  
  // シグニチャ作成
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  
  // Request Token 画面 URL 生成
  return OAuth.addToURL(message.action, message.parameters);
  /*
  var options = {
    type: message.method,
    url: request_token_url,
    success: function(data, dataType) {
      debug(data);
    },
  };
  $.ajax(options); // 送信
  */
};

// Request Token のレスポンス結果の取り込み
TwitterAPI.prototype.parseRequestTokenResponse = function(response_text) {
  var params = parseQueryString(response_text);
  if (params['oauth_token'] && params['oauth_token'] != '') {
    this.requestToken = params['oauth_token'];
  }
  if (params['oauth_token_secret'] && params['oauth_token_secret'] != '') {
    this.requestTokenSecret = params['oauth_token_secret'];
  }
}

// クエリストリングをパースしてオブジェクトを返す
// 同一キーがあった場合は後勝ち、配列としては返さない
function parseQueryString(query_str) {
  var item = new Array;
  var params = new Array;
  var pairs = query_str.split('&');
  
  for (var i = 0; i < pairs.length; i++) {
    item = pairs[i].split("=");
    if (item[0] != ''){
      params[item[0]] = typeof (item[1]) == 'undefined' ? true : item[1];
    }
  }
  return params;
}

// ユーザーアクセス許可画面の URL を取得
TwitterAPI.prototype.getAuthorizeUrl = function() {
  return this.API_BASE_URL + "oauth/authorize?oauth_token=" + this.requestToken;
}

// Access Token, Access Token Secret 取得画面の URL を取得
TwitterAPI.prototype.getAccessTokenUrl = function(pin) {
  var accessor = {
    consumerSecret: this.consumer.consumerSecret,
    tokenSecret: this.requestTokenSecret
  };
  var message = {
    method: "GET",
    action: this.API_BASE_URL + "oauth/access_token",
    parameters: {
      oauth_signature_method: "HMAC-SHA1",
      oauth_consumer_key: this.consumer.consumerKey,
      oauth_token: this.requestToken,
      oauth_verifier: pin
    }
  };
  
  // シグニチャ作成
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  
  // Access Token 画面 URL を生成
  return OAuth.addToURL(message.action, message.parameters);
  /*
  var options = {
    type: message.method,
    url: access_token_url,
    success: function(data, dataType) {
      debug(data);
    },
  };
  $.ajax(options); // 送信
  */
};

// Access Token のレスポンス結果の取り込み
TwitterAPI.prototype.parseAccessTokenResponse = function(response_text) {
  var params = parseQueryString(response_text);
  if (params['oauth_token'] && params['oauth_token'] != '') {
    this.oauthToken = params['oauth_token'];
  }
  if (params['oauth_token_secret'] && params['oauth_token_secret'] != '') {
    this.oauthTokenSecret = params['oauth_token_secret'];
  }
  if (params['user_id'] && params['user_id'] != '') {
    this.userId = params['user_id'];
  }
}

// Twitter 認証済み確認
TwitterAPI.prototype.isAuthorized = function() {
  return (
    this.oauthToken && this.oauthToken != '' &&
    this.oauthTokenSecret && this.oauthTokenSecret != '' &&
    this.userId && this.userId != ''
  )
}

// ツイートする
TwitterAPI.prototype.status_update = function(status, in_reply_to_status_id) {
  var content = { status: status };
  if (in_reply_to_status_id && in_reply_to_status_id != '') {
    content.in_reply_to_status_id = in_reply_to_status_id;
  }
  this._exec("POST", "statuses/update.json", content);
}

// ツイートを検索する
TwitterAPI.prototype.search_tweet = function(keyword, callback, option) {
  var content = { q: keyword, callback: callback };
  for ( var key in option ) {
    content[key] = option[key];
  }
  this._exec("GET", "search/tweets.json", content);
}

// リツイートする
TwitterAPI.prototype.status_retweet = function(status_id, option) {
  var content = { id: status_id };
  for ( var key in option ) {
    content[key] = option[key];
  }
  this._exec("POST", "statuses/retweet/" + status_id + ".json", content);
}

// ツイートをふぁぼる
TwitterAPI.prototype.favorites_create = function(status_id, option) {
  for ( var key in option ) {
    content[key] = option[key];
  }
  this._exec("POST", "favorites/create.json", content);
}

// ツイートのふぁぼ解除
TwitterAPI.prototype.favorites_destroy = function(status_id, option) {
  var content = {};
  for ( var key in option ) {
    content[key] = option[key];
  }
  this._exec("POST", "favorites/destroy.json", content);
}

// 汎用 API 実行関数
// GET で JSONP の結果を取る場合
// content の callback プロパティを呼び出し側が指定すること
// - jquery は動的に callback を設定してしまうので、
//   oauth_signature が正しく生成できなくなることから使用していない
TwitterAPI.prototype._exec = function(method, access_point, content) {
  var resource_url = this.API_BASE_URL + this.API_VERSION + "/" + access_point;
  
  var accessor = {
    consumerSecret: this.consumer.consumerSecret,
    tokenSecret: this.oauthTokenSecret
  };
 
  var message = {
    method: method,
    action: resource_url,
    parameters: {
      oauth_signature_method: "HMAC-SHA1",
      oauth_consumer_key: this.consumer.consumerKey,
      oauth_token: this.oauthToken
    }
  };
  
  for ( var key in content ) {
    message.parameters[key] = content[key];
  }
  
  // シグニチャ作成
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  
  // twitter への通信実行
  if (message.method == "POST") {
    xpost(resource_url, message.parameters);
  }
  else if (message.method == "GET") {
    var target_url = OAuth.addToURL(message.action, message.parameters);
    exec_external_script(target_url);
  }
  
  return true;
}
