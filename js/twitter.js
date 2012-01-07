// 特定ハッシュタグのデータを取得する
function load_tweets(hashtag) {
	var last_ID = $(".tweet_result:first").attr("ID");
	var hashtag_regexp = new RegExp("\\W#" + hashtag +"(\\W|$)", "g");
	var max_display_tweet_nums = 1000;
	
	if (last_ID) {
		last_ID = last_ID.replace("tweet_", "");
		var url = "http://search.twitter.com/search.json?q=%23" + hashtag + "&since_id=" + last_ID + "&result_type=recent&include_entities=true&callback=?";
	} else {
		var url = "http://search.twitter.com/search.json?q=%23" + hashtag + "&rpp=100&result_type=recent&include_entities=true&callback=?"; 
	}
	
	$.getJSON(url, function(json) { 
		var results = '';
		var reply_ids = new Array();
		$(json.results).each(function() {
			if (this.id_str == undefined || this.id_str == last_ID) return;
			var created_date = new Date(this.created_at);
			var created_at_str = ""
			var reply_id = "reply_" + this.id_str;
			var urls = new Array();
			if (this.entities) {
				urls = this.entities.urls;
			}
			var text = this.text;
			
			//// 表示内容を修正
			// 短縮URLを展開
			$(urls).each(function() {
				text = text.replace(this.url, this.expanded_url);
			});
			// 放送ハッシュタグと放送URLを削除
			text = text.replace(hashtag_regexp, '').replace(" " + document.location.href, '')
			// ハイパーリンク化
			text = linkify(text);
			
			// リプライ一覧を取得
			reply_ids.push(reply_id);
			
			// 日付文字列生成
			if (isSameDate(created_date, new Date())) {
				created_at_str = getTimeStr(created_date);
			} else {
				created_at_str = getDateTimeStr(created_date);
			}
			
			// ツイートHTMLを生成
			results += "<p class='tweet_result' id='tweet_" + this.id_str + "'>";
			results += 	"<a href='http://twitter.com/" + this.from_user + "' class='tweet_user'>";
			results += 		"<img width='24' height='24' alt='" + this.from_user + " on Twitter' src='" + this.profile_image_url + "' />";
			results += 	"</a>";
			results += 	text;
			results += 	" - ";
			results += 	"<a href='http://twitter.com/" + this.from_user + "' class='tweet_user' target='_blank'>";
			results += 	"@" + this.from_user;
			results += 	"</a>";
			results += 	created_at_str;
			results += 	" <a id='" + reply_id + "' title='@" + this.from_user + "'>返信</a>";
			results += 	" <a href='https://twitter.com/intent/retweet?tweet_id=" + this.id_str +"' target='_blank'>RT</a>";
			results += 	" <a href='https://twitter.com/intent/favorite?tweet_id=" + this.id_str +"' target='_blank'>fav</a>";
			results += "</p>";
			results += "<hr />";
		});
		$("#twitter_results").prepend(results);
		
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
					}
				}
				document.getElementById("twitter_msg").focus();
			});
		});
		
	});

	$(".tweet_result:gt(" + max_display_tweet_nums + ")").remove();
}

//書き込み内容を渡して、twitter 画面を開く
function post_tweet(msg, hashtag) {
		var tweet_post_window = "tweet_" + hashtag;
		var tweet_post_url = "https://twitter.com/intent/tweet?";
		var in_reply_to_status_id = $("#in_reply_to_status_id").val();
		tweet_post_url += "hashtags=" + hashtag + "%2C";
		tweet_post_url += "&original_referer=" + encodeURIComponent(document.location.href);
		tweet_post_url += "&source=tweetbutton";
		tweet_post_url += "&url=" + encodeURIComponent(document.location.href);
		tweet_post_url += "&text=" + encodeURIComponent(msg);
		if (in_reply_to_status_id != "") {
			tweet_post_url += "&in_reply_to_status_id=" + in_reply_to_status_id;
		}
		
		// twitter 画面を開き、window.open の戻り値をそのまま返す
		// window.open が成功してれば、in_reply_to_status_id はクリア
		var tweet_window = window.open(tweet_post_url, tweet_post_window);
		if (tweet_window) {
			$("#in_reply_to_status_id").val("");
		}
		return tweet_window;
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
