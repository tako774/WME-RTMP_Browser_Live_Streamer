// coding:UTF-8（自動判別用文字列漢字）

// 配信サイズ,タイトル,twitterタグ
var broadcast_width  = 800 // movie width
var broadcast_height = 500 // movie height
var broadcast_title = "nanashi 放送局"; // 放送タイトル 例："〇〇放送局"
var hashtag = "nanashi_bc"; // 配信用の twitter ハッシュタグ 他の人とかぶらなければ何でもいいと思います

// 配信形式
// 'wmv' :WME/KTE/MEEで配信する場合
// 'rtmp':RTMP(OBS/XSplit/FME + Red5等)で配信する場合
var format = 'wmv' 

// 配信URL
// wmv 形式の場合の設定：鏡ツールで公開するURL推奨 例：http://xxx.xxx.xxx.xxx:10800/
var broadcast_url = 'http://xxx.xxx.xxx.xxx:10800/';  
// rtmp形式の場合の設定：rtmp_url に RTMP サーバーの URL, rtmp_channel にチャンネル名
var rtmp_url = 'rtmp://xxx.xxx.xxx.xxx/live';  
var rtmp_channel = "livestream";  

