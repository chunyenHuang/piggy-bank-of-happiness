# Cognito

## Custom invitation message

https://github.com/aws-amplify/amplify-cli/issues/2187

`amplify/backend/auth/*-template.yml - UserPool`

```yml
  UserPool:
    Properties:
      # Add this to make admin only
      AdminCreateUserConfig:
          AllowAdminCreateUserOnly: false
          InviteMessageTemplate:
              EmailMessage: |
                [幸福存摺] 登入資訊
                <ul>
                    <li>帳號 {username}</li>
                    <li>臨時密碼 {####}</li>
                </ul>
                <br/>
                <ul>
                    <li>首頁 https://www.happinessbankbook.org/</li>
                    <li>蘋果版本下載 https://apps.apple.com/app/id1519658020</li>
                    <li>安卓版本下載 https://play.google.com/store/apps/details?id=cloud.goldax.piggy_bank_of_happiness</li>
                </ul>
                <br/>
                測試專用
                <ul>
                    <li>開發首頁 https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ</li>
                    <li>蘋果測試步驟 https://g0v.hackmd.io/92ynyG5gSVSpAGNq0xx1mg</li>
                    <li>安卓測試步驟 https://g0v.hackmd.io/gzBdF9PbS52uK37WPHBQEA</li>
                </ul>
              EmailSubject: "[幸福存摺] 登入資訊"
              SMSMessage: "[幸福存摺] 您的帳號是 {username} 臨時密碼 {####}"
```