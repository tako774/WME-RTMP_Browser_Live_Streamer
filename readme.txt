NAME: WME Browser Live Streamer (WMEブラウザ配信ツール)
Author: nanashi (@tako774)
Lisence: NYSL (同梱のNYSL.txtを参照)
Version: 0.06
Date: 2012/05/22

○概要
- javascript しか使っていない、ブラウザで使えるライブストリーミング配信ツールです
- WME/MEE/KTE など、Windows Media Player で視聴できるエンコーダーであれば、なんでも使えます
- twitter と連携できます
- 配信内容説明テキスト(config/description.txt の内容)は、
  視聴者のリロード無しで更新されます(Ver.0.02より)
- 鏡モード
　他のWMEブラウザ配信ツールの配信を鏡する際に、検索ハッシュタグなどを相手の設定にする機能
　自分の配信URLの後ろに"?<配信元のWMEブラウザ配信ツールのURL>"をつけるだけで使えます
　	http://<自分の配信ツールのURL>?http://tako774.net/bc/
　にブラウザでアクセスしてみると、どういうことかわかると思います。

○使い方（通常配信時）

0.HTMLがアップロードできるサーバーを確保します（無料サーバーでも構いません）

1.config/config_model.js をコピーして config/config.js を作り、
  config/config.js の設定を自分用に書き換えます
  (Ver.0.01 -> Ver.0.02 では一部互換性がありませんので、再設定をお願いします）

2.config/description_model.txt をコピーして config/description.txt を作り、
  配信内容の説明を書き込みます

3.どこかのサーバーにアップロードします

4.index.html のアドレスを公開します（index.html の名前はかえても動きます）
 (Ver.0.02以前では、bc.html という名前でした。index.html に変更することを推奨します）

5.WME/MEE/KTE + 鏡ツール等で配信を開始し、どこかで上記4のURLを告知します

6.配信内容の説明文は、配信中に config/descripiton.txt を書き換えることで自動反映されます
  説明文が更新されても特に通知はでませんので、視聴者にアピールしたい場合は、
  ツイートするなり、しゃべるなりでフォローが必要になります

○使い方（鏡モード時）
1.普通に配信鏡をする時のように、鏡ツールで配信元に接続します

2.config.js で配信URLとして鏡ツールのURLを設定します

3.以下のように、通常時URLの後ろに"?<配信元のWMEブラウザ配信ツールのURL>"で
　配信ページを告知します
	http://<自分の配信ツールのURL>?<配信元の配信ツールのURL>

○補足
Q1.twitter の特定のハッシュタグを、棒読みちゃんで読ませたいです
A1.Search Streaming を読ませる設定が、最新の棒読みちゃんでできます
  Ver.0.11.0 だとできなくて、最新のVer.0.11.0β6でできることを確認しています。
  設定方法はKIAI
