// 同一の日かどうか、ローカル時間で比較して返す
function isSameDate(date1, date2) {
	return (
		date1.getFullYear() == date2.getFullYear() &&
		date1.getMonth() == date2.getMonth() &&
		date1.getDate() == date2.getDate()
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
function debug(msg) {
	p = document.createElement("p");
	p.innerHTML = getTimeStr(new Date()) + " " + msg
	$("#debug").prepend(p);
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
