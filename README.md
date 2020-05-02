# Login with MetaMask

MetaMaskを使ったパスワードレスのログインのサンプルコードです。web3モジュールのweb3.eth.personal.sign メソッドによるECDSA署名と、eth-sig-utilモジュールのecrecoverメソッドによる検証を用いてユーザ認証を行います。フロントエンドはReact、バックエンドはVercel Now(Expressのサーバレス関数)、データベースにはAtlas Mongodbを使用しています。

処理フローは以下のリポジトリと同じです。

https://github.com/amaurymartiny/login-with-metamask-demo  

下の記事にて解説されています。

https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial

シークエンス図を用いて日本語による解説記事を書きました。  

-準備中-


## 事前準備

Vercel(ZEIT) NowとAtlas mongodbへのユーザ登録が必要です。  
Vercel(ZEIT) Now 参考記事：

https://alis.to/fukurou/articles/3Y1bn18ekB69  

Atlas Mongodb 参考記事：

https://alis.to/fukurou/articles/azDdmrz5RZOA


## ローカルでの立ち上げ方

1. 必要ライブラリのインストール  

metamask-login-sample直下で  

```
cd packages/frontend
npm install
cd ../backend
npm install
```

(WSL の場合は `npm install --save`)

2. バックエンドの立ち上げ

backend内で.envファイルを作成し、mongodbのURI、SECRET、PORTを指定します。  

Example:

```
MONGODB_URI="mongodb+srv://userid:password@cluster0-aaaaa.mongodb.net/bbbbb"
SECRET="secret-key"
PORT=3000
```

次にnowとのリンクを行い、ローカルに立ち上げます。

`now`  
～必要項目入力～  
`now dev`

3. フロントエンドの立ち上げ

frontend内で.envを作成し、実行時ポート番号とバックエンドのURLを指定します。

Example:

```
PORT=4000
REACT_APP_BACKEND_URL="http://localhost:3000"
```

4. 動作確認

MetaMaskがインストールされたブラウザで

http://localhost:4000

にアクセスします。

