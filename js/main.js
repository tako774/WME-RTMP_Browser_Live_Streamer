var tw;

$("document").ready(function() {
	if ((typeof format == 'undefined') || format == '') { format = 'wmv' } // デフォルト配信形式を wmv に設定

	var load_tweet_intarval_time = 15 * 1000; // tweet のポーリング間隔(msec)
	var load_description_interval = 15 * 1000; // 配信説明テキストのポーリング間隔(msec)
	var player_crtl_height = (format == 'wmv') ? 65 : 0; // WMP のコントロール部分の高さ(px)
	var side_width = 360; // 2カラムCSSの全体コンテナサイズのうち、main以外の部分
	var current_version = version; // 使用中のバージョン
	var TOOL_NAME = "WME/RTMPブラウザ配信ツール"; // ツール名
	var FLOW_PLAYER_JS_URL = "./js/flowplayer-3.2.13.min.js"
	var FLOW_PLAYER_SWF_URL = "./swf/flowplayer-3.2.18.swf";
	var FLOW_PLAYER_RTMP_URL = './swf/flowplayer.rtmp-3.2.13.swf'

	// 最新バージョン記述ファイルURL
	var latest_version_url = "http://tako774.net/tools/WME_Browser_Live_Streamer_latest_version.js";
	
	// 使用中バージョン表示
	$("#current_version").text(current_version);
		
	// 最新バージョン取得
	// 使用中のものより新しいバージョンが最新であれば、文字を表示
	$.getScript(latest_version_url, function() {
		var latest_version = version;
		if (latest_version > current_version) {
			$("#latest_version").text(" Ver." + latest_version);
		} else if (latest_version  == current_version) {
			$("#is_latest").text("(最新)");
		}
	});
	
	// 設定にもとづいた画面描画を実施
	function display_all() {
		// 放送タイトル表示
		$("title").text(broadcast_title + " - " + TOOL_NAME);
		$("#broadcast_title").text(broadcast_title);

		// 放送説明表示・ポーリング
		load_description();
		setInterval("load_description()", load_description_interval);
		
		// 配信エリアサイズ設定
		$("#player_wrapper").width(broadcast_width);
		$("#player_wrapper").height(broadcast_height + player_crtl_height);
		$("#container").width(broadcast_width + side_width)
		
    // player 表示
    if (format == 'wmv') {
      // IE以外にプラグイン誘導表示
      if (!$.browser.msie) {
        var plugin_msg = "";
        plugin_msg += "<a href=\"http://www.interoperabilitybridges.com/windows-media-player-firefox-plugin-download\" target=\"_blank\">";
        plugin_msg += "Windows Media Player プラグイン(IE以外用)のダウンロード<br />";
        plugin_msg += "インストールして、ブラウザを再起動すれば見られるはずです</a><br />";
        plugin_msg += "<br />";
        plugin_msg += "Firefox 21 以降の場合、更に以下の手順が必要です<br />";
        plugin_msg += "１．ロケーションバーに about:config と入力する<br />";
        plugin_msg += "２．plugins.load_appdir_plugins を検索し、true に値を変える<br />";
        plugin_msg += "３．ブラウザを再起動する<br />";
        plugin_msg += "（参考）<a href =\"http://support.mozilla.org/ja/kb/windows-media-or-other-plugins-stopped-working\">";
        plugin_msg += "Mozzila Support サイト"
        plugin_msg += "</a>";
        $("#plugin_invitation").html(plugin_msg);
        
        $("#plugin_invitation_footer").show();
      }
      
      // player の HTML 文字列生成
      // height は ShowControl で 65px あることを考慮する
      var player_html = "<object";
      player_html +=  " id='player_object'";
      player_html +=  " type='application/x-oleobject'";
      player_html +=  " width='" + broadcast_width + "'";
      player_html +=  " height='" + (broadcast_height + player_crtl_height) + "'";
      player_html +=  " classid='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6'";
      player_html +=  " standby='Loading Windows Media Player components...'";
      player_html += ">";

      player_html +=  "<param name='URL' value='" + broadcast_url +"' />";
      player_html +=  "<param name='autostart' value='true' />";
      player_html +=  "<param name='ShowControls' value='true' />";
      player_html +=  "<param name='ShowStatusBar' value='false' />";
      player_html +=  "<param name='ShowDisplay' value='false' />";

      player_html +=  "<embed";
      player_html +=  " id='player_embed'";
      player_html +=  " type='application/x-mplayer2'";
      player_html +=  " name='MediaPlayer'";
      player_html +=  " src='" + broadcast_url +"'";
      player_html +=  " width='" + broadcast_width + "'" ;
      player_html +=  " height='" + (broadcast_height + player_crtl_height) + "'" ;
      player_html +=  " showControls='1'";
      player_html +=  " showStatusBar='0'";
      player_html +=  " showDisplay='0'";
      player_html +=  " autostart='1' />";
      player_html += "</object>";
      
      $("#player").replaceWith(player_html);
      
      // Streaming URL 表示
      $("#broadcast_url").text(broadcast_url);
    
    } else if (format == 'rtmp') {
      
      // player の HTML 文字列生成
      var player_html = "<a";
      player_html +=   " id='rtmp_player'";
      player_html +=   " style='display:block;width:" + broadcast_width + "px;height:" + (broadcast_height + player_crtl_height) + "px'";
      player_html += ">";
      player_html += "</a>";

      // player を表示
      $("#player").replaceWith(player_html);
      $.getScript(FLOW_PLAYER_JS_URL, function() {
        $f("rtmp_player", FLOW_PLAYER_SWF_URL,{
          clip:{
            live: 'true',
            url: rtmp_channel,
            provider: 'rtmp'
          },
          plugins: {
            rtmp: {
              url: FLOW_PLAYER_RTMP_URL,
              netConnectionUrl: rtmp_url
            }
          }
        });
      });
      
      // Streaming URL 表示
      $("#broadcast_url").text(rtmp_url + "/" + rtmp_channel);
      
    } else {
      debug('エラー：config の format の設定値が正しくありません。');
    }

		// tweet 表示部のハッシュタグを書く
		var hashtag_url = "https://twitter.com/#!/search/%23" + hashtag;
		$("#hashtag_url").attr({href: hashtag_url});
		$("#tweet_result_desc").text("#" + hashtag);
		
		// twitter 残り書き込み可能文字数表示
    var show_twitter_rest_tweet_length = function() {
      var msg = $("#twitter_msg").val();
      var length = get_rest_tweet_length(msg, hashtag);
      $("#twitter_rest_tweet_length").text(length);
    }
    $('#twitter_msg').bind('textchange', function () {
      show_twitter_rest_tweet_length();
    });
    show_twitter_rest_tweet_length();

		// twitter 書き込みボタン
		$("#twitter_post").click(
			function() {
				// 書き込み内容取得、存在したら twitter 画面を開く
				var msg = $("#twitter_msg").val();
        var in_reply_to_status_id = $("#in_reply_to_status_id").val();
        var reply_to_user = $("#reply_to_user").val();
				if (msg != '') {
          // reply_to_user が本文になければ in_reply_to_status_id をクリア
          if (reply_to_user == "" || msg.indexOf(reply_to_user) < 0) {
            in_reply_to_status_id = "";
          }
          // API でツイート
          if (tw.isAuthorized()) {
            var status = msg.replace(/\n/g, " ") + " " + document.location.href + " #" + hashtag;
            tw.status_update(status, in_reply_to_status_id)
						$("#twitter_msg").val("");
						$("#twitter_msg").keyup();
          }
					// twitter 画面を開き、成功したら画面のメッセージをクリア
					else if (post_tweet(msg, hashtag)) {
						$("#twitter_msg").val("");
            $("#in_reply_to_status_id").val("");
            $("#reply_to_user").val("");
						$("#twitter_msg").keyup();
					}
				}
				// 書き込み欄にフォーカス
				document.getElementById("twitter_msg").focus();
			}
		);
		
		// 書き込み欄にフォーカス
		document.getElementById("twitter_msg").focus();
	}
	
	// URLにクエリが付いている場合は、クエリ文字列先のWME配信ツールをミラーする鏡モード
	// それ以外は通常配信モード
	if (location.search.length == 0) {
		// 通常配信モード
		display_all();
	} else {
		// 鏡モード
		// ミラー先の配信設定を取得して上書き
		// ただし、実際に配信するURLは、元の config.js のものを使って鏡配信にする
		var mirror_broadcast_url = broadcast_url;
		var mirror_broadcast_title = broadcast_title;
		var remote_url = location.search.slice(1);
		var remote_config_url = remote_url.replace(/\/[^\/]*$/, '') + "/config/config.js";
		
		$.getScript(remote_config_url, function() {
			broadcast_url = mirror_broadcast_url;
			$("#mirror_msg").text("鏡配信中！：配信元は「" + broadcast_title + "(" + remote_url + ")」です");
			broadcast_title = broadcast_title + " (mirroring by " + mirror_broadcast_title + ")";
			display_all();
		});
	}
	
  // Twitter API 初期設定
  tw = new TwitterAPI(twitter_consumer);
  var load_tweets_hashtag = function() { load_tweets(tw, hashtag) };
  tw.oauthToken = load('oauthToken');
  tw.oauthTokenSecret = load('oauthTokenSecret');
  tw.userId = load('userId');
  
  var load_tweet_interval;

  // Request Token 取得画面を開くボタンに、関数紐付け
  $("#open_request_token_window").click(
    function() {
      window.open(tw.getRequestTokenUrl());
      $("#request_token_response").removeAttr("disabled");
      $("#request_token_response").focus();
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#request_token_response_text").css("font-weight", "bold");
    }
  );
  // Request Token 画面レスポンス入力欄が入力されたら、認証画面を開くボタンを有効化
  $('#request_token_response').bind('textchange', function (event, previousText) {
    if ($("#request_token_response").val() != "") {
      $("#open_authorize_window").removeAttr("disabled");
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#open_authorize_window_text").css("font-weight", "bold");
    } else {
      $("#open_authorize_window").attr("disabled", "disabled");
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#request_token_response_text").css("font-weight", "bold");
    }
  });
  // 認証画面を開くボタンに関数紐付け
  $("#open_authorize_window").click(
    function() {
      tw.parseRequestTokenResponse($("#request_token_response").val());
      window.open(tw.getAuthorizeUrl());
      $("#pin").removeAttr("disabled");
      $("#pin").focus();
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#pin_text").css("font-weight", "bold");
    }
  );
  // PIN 入力欄が正しく入力されたら、Access Token 取得画面を開くボタンを有効化
  $('#pin').bind('textchange', function (event, previousText) {
    var pin = $("#pin").val();
    if (/[0-9]{7}/.test(pin)) {
      $("#open_access_token_window").removeAttr("disabled");
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#open_access_token_window_text").css("font-weight", "bold");
    } else {
      $("#open_access_token_window").attr("disabled", "disabled");
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#pin_text").css("font-weight", "bold");
    }
  });
  
  // Access Token 取得画面を開くボタンに、関数紐付け
  $("#open_access_token_window").click(
    function() {
      var pin = $("#pin").val();
      window.open(tw.getAccessTokenUrl(pin));
      $("#access_token_response").removeAttr("disabled");
      $("#access_token_response").focus();
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#access_token_response_text").css("font-weight", "bold");
    }
  );
  // Access Token Response が入力されたら、Twitter 連携完了！ボタンを有効化
  $('#access_token_response').bind('textchange', function (event, previousText) {
    if ($("#access_token_response").val() != "") {
      $("#set_access_token_response").removeAttr("disabled");
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#set_access_token_response_text").css("font-weight", "bold");
    } else {
      $("#set_access_token_response").attr("disabled", "disabled");
      $("#twitter_authorize > li").css("font-weight", "normal");
      $("#access_token_response_text").css("font-weight", "bold");
    }
  });
  // Twitter 連携完了！ボタンに関数紐付け
  $("#set_access_token_response").click(
    function() {
      var access_token_response = $("#access_token_response").val();
      tw.parseAccessTokenResponse(access_token_response);
      if (tw.isAuthorized()) {
        save('oauthToken', tw.oauthToken);
        save('oauthTokenSecret', tw.oauthTokenSecret);
        save('userId', tw.userId);
        $("#twitter_authorize").hide();
        // 検索結果のリロード開始
        $("#twitter_results").show();
        $("#twitter_reauthorize").show();
        load_tweets_hashtag();
        load_tweet_interval = setInterval(load_tweets_hashtag, load_tweet_intarval_time);
      }
    }
  );
  
  function showTwitterAuthorize() {
    $("#twitter_results").empty();
    $("#twitter_results").hide();
    $("#twitter_authorize").show();
    $("#twitter_authorize > li").css("font-weight", "normal");
    $("#open_request_token_window_text").css("font-weight", "bold");
  }
  
  if (tw.isAuthorized()) {
    // Twitter 認証済みであれば、ツイート検索結果を表示
    $("#twitter_results").show();
    $("#twitter_reauthorize").show();
    load_tweets_hashtag();
    load_tweet_interval = setInterval(load_tweets_hashtag, load_tweet_intarval_time);
  } else {
    // Twitter 認証済みでなければ、認証取得欄を表示
    showTwitterAuthorize();
  }
  
  // Twitter 再認証ボタンに関数ヒモ付
  $("#twitter_reauthorize").click(
    function() {
      // 検索結果のリロード停止
      clearInterval(load_tweet_interval);
      $("#twitter_reauthorize").hide();
      showTwitterAuthorize();
    }
  );
    
});
