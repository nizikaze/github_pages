# デプロイ手順

アプリケーションを公開するための準備が整いました。
以下のいずれかの方法でアップロードしてください。

## 推奨: Vercel (簡単・安全)
既存のリポジトリに影響を与えず、このアプリだけを公開するのに最適です。

1. [Vercel](https://vercel.com/) にログイン（GitHubアカウントでログイン）。
2. "Add New..." -> "Project" をクリック。
3. GitHubリポジトリ `nizikaze/github_pages` をImport。
4. **重要**: "Configure Project" 画面で:
   - **Root Directory** の "Edit" をクリックし、`chord-gen` を選択してください。
   - Framework Preset は自動的に `Vite` になるはずです。
5. "Deploy" をクリック。

## 代替案: GitHub Pages
リポジトリの設定を変更して公開します。

1. ターミナルでビルドを実行します:
   ```bash
   npm run build
   ```
2. 生成された `dist` フォルダの中身が公開用ファイルです。
3. これを公開するには、いくつかの方法がありますが、最も簡単なのは `gh-pages` パッケージを使うことです:
   ```bash
   npm install gh-pages --save-dev
   ```
   `package.json` に以下を追加:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
   そして実行:
   ```bash
   npm run deploy
   ```
   ※注意: これは `gh-pages` ブランチを上書きします。リポジトリ全体で他のページを管理している場合は注意してください。
