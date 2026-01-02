# TRPG - Tavern Core

即興・無限拡張・矛盾しないハイファンタジーTRPGのMVP雛形です。

## 目的
- 会話ログからクエストを発行し、台帳を崩さずに世界を確定させる
- Truth Rank / Open Threads / Rift / Hostess Powers を必須実装する
- OneDrive 同期を見据えた storage 層の差し替えを可能にする

## セットアップ

```bash
npm install
npm run dev
```

## アプリ画面 (MVP)
- Tavern: 会話ログ入力と履歴
- Quest Drop: 会話から発行されたクエスト一覧
- Quest Runner: シーン進行 + 2D6 判定
- World Ledger: Facts / Threads / Rifts の台帳表示
- Hostess Console: 真実昇格・保留・裂け目封印

## JSONスキーマ
- `schemas/facts.schema.json`
- `schemas/threads.schema.json`
- `schemas/rifts.schema.json`
- `schemas/quests.schema.json`
- `schemas/sessions.schema.json`

## データ正本
- `data/tavern_core.json`

## 設計ドキュメント
- `docs/blueprint.md`

## ストレージ
- `src/storage/storage.ts` にインターフェースを定義
- `src/storage/indexedDbStorage.ts` が IndexedDB 実装

## 主要ロジック
- `src/logic/questEmitter.ts`: トリガー検出 + クエスト生成
- `src/logic/riftLogic.ts`: Canon 矛盾の裂け目化

## ルール補足
- 判定: `2D6 + skillBonus >= DC`
- 12はクリティカル、2はファンブル
- クエスト成功で darkness を軽減
