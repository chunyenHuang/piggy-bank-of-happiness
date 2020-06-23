# Cognito

## Custom invitation message

https://github.com/aws-amplify/amplify-cli/issues/2187

`amplify/backend/auth/*-template.yml - UserPool`

```yml
      # Add this to make admin only
      AdminCreateUserConfig:
          AllowAdminCreateUserOnly: True
          InviteMessageTemplate:
              EmailMessage: |
                [幸福存摺] 開發測試登入資訊
                <ul>
                    <li>帳號 {username}</li>
                    <li>臨時密碼 {####}</li>
                </ul>
                <br/>
                <ul>
                    <li>開發首頁 https://g0v.hackmd.io/92ynyG5gSVSpAGNq0xx1mg</li>
                    <li>iOS測試步驟 https://g0v.hackmd.io/92ynyG5gSVSpAGNq0xx1mg</li>
                    <li>Android測試步驟 (更新中)</li>
                </ul>
              EmailSubject: "[幸福存摺] 開發測試登入資訊"
              SMSMessage: "[幸福存摺] 您的帳號是 {username} 臨時密碼 {####}"
```