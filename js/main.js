$("document").ready(function() {
	var load_tweet_intarval = 15 * 1000; // tweet のポーリング間隔(msec)
	var load_description_interval = 10 * 1000; // 配信説明テキストのポーリング間隔(msec)
	var player_crtl_height = 65; // WMP のコントロール部分の高さ(px)
	var side_width = 360; // 2カラムCSSの全体コンテナサイズのうち、main以外の部分

	// 放送タイトル表示
	$("title").text(broadcast_title);
	$("#broadcast_title").text(broadcast_title);

	// 放送説明表示・ポーリング
	load_description();
	setInterval("load_description()", load_description_interval);
	
	// Streaming URL 表示
	$("#broadcast_url").text(broadcast_url);
	
	// 配信エリアサイズ設定
	$("#player_wrapper").width(broadcast_width);
	$("#player_wrapper").height(broadcast_height + player_crtl_height);
	$("#container").width(broadcast_width + side_width)
	
	// IE以外にプラグイン誘導表示
	if (!$.browser.msie) {
		$("#plugin_invitation").text("Windows Media Player プラグイン(IE以外用)のダウンロード");
	}
	
	// player の HTML 文字列生成
	// height は ShowControl で 65px あることを考慮する
	var object_html = "<object";
	object_html +=  " id='player_object'";
	object_html +=  " type='application/x-oleobject'";
	object_html +=  " width='" + broadcast_width + "'";
	object_html +=  " height='" + (broadcast_height + player_crtl_height) + "'";
	object_html +=  " classid='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6'";
	object_html +=  " standby='Loading Windows Media Player components...'";
	object_html += ">";

	object_html +=  "<param name='URL' value='" + broadcast_url +"' />";
	object_html +=  "<param name='autostart' value='true' />";
	object_html +=  "<param name='ShowControls' value='true' />";
	object_html +=  "<param name='ShowStatusBar' value='false' />";
	object_html +=  "<param name='ShowDisplay' value='false' />";

	object_html +=  "<embed";
	object_html +=  " id='player_embed'";
	object_html +=  " type='application/x-mplayer2'";
	object_html +=  " name='MediaPlayer'";
	object_html +=  " src='" + broadcast_url +"'";
	object_html +=  " width='" + broadcast_width + "'" ;
	object_html +=  " height='" + (broadcast_height + player_crtl_height) + "'" ;
	object_html +=  " showControls='1'";
	object_html +=  " showStatusBar='0'";
	object_html +=  " showDisplay='0'";
	object_html +=  " autostart='1' />";
	object_html += "</object>";

	// player を表示
	$("#player").replaceWith(object_html);
	
	// tweet 表示部のハッシュタグを書く
	var hashtag_url = "https://twitter.com/#!/search/%23" + hashtag;
	$("#hashtag_url").attr({href: hashtag_url});
	$("#tweet_result_desc").text("#" + hashtag);
	
	// twitter 読み込み・ポーリング
	load_tweets(hashtag);
	setInterval("load_tweets('" + hashtag + "')", load_tweet_intarval);
	
	// twitter 残り書き込み可能文字数表示
	$("#twitter_msg").keyup(
		function() {
			var msg = $("#twitter_msg").val();
			var length = get_rest_tweet_length(msg, hashtag);
			$("#twitter_rest_tweet_length").text(length);
		}
	);
	$("#twitter_msg").keyup();

	// twitter 書き込みボタン
	$("#twitter_post").click(
		function() {
			// 書き込み内容取得、存在したら twitter 画面を開く
			var msg = $("#twitter_msg").val();
			if (msg != '') {
				// twitter 画面を開き、成功したら画面のメッセージをクリア
				if (post_tweet(msg, hashtag)) {
					$("#twitter_msg").val("");
					$("#twitter_msg").keyup();
				}
			}
			// 書き込み欄にフォーカス
			document.getElementById("twitter_msg").focus();
		}
	);
	
	// 書き込み欄にフォーカス
	document.getElementById("twitter_msg").focus();
});
