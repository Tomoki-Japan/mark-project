(() => {
    // ユーザープールの設定
    const poolData = {
        UserPoolId: "us-east-1_YPh5qwkdm",
        ClientId: "59da7brj3hoh0mtmomqvaq50h4"
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser(); // 現在のユーザー

    const currentUserData = {}; // ユーザーの属性情報

    // Amazon Cognito 認証情報プロバイダーを初期化します
    AWS.config.region = "us-east-1"; // リージョン
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:72c4bfe5-e74b-4a5c-9c0a-b96ad755ccde"
    });

    // 現在のユーザーの属性情報を取得・表示する
    // 現在のユーザー情報が取得できているか？
    if (cognitoUser != null) {
        cognitoUser.getSession((err, session) => {
            if (err) {
                console.log(err);
                location.href = "signin.html";
            } else {
                // ユーザの属性を取得
                cognitoUser.getUserAttributes((err, result) => {
                    if (err) {
                        location.href = "signin.html";
                    }

                    // 取得した属性情報を連想配列に格納
                    for (i = 0; i < result.length; i++) {
                        currentUserData[result[i].getName()] = result[i].getValue();
                    }
                    document.getElementById("name").innerHTML =
                        "ようこそ！" + currentUserData["name"] + "さん";
                    document.getElementById("role").innerHTML =
                        "Your Role is " + currentUserData["custom:role"];
                    document.getElementById("email").innerHTML =
                        "Your E-Mail is " + currentUserData["email"];

                    // サインアウト処理
                    const signoutButton = document.getElementById("signout");
                    signoutButton.addEventListener("click", event => {
                        cognitoUser.signOut();
                        location.reload();
                    });
                    signoutButton.hidden = false;
                    console.log(currentUserData);
                });
            }
        });
    } else {
        location.href = "signin.html";
    }
})();