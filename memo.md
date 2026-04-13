# Claude Codeメモ

## Getting hands on

### Adding context

#### `/init`

- 始めてプロジェクトで実行する場合に実行を推奨されている
- コードベース全体を深く調べる（プロジェクトの目的、全体的なアーキテクチャ、関連コマンド、重要なファイルなどを特定する）
- この検索のあと、結果をClaude.mdファイルに要約して保存する

#### `shift` + `Tab`

- プロジェクト内で自由にファイルを書き込めるようになる

#### CLAUDE.md

- 2つの異なる目的がある
  - Claudeがコードベースをよりよく理解するのに役立ち、関連するコードをより迅速に見つけられるようにする目的
  - Claudeに一般的なガイダンスを与える場所として機能させる目的
- CLAUDE.mdファイルは複数の種類がある
  - プロジェクトレベル（CLAUDE.md）
    - /initで生成されたもの
    - このファイルをGitのようなソース管理にコミットし共有することでプロジェクト固有の指示をClaudeに渡す
  - ローカルレベル（CLAUDE.local.md）
    - オプションでClaude.local.mdファイルを作ることが出来る
    - コミットされず、共有されないため、個人的な指示が出来る
  - マシンレベル（~/.claude/CLAUDE.md）
    - マシン全体に持たせる指示を持つことが出来る
    - ローカルで実行するすべてのプロジェクトに適用される

#### `@`

- 参照するファイルを明示的に示すことが出来る

### Making changes

#### plan mode

- `shift`+`tab`を2回押す（既に1回押している場合は1回のみ）
- プランモードでは、Claudeはプロジェクトのコンテンツについてより多くのリサーチを行い、より覆うのファイルをよみっこみ、タスクを完了する方法についての詳細な計画を立てる
- 計画を完了した後、Claudeはタスクを完了するために何をするかを正確に伝える
- いくつものステップが必要な複雑なタスクに向いている

#### Thinking modes

- Claudeの思考を拡張させる（トークン数は増える）
- 思考を拡大させるトリガーワード（右側にいくにつれて増えていく）
  - Think→Think more→Think a lot→Think longer→Ultrathink
- 特定の複雑なロジックの部分に焦点を当てる場合や困難なバグをトラブルシューティングする場合に役立つ
- plan modeと併用可能（plan modeは理解を広げる、thinking modeは深めるイメージ）

#### Git

- コミットなども依頼すれば、分かりやすいタイトルでコミットしてくれる

### Controlling context

#### `Esc`

- Claudeを止めて別の経路の提案が出来るようになる

#### `Esc`+`Esc`

- 過去のメッセージに戻る

#### `/compact`

- 解岩の要約を

#### `/clear`

- 会話内容を削除
- 新たなタスクに関して始める時に有効

### Custom commands

- コマンドを作った後は、必ず再起動する
- スキルとの違いに関して（[参考文献](https://zenn.dev/tmasuyama1114/articles/cc_commands_merged_into_skills)）

### MCP servers with Claude Code

#### MCPとは？

- AnthropicがオープンソースとしてリリースしたプロトコルでAIアシスタントと外部ツール・データソースを接続するための標準仕様
- MCPを使うことでClaudeはファイルシステム、データベース、API、Webブラウザなど様々な外部システムにアクセスできるようになる
- MCPサーバーが「ツール」「リソース」「プロンプト」の3つを提供する形で構成されている
  - **ツール**: Claudeが呼び出せる関数（例：ファイル読み書き、検索、コード実行）
  - **リソース**: Claudeが参照できるデータ（例：ドキュメント、DBの内容）
  - **プロンプト**: 再利用可能なプロンプトテンプレート
- 接続方式は2種類ある
  - **ローカル（stdio）**: 同じマシン上でサブプロセスとして起動するサーバーと通信
  - **リモート（HTTP/SSE）**: ネットワーク越しにサーバーと通信
- Claude Codeではsettings.jsonにMCPサーバーの設定を記述することで利用できる
- 参考文献
  - [【2026年版】Claude Codeを最強にするプラグイン・MCP・ツール総まとめ](https://qiita.com/shatolin/items/ca1810e419fee5fd963b)
  - [Playwright MCPの設定から使い方、E2Eテスト自動化まで解説](https://magicpod.com/blog/playwright-mcp/)
  - [GitHub MCPでClaude Codeがもっと便利に！ターミナルから直接GitHub操作する方法](https://zenn.dev/gmomedia/articles/github-mcp-setup-guide)

#### 接続方法

- Claude外のターミナルで `claude mcp add playwright npx @playwright/mcp@latest`を実行
  - 最初のplaywrightはサーバーの名前、それ以降はローカルでサーバーを起動することを示すコマンド
- その後、claudeを起動
