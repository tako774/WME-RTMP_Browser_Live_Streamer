// 配信説明をサーバーから読み込んで表示
function load_description() {
	$.get("config/description.txt", function (desc_dat) {
		var description = "";
		var lines = desc_dat.split(/\r\n|\r|\n/);
		
		// 行頭が // または # であればコメント行扱いとし表示しない
		$.each(lines, function() {
			if (!this.match(/^(\/\/|\#)/)) {
				description += this + "\n";
			}
		});
		
		$("#description").text(description);
	});
}
