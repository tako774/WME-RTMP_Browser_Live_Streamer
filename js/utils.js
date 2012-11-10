// 同一の日かどうか、ローカル時間で比較して返す
function isSameDay(date1, date2) {
	return (
		date1.getFullYear() == date2.getFullYear() &&
		date1.getMonth() == date2.getMonth() &&
		date1.getDate() == date2.getDate()
	)
}

// 同一の月かどうか、ローカル時間で比較して返す
function isSameMonth(date1, date2) {
	return (
		date1.getFullYear() == date2.getFullYear() &&
		date1.getMonth() == date2.getMonth()
	)
}

// 同一の年かどうか、ローカル時間で比較して返す
function isSameYear(date1, date2) {
	return (
		date1.getFullYear() == date2.getFullYear()
	)
}

function getDateTimeStr(date) {
	return getDateStr(date) + " " + getTimeStr(date);
}

function getDateStr(date) {
	var month = date.getMonth() + 1;
	var day   = date.getDate();

	// if (month < 10) { month = "0" + month; }
	if (day   < 10) { day   = "0" + day; }

	return month + '/' + day;
}

function getTimeStr(date) {
	var hour = date.getHours();
	var min  = date.getMinutes();
	var sec  = date.getSeconds();

	// if (hour < 10) { hour = "0" + hour; }
	if (min  < 10) { min  = "0" + min;  }
	if (sec  < 10) { sec  = "0" + sec;  }

	return hour + ':' + min + ':' + sec;
}

// デバッグメッセージ表示
function debug(obj) {
  var msg;
  if (typeof(obj) == "object") {
    msg = JSON.stringify(obj)
  } else {
    msg = obj;
  }
  var $msg = $("<p />").text(getTimeStr(new Date()) + " " + msg)
  $("#debug").prepend($msg);
}

// HTMLエスケープ
function html_escape(str) {
	var map = {
		"<":"&lt;",
		">":"&gt;",
		"&":"&amp;",
		"'":"&#39;",
		"\"":"&quot;",
		" ":"&nbsp;"
	};
	var replaceStr = function(s) { return map[s]; };
	return str.replace(/<|>|&|'|"|\s/g, replaceStr);
}

// データ保存
function save(key, value) {
  var option = {
    expires: 365,
    path: location.pathname.replace(/[^\/]*$/, '')
  }
  $.cookie(key, value, option)
}

// データロード
function load(key) {
  return $.cookie(key);
}

// クロスドメインPOST
var post_sequence;
function xpost(url, content) {
  var target = "xpost_" + post_sequence;
  post_sequence += 1;
  
  // POST用のフォームを生成
  var $form = $('<form />').attr({
    action : url,
    method : "POST",
    target : target
  }).css("display", "none");
  for (var key in content) {
    $form.append($('<textarea />').attr("name", key).val(content[key]));
  }
  $("body").append($form);
  
  // formのtargetとなるiframeを生成
  var $iframe = $('<iframe />').attr({
    name : target,
    src : "about:blank"
  }).css("display", "none");
  
  var is_not_posted = true;
  $iframe.load(function() {
    if (is_not_posted) {
      // iframe が生成されたらサブミットする
      setTimeout(function() { $form.submit(); }, 0);
      is_not_posted = false;
    } else {
      // iframe にサブミット結果がロードされたら、form, iframe ともに破棄する
      $form.remove();
      $iframe.remove();
    }
  });
  
  $("body").append($iframe);
}

// 外部スクリプト実行
// OAuth での GET jsonp リクエスト実行用
function exec_external_script(url) {
  $("body").append(
    $("<script />").attr({
      src : url,
      type: "application/javascript",
      charset: "UTF-8"
    })
  );
}
