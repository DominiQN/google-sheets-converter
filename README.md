# google-sheets-converter

## 1. Get google credentials

- see this
  - https://console.developers.google.com/apis
- make sure that file named **'google-credentials.json'**

## 2. setup

```
$ gsc setup
Path to create config file(default: home dir of os):
set the default path: ${homedir}
Google credentials' directory path(default: home dir of os, file name: google-credentials.json):
set the default path: ${homedir}
Directory path to save google oauth2 token (default: home dir of os, file name: google-oauth2-token.json):
Destination directory path: /path/your/dest/path
successfully created. /your/config/path/sheets-config.json
```

## 3. convert

```
$ gsc convert <sheet-name>
$ gsc cvt <sheet-name>
```
```
$ gsc cvt <sheet-name>
credentials path: '/your/credentials/path'
token path: '/your/path/to/save/token'
read credentials from /your/credentials/path/google-credentials.json

Authorize this app by visiting this url: ...
Enter the code from that page here: ********************

Token stored to /your/path/to/save/token/google-oauth2-token.json

...
```


## reference

- https://www.popit.kr/%EB%82%98%EB%A7%8C%EC%9D%98-cli-%EB%A7%8C%EB%93%A4%EA%B8%B0/
