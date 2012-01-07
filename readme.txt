NAME: WME Browser Live Streamer (WMEブラウザ配信ツール)
Author: nanashi (@tako774)
Lisence: NYSL
Version: 0.02
Date: 2012/01/07

○概要
- javascript しか使っていない、ブラウザで使えるライブストリーミング配信ツールです
- WME での配信を前提にしています
- twitter と連携できます
- 配信内容説明テキスト(config/description.txt の内容)は、
  視聴者のリロード無しで更新されます(Ver.0.02より)

○使い方
1.config/config_model.js をコピーして config/config.js を作り、
  config/config.js の設定を自分用に書き換えます
  (Ver.0.01 -> Ver.0.02 では一部互換性がありませんので、再設定をお願いします）

2.config/description_model.txt をコピーして config/description.txt を作り、
  配信内容の説明を書き込みます

3.どこかのサーバーにアップロードします

4.bc.html のアドレスを公開します（bc.html の名前はかえても動きます）

5.配信内容の説明文は、配信中に config/descripiton.txt を書き換えることで自動反映されます
  説明文が更新されても特に通知はでませんので、視聴者にアピールしたい場合は、
  ツイートするなり、しゃべるなりでフォローが必要になります

○捕捉
Q1.twitter の特定のハッシュタグを、棒読みちゃんで読ませたいです
A1.Search Streaming を読ませる設定が、最新の棒読みちゃんでできます
  Ver.0.11.0 だとできなくて、最新のVer.0.11.0β5でできることを確認しています。
  設定方法はKIAI
