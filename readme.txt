NAME: WME/RTMP Browser Live Streamer (WME/RTMP�u���E�U�z�M�c�[��)
Author: nanashi (@tako774)
Lisence: NYSL (������NYSL.txt���Q��)�A������ flowplayer �� LISENCE_flowplayer.txt ���Q��
Version: 0.20
Date: 2018/7/27

���T�v
- javascript �����g���Ă��Ȃ��A�u���E�U�Ŏg���郉�C�u�X�g���[�~���O�z�M�c�[���ł�

- WME/MEE/KTE �ȂǁAWindows Media Player �Ŏ����ł���G���R�[�_�[�ł���΁A�Ȃ�ł��g���܂�
- RTMP/RTMPT �`���̔z�M�ɂ��Ή����܂��� (v0.19���)�B
  Open Broadcaster Software(v0.625b 64bit) + nginx trmp (1.5.5/1.0.4) http://rtmp.jack0r.com/ �ƁA
  Open Broadcaster Software(v0.622b 64bit) + Red5(v1.02) �œ���m�F�ς݂ł��B
  RTMP/RTMPT �`���̃����b�g�^�f�����b�g�Ɣz�M���@�́A���L���Q�Ƃ��������i���L�ځFTODO�j�B

- twitter �ƘA�g�ł��܂��iTwitter API 1.1 �Ή��ς݁j
- �z�M���e�����e�L�X�g(config/description.txt �̓��e)�́A�����҂̃����[�h�����ōX�V����܂�

�������ς݂̕s�
- Opera/Firefox �Ńc�C�[�g�ERT ������ƁAtwitter ���� json �t�@�C�����_�E�����[�h����Ă��܂�
�@�� �t�@�C�����J���������ꂽ�肵�܂����A�J���Ȃ���Ζ��͂Ȃ��ł��B
- fav �����삵�Ȃ��i�����炩�͕s���j

���g�����iWME���ł̔z�M���j

0.HTML���A�b�v���[�h�ł���T�[�o�[���m�ۂ��܂��i�����T�[�o�[�ł��\���܂���j

1.config/config_model.js ���R�s�[���� config/config.js �����A
  config/config.js �̐ݒ�������p�ɏ��������܂�

2.config/description_model.txt ���R�s�[���� config/description.txt �����A
  �z�M���e�̐������������݂܂�

3.�ǂ����̃T�[�o�[�ɃA�b�v���[�h���܂�

4.index.html �̃A�h���X�����J���܂��iindex.html �̖��O�͂����Ă������܂��j

5.WME/MEE/KTE + ���c�[�����Ŕz�M���J�n���A�ǂ����ŏ�L4��URL�����m���܂�

6.�z�M���e�̐������́A�z�M���� config/descripiton.txt �����������邱�ƂŎ������f����܂�
  ���������X�V����Ă����ɒʒm�͂ł܂���̂ŁA�����҂ɃA�s�[���������ꍇ�́A
  �c�C�[�g����Ȃ�A����ׂ�Ȃ�Ńt�H���[���K�v�ɂȂ�܂�

7.(�C��)google �ȂǂŌ��������悤�ɂ������ꍇ�Aindex.html �� title �^�O���G�f�B�^�ŏC�����܂��B
�@�f�t�H���g�ł́A�uWME�u���E�U�z�M�c�[���v�Ƃ����^�C�g���Ō����T�C�g�ɓo�^����܂��B
�@������́A���̂Ƃ���A�c�[�����X�V���邽�тɎ����� index.html ������������K�v������܂��B


���g�����i�����[�h���j

- �����[�h�Ƃ�
�@����WME/RTMP�u���E�U�z�M�c�[���̔z�M��������ۂɁA�����n�b�V���^�O�Ȃǂ𑊎�̐ݒ�ɂ���@�\
�@�����̔z�MURL�̌���"?<�z�M����WME�u���E�U�z�M�c�[����URL>"�����邾���Ŏg���܂�
�@	https://<�����̔z�M�c�[����URL>?https://tako774.net/bc/
�@�Ƀu���E�U�ŃA�N�Z�X���Ă݂�ƁA�ǂ��������Ƃ��킩��Ǝv���܂��B

1.���ʂɔz�M�������鎞�̂悤�ɁA���c�[���Ŕz�M���ɐڑ����܂�

2.config.js �Ŕz�MURL�Ƃ��ċ��c�[����URL��ݒ肵�܂�

3.�ȉ��̂悤�ɁA�ʏ펞URL�̌���"?<�z�M����WME�u���E�U�z�M�c�[����URL>"��
�@�z�M�y�[�W�����m���܂�
	http://<�����̔z�M�c�[����URL>?<�z�M���̔z�M�c�[����URL>

���⑫
Q1.twitter �̓���̃n�b�V���^�O���A�_�ǂ݂����œǂ܂������ł�
A1.Search Streaming ��ǂ܂���ݒ肪�A�ŐV�̖_�ǂ݂����łł��܂�
  Ver.0.11.0 ���Ƃł��Ȃ��āA�ŐV��Ver.0.11.0��6�łł��邱�Ƃ��m�F���Ă��܂��B
  �ݒ���@��KIAI

�����C�Z���X
�@������ NYSL.txt ���Q�ƁB
�@flowplayer �� js/swf �t�@�C���ɂ��ẮA������ LICENSE_flowplayer.txt ���Q�ƁB
