// 特定ハッシュタグのデータを取得する
function load_tweets(tw, hashtag) {
  var option = {
    result_type: "recent",
    include_entities: "true",
    count: 100
  };
  var last_id = $(".tweet_result:first").attr("id");
  if (last_id) {
    last_id = last_id.replace("tweet_", "");
    last_created_date = new Date($("#tweet_date_" + last_id).attr("title"));
    option.since_id = last_id;
  }
  tw.search_tweet("#" + hashtag, "load_tweets_callback", option);
}

function load_tweets_callback(result) {
  var last_id = $(".tweet_result:first").attr("id");
  var last_created_date = null;
  var hashtag_regexp = new RegExp("\\W#" + hashtag +"$");
  var max_display_tweet_nums = 1000;
  var TWEET_SPLIT_DIRATION_SEC = 8 * 60 * 60 // この秒数以上離れたツイート間の線は強調する
  var HTTP_URL_REGEXP_STR = "https?:\\/\\/[-_.!~*\\'()a-zA-Z0-9;\\/?:\\@&=+\\$,%#]+"; // HTTP[S]のURL正規表現文字列
  var now = new Date();
  
  // 配信元URL、ツイートに含まれる配信URLの生成
  var parent_url = document.location.href.replace(/^[^?]+\?/, '');
  var bc_url_regexp = new RegExp(" " + "(" + HTTP_URL_REGEXP_STR + "?\\?" + parent_url + ")");

  // 最終取得済み発言時刻を取得
  if (last_id) {
    last_id = last_id.replace("tweet_", "");
    last_created_date = new Date($("#tweet_date_" + last_id).attr("title"));
  }

  var results = '';
  var reply_ids = new Array();
  var retweet_ids = new Array();
  var retweeted_ids = new Array();
  var fav_create_ids = new Array();
  var fav_destroy_ids = new Array();
  
  // 古い方のツイートから処理するようソートしてからHTML化
  $(result.statuses).sort(function(a, b) {
    var a_date = new Date(a.created_at.replace(/(\d+:\d+:\d+ \+\d+) (\d+)/, "$2 $1"));
    var b_date = new Date(b.created_at.replace(/(\d+:\d+:\d+ \+\d+) (\d+)/, "$2 $1"));
    if (a_date == b_date) return  0;
    if (a_date > b_date)  return  1;
    if (a_date < b_date)  return  -1;
  }).each(function() {
    if (this.id_str == undefined || this.id_str == last_id || (/^RT /i).test(this.text)) return;
    // IE だけ解釈に失敗するので補正
    // Sat Nov 10 10:04:18 +0000 2012 → Sat Nov 10 2012 10:04:18 +0000
    var created_date = new Date(this.created_at.replace(/(\d+:\d+:\d+ \+\d+) (\d+)/, "$2 $1"));
    var reply_id = "reply_" + this.id_str;
    var retweet_id = "retweet_" + this.id_str;
    var retweeted_id = "retweeted_" + this.id_str;
    var fav_create_id = "fav_create_" + this.id_str;
    var fav_destroy_id = "fav_destroy_" + this.id_str;
    var status_url = "http://twitter.com/" + this.user.screen_name + "/status/" + this.id_str;
    var urls = new Array();
    var text = this.text;
    var result = "";
    var mirror_url = "";
    
    if (this.entities) urls = this.entities.urls;
    if (!last_created_date) last_created_date = created_date;
    
    //// ツイート表示内容を修正
    // 本文の短縮URLを展開
    $(urls).each(function() {
      if (this.expanded_url) {
        text = text.replace(this.url, this.expanded_url);
      }
    });
    // 本文から放送ハッシュタグを削除
    text = text.replace(hashtag_regexp, '')
    // 本文から鏡の放送URLを削除、存在したら記録
    text = text.replace(bc_url_regexp, '')
    mirror_url = RegExp.$1;
    // 本文から配信親の放送URLを削除
    text = text.replace(" " + parent_url, '')
    // 本文のハイパーリンク化
    text = linkify(text);
    
    // リプライIDの一覧に入れる
    reply_ids.push(reply_id);
    // retweet ID の一覧に入れる
    retweet_ids.push(retweet_id);
    retweeted_ids.push(retweeted_id);
    // fav IDの一覧に入れる
    fav_create_ids.push(fav_create_id);
    fav_destroy_ids.push(fav_destroy_id);
    
    // ツイートHTMLを生成
    if (now - created_date >= TWEET_SPLIT_DIRATION_SEC * 1000) {
      result += "<div class='tweet_result tweet_old' id='tweet_" + this.id_str + "'>";
    } else {
      result += "<div class='tweet_result' id='tweet_" + this.id_str + "'>";
    }
    
    // アイコン・名前部分
    result += "<div class='tweet_user_info'>";
    result += 	"<a href='http://twitter.com/" + this.user.screen_name + "' class='tweet_user_link'>";
    result += 		"<img width='24' height='24' alt='" + this.user.screen_name + " on Twitter' src='" + this.user.profile_image_url + "' />";
    result += 	"</a>";
    result +=   "<span class='tweet_user'>";
    result +=     this.user.name;
    result +=     " ";
    result +=     "<a href='http://twitter.com/" + this.user.screen_name + "' class='tweet_user_link' target='_blank'>";
    result +=     "@" + this.user.screen_name;
    result +=     "</a>";
    result +=   "</span>";
    result += "</div>";
    
    // 時刻部分
    result += "<div class='tweet_date_info'>";
    result += 	"<a href='" + status_url + "' target='_blank' class='tweet_date' id='tweet_date_" + this.id_str + "' title='" + created_date + "'></a>";
    result += "</div>";
    
    // ツイート部分
    result += "<div class='tweet_body'>";
    result += 	text;
    result += 	" ";
    result += 	" <a id='" + reply_id + "' title='@" + this.user.screen_name + "'>返信</a>";
    result += 	" <a id='" + retweet_id + "' title='retweet'>RT</a>";
    result += 	" <span id='" + retweeted_id + "' class='tweet_finished' title='retweeted' style='display:none'>RT済</span>";
    result += 	" <a id='" + fav_create_id + "' title='favorite'>fav</a>";
    result += 	" <a id='" + fav_destroy_id + "' title='favorite destroy' style='display: none'>fav済★</a>";
    if (mirror_url == '' && document.location.href != parent_url) {
      result += 	" <a href='" + parent_url +"' target='_blank'>親</a>";
    }
    if (mirror_url != '' && mirror_url != document.location.href) {
      result += 	" <a href='" + mirror_url +"' target='_blank'>鏡</a>";
    }
    result += "</div>";
    
    result += "</div>";
    if (created_date - last_created_date >= TWEET_SPLIT_DIRATION_SEC * 1000) {
      result += "<hr /><hr />";
    } else {
      result += "<hr />";
    }
    
    last_created_date = created_date;
    
    results = result + results;
  });
  $("#twitter_results").prepend(results);
  
  // 書き込み時刻文字列を表示
  $(".tweet_date").each(function() {
    var tweet_date = new Date($(this).attr('title'));
    var tweet_date_str = getTwitterDateStr(tweet_date, now);
    $(this).text(tweet_date_str);
  });
  
  // 返信をクリックで書き込み欄にリプライ先を追加
  $.each(reply_ids, function() {
    var reply_id = this;
    var reply_to_user = $("#" + reply_id).attr("title");
    $("#" + reply_id).click(function() {
      org_msg = $("#twitter_msg").val();
      reply_regexp = new RegExp('(^|\\W)' + reply_to_user + '(\\W|$)', '');
      if (!org_msg.match(reply_regexp)) {
        if (org_msg.match(/@\w+/)) {
          $("#twitter_msg").val("." + reply_to_user + " " + org_msg);
        } else {
          $("#twitter_msg").val(reply_to_user + " " + org_msg);
          $("#in_reply_to_status_id").val(reply_id.replace("reply_", ""));
          $("#reply_to_user").val(reply_to_user);
        }
      }
      document.getElementById("twitter_msg").focus();
    });
  });
  
  // RT をクリックでリツイート
  $.each(retweet_ids, function() {
    var retweet_id = this;
    var retweet_status_id = retweet_id.replace("retweet_", "");
    var retweeted_id = "retweeted_" + retweet_status_id;
    $("#" + retweet_id).click(function() {
      tw.status_retweet(retweet_status_id);
      $("#" + retweet_id).hide();
      $("#" + retweeted_id).show();
    });
  });
  
  
  // fav をクリックでお気にいりに追加
  $.each(fav_create_ids, function() {
    var fav_create_id = this;
    var favorite_status_id = fav_create_id.replace("fav_create_", "");
    var fav_destroy_id = "fav_destroy_" + favorite_status_id;
    $("#" + fav_create_id).click(function() {
      tw.favorites_create(favorite_status_id);
      $("#" + fav_create_id).hide();
      $("#" + fav_destroy_id).show();
    });
  });
  
  // fav をクリックでお気にいりを解除
  $.each(fav_destroy_ids, function() {
    var fav_destroy_id = this;
    var favorite_status_id = fav_destroy_id.replace("fav_destroy_", "");
    var fav_create_id = "fav_create_" + favorite_status_id;
    $("#" + fav_destroy_id).click(function() {
      tw.favorites_destroy(favorite_status_id);
      $("#" + fav_destroy_id).hide();
      $("#" + fav_create_id).show();
    });
  });
  
  $(".tweet_result:gt(" + max_display_tweet_nums + ")").remove();
}

// 残り書き込み可能な文字数を返す
function get_rest_tweet_length(msg, hashtag) {
	var twitter_short_url_length = 20;
	var max_tweet_length = 140 - (hashtag.length + twitter_short_url_length + 3);
	var url_regexp = /(https?:\/\/[\w\-:;?&=+.%#\/]+)/gi;
	
	var url_strs = msg.match(url_regexp) || new Array();
	var msg_url_deleted = msg.replace(url_regexp, '');
	return max_tweet_length - (msg_url_deleted.length + twitter_short_url_length * url_strs.length);
}

// URLらしき文字列にaタグでハイパーリンクをつける
function linkify(text) {
    // modified from TwitterGitter by David Walsh (davidwalsh.name)
    // courtesy of Jeremy Parrish (rrish.org)
    return text.replace(/(https?:\/\/[\w\-:;?&=+.%#\/]+)/gi, '<a href="$1" target="_blank">$1</a>')
               .replace(/(^|\W)@(\w+)/g, '$1<a href="http://twitter.com/$2" target="_blank">@$2</a>')
               .replace(/(^|\W)#(\w+)/g, '$1#<a href="http://search.twitter.com/search?q=%23$2" target="_blank">$2</a>');
}

// Twitter 表示用の時間を返す
// baseDate には現在時刻など基準時刻を渡す
// 1分以内→○秒
// 1時間以内→○分
// 24時間以内だったら→○時間
// 同じ年だったら→○月○○日
// 違う年だったら→○年○月○日
function getTwitterDateStr(date, baseDate) {
  if (baseDate - date < 60 * 1000) {
    return Math.floor((baseDate - date) / 1000) + "秒";
  } else if (baseDate - date < 60 * 60 * 1000) {
    return Math.floor((baseDate - date) / (60 * 1000)) + "分";
  } else if (baseDate - date < 60 * 60 * 24 * 1000) {
    return Math.floor((baseDate - date) / (60 * 60 * 1000)) + "時間";
  } else if (date.getFullYear() == baseDate.getFullYear()) {
    return (date.getMonth() + 1) + "月" + date.getDate() + "日";
  } else {
    return (date.getYear() + 1900) + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
  }
}
