# Tavern Core TRPG Blueprint

## 世界ルール実装方針

- Truth Rank: `Fact.rank` に Rumor/Testimony/Record/Canon を保持。
- Open Threads: `Thread` を台帳化し、クエスト生成時に必ず `relatedThreadIds` を付与。
- Quest Emitter: `src/logic/questEmitter.ts` が会話ログからトリガー検出。
- Rift: Canon級矛盾は `src/logic/riftLogic.ts` が検出し、`Rift` を作成。
- Hostess Powers: `HostessConsoleView` で昇格・保留・裂け目封印を実装。
- Outside from Concepts: Quest生成テンプレに「概念領域」シーンを採用。
- Contradiction Accounting: `meta.darkness` を増減し難易度や代償に反映。
- Session Length 5 levels: `SessionLog.lengthLevel` で深度を管理。

## クエスト発行アルゴリズム（擬似コード）

```pseudo
function emitQuest(conversationEntry, core):
  triggers = []
  newEntities = []

  if entry.text contains emotion keywords:
      triggers.add("強い感情")
  if entry.text contains trade keywords:
      triggers.add("取引")
  if entry.text contains silence markers:
      triggers.add("沈黙")
  if entry.text contains contradiction markers:
      triggers.add("矛盾の芽")

  tokens = tokenize(entry.text)
  for token in tokens:
      if token not in core.entities and token length >= 2:
          newEntities.add(token)

  if newEntities not empty:
      triggers.add("未知名詞")

  relatedThreads = match threads where title/notes contain triggers
  if relatedThreads empty:
      relatedThreads = [core.threads[0]]

  quest = buildQuestTemplate(triggers, relatedThreads)
  facts = buildFactsFromTriggers(triggers)

  rifts = detectContradictions(quest, core.facts)
  if rifts detected:
      quest.truthRank = Rumor
      core.meta.darkness += rift.darknessCost

  persist quest, facts, rifts
  advance related threads
  return quest
```

## サンプル：会話ログ → トリガー → クエスト

**会話ログ**
- 勇者: 「外の闇が明るく見えた…あの塔が気になる」

**検出トリガー**
- 未知名詞: `塔`
- 矛盾の芽: `明るく`
- 強い感情: `気になる`

**生成クエスト（抜粋）**
- タイトル: `heroの言葉から降る影`
- Summary: `会話に現れた「外の闇が明るく見えた…」の余韻を追う。`
- Scenes:
  1. 概念領域を探索し、塔の気配を確かめる。
  2. 取引条件を探る対話シーン。
  3. 店主の昇格儀式。
- 付随処理:
  - Canon「外は真っ暗」と矛盾するため Rift 生成。
  - Quest は Rumor 扱いで台帳に残る。

## OneDrive 同期設計メモ

- Storage インターフェース: `getCore / saveCore / mergeCore` を定義。
- OneDrive 実装時は `ETag` を保存し、`If-Match` で更新。
- 競合時の方針:
  - `meta.updatedAt` が新しいコアを優先
  - `threads/facts/quests/rifts` は UUID ごとにマージ
  - Canon 同士の衝突は Rift を自動生成
- 検討事項:
  - 差分アップロード (delta API)
  - セッションログは append-only にしてコンフリクトを避ける
