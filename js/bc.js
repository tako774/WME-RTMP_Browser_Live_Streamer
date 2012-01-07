// 配信説明をサーバーから読み込んで表示
function load_description() {
	$.get("config/description.txt", function (description) {
		$("#description").text(description);
	});
}
