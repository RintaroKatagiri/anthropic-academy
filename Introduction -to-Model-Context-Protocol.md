# Introduction to Model Context Protocolメモ

## Introduction

### Introducing MCP

- MCPはツールを定義し実行する負担を、サーバからMCPサーバに移す
- MCPサーバは外部サービスへのインターフェースである
- 誰でもMCPサーバの実装を行うことが出来る（多くはサービスを提供しているところがMCPを作って、Claudeで使えるように実装する）
- MCPサーバを使用することは、サービスのAPIを直接呼び出すことと何が違うのか？
  - APIを実装する場合、自分で実装しないといけない
  - MCPサーバにはツールスキーマと関数が既に定義されている

### MCP Client

- 自身のサーバとMCPサーバの間の通信手段を提供する
- クライアントからMCPサーバにListToolsRequestを送信し、MCPサーバ側からListToolsResultが返ってくる（ツールのリスト）
- そして、クライアントからMCPサーバにCallToolsRequestを送信し、MCPサーバ側からCallToolsResultが返ってくる（ツール実行）
- 実行の流れ
  ![フロー図](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2Fa46l9irobhg0f5webscixp0bs%2Fpublic%2F1749849232%2F09_-_002_-_MCP_Clients_19.1749849231568.png)
