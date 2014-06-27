NAME: WME Browser Live Streamer (WMEブラウザ配信ツール)
Author: nanashi (@tako774)
Lisence: NYSL (同梱のNYSL.txtを参照)、ただし flowplayer は LISENCE_flowplayer.txt を参照
Version: 0.19
Date: 2014/4/30

○概要
- javascript しか使っていない、ブラウザで使えるライブストリーミング配信ツールです

- WME/MEE/KTE など、Windows Media Player で視聴できるエンコーダーであれば、なんでも使えます
- RTMP/RTMPT 形式の配信にも対応しました (0.20より)。
  Open Broadcaster Software(v0.622b 64bit) + Red5(v1.02) で動作確認済みです。
  RTMP/RTMPT 形式のメリット／デメリットと配信方法は、下記を参照ください。

- twitter と連携できます（Twitter API 1.1 対応済み）
- 配信内容説明テキスト(config/description.txt の内容)は、視聴者のリロード無しで更新されます

○判明済みの不具合
- Opera でツイート・RT・fav をすると、twitter から json ファイルがダウンロードされてしまう
　→ ファイルを開くか聞かれたりしますが、開かなければ問題はないです。

○使い方（WME等での配信時）

0.HTMLがアップロードできるサーバーを確保します（無料サーバーでも構いません）

1.config/config_model.js をコピーして config/config.js を作り、
  config/config.js の設定を自分用に書き換えます

2.config/description_model.txt をコピーして config/description.txt を作り、
  配信内容の説明を書き込みます

3.どこかのサーバーにアップロードします

4.index.html のアドレスを公開します（index.html の名前はかえても動きます）

5.WME/MEE/KTE + 鏡ツール等で配信を開始し、どこかで上記4のURLを告知します

6.配信内容の説明文は、配信中に config/descripiton.txt を書き換えることで自動反映されます
  説明文が更新されても特に通知はでませんので、視聴者にアピールしたい場合は、
  ツイートするなり、しゃべるなりでフォローが必要になります

7.(任意)google などで検索されるようにしたい場合、index.html の title タグをエディタで修正します。
　デフォルトでは、「WMEブラウザ配信ツール」というタイトルで検索サイトに登録されます。
　こちらは、今のところ、ツールを更新するたびに自分で index.html を書き換える必要があります。


○使い方（鏡モード時）

- 鏡モードとは
　他のWME/RTMPブラウザ配信ツールの配信を鏡する際に、検索ハッシュタグなどを相手の設定にする機能
　自分の配信URLの後ろに"?<配信元のWMEブラウザ配信ツールのURL>"をつけるだけで使えます
　	http://<自分の配信ツールのURL>?http://tako774.net/bc/
　にブラウザでアクセスしてみると、どういうことかわかると思います。

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

○ライセンス
