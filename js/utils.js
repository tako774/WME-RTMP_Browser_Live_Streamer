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

function debug(msg) {
	p = document.createElement("p");
	p.innerHTML = getTimeStr(new Date()) + " " + msg
	$("#debug").prepend(p);
}

function xmlUnescape(s) {
	s = s.replace(/&amp;/g, "&");
	s = s.replace(/&gt;/g , ">");
	s = s.replace(/&lt;/g , "<");
	s = s.replace(/&apos;/g, "\'");
	s = s.replace(/&quot;/, "\"");
	return s;
}

function urlDecode2f(s) {
	return s.replace(/%2f/gi, "/");
}
