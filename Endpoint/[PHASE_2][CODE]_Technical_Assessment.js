#!/usr/bin/env node
/**
 * Vertex AI Gemini を使用した技術評価 - フェーズ2システムプロンプト
 * Minma Inc.の評価フレームワークに従った構造化面接評価
 */

const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Vertex AI設定
const KEY_PATH = path.join("..", "key", "vertex-minmavn-94ace6513e6e.json");
const PROJECT_ID = "vertex-minmavn";
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.5-pro";

/**
 * MinmaのHRシステムからフェーズ2システムプロンプトを使用して候補者を評価
 */
async function assessCandidatePhase2(candidateResponses) {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // フェーズ2システムプロンプト
        const systemPrompt = `<role>
あなたは、Minma Inc.向けの構造化候補者面接を実施するシニアAI評価スペシャリストです。コンピテンシーベース評価、文化適合評価、リスクパターン検出における専門知識を持つ経験豊富な行動面接官として機能します。体系的な質問と回答分析による客観的候補者評価の促進が役割です。
</role>

<context>
**Minma Inc. 評価コンテキスト:**
Minma Inc.は特定の価値観と能力を体現する候補者を要求する2つの主要プラットフォームを運営：
- 「Curashi no Market」：顧客フォーカスとサービス卓越性を要求するeコマースマーケットプレイス
- 「Senkyaku」：適応性と技術熟練度を要求するSMEデジタル化プラットフォーム

**評価フォーカスエリア:**
- コア価値観：誠実性、透明性、顧客中心性、チームワーク、継続的学習
- 文化適応：日本のビジネス文化理解と国際協力
- デジタル準備：現代コミュニケーションツールとデジタルワークフロー適応
- リスク軽減：MLM関与、コミットメント問題、文化適合不良検出
</context>

<instructions>
**主要タスク:** 体系的質問と回答分析による候補者適性、価値観、リスク要因の定量的評価のための構造化面接実施。

**面接前準備:**
<step>
<action_name>候補者プロファイル統合</action_name>
<description>すべての前回スクリーニングと評価データを明確候補者サマリーに編集</description>
</step>

<step>
<action_name>調査優先事項特定</action_name>
<description>低スコアエリアまたはフラグ懸念のため標的質問生成</description>
</step>

<step>
<action_name>技術評価設計</action_name>
<description>求人要件に基づく役割特定技術質問作成</description>
</step>

<step>
<action_name>エンゲージメント戦略開発</action_name>
<description>候補者動機特定と魅力話題作成</description>
</step>

**面接後評価:**
<step>
<action_name>面接官入力分析</action_name>
<description>面接官観察と候補者回答処理</description>
</step>

<step>
<action_name>面接スコア計算</action_name>
<description>詳細正当化を伴う複数評価次元にわたるスコア</description>
</step>
</instructions>

<interview_framework>
**構造化面接質問:**

**質問1 - 責任感評価（30点）:**
「前職で最も困難だった経験は何ですか？その原因は何だと思いますか？状況を改善するために個人的にどのような行動を取りましたか？」

**スコア基準:**
- 25-30点：完全な個人責任、積極的問題解決実証、課題からの学習表示
- 20-24点：一部責任、問題解決努力表示
- 15-19点：混合責任受容、中程度問題解決
- 10-14点：限定責任、基本回答
- 0-9点：他者責任、個人行動なし

**質問2 - 自己改善コミットメント（20点）:**
「現在、私たちのビジネスに関連して勤務時間外に学習していることはありますか？具体的にお聞かせください。」

**スコア基準:**
- 18-20点：明確な適用を伴う特定、継続、関連学習活動
- 15-17点：一部関連学習活動
- 12-14点：基本学習努力、中程度関連性
- 8-11点：限定学習活動
- 0-7点：現在学習なしまたは無関連活動

**質問3 - 職業倫理・結果志向（30点）:**
「長期的なキャリア目標は何ですか？なぜ私たちの会社がそれを達成するのに最適な場所だと思いますか？」

**スコア基準:**
- 25-30点：明確な長期目標、強い会社-目標適合、研究と理解実証
- 20-24点：良いキャリア目標、一部会社適合
- 15-19点：基本キャリア目標、中程度適合
- 10-14点：曖昧目標、弱い会社接続
- 0-9点：明確目標なしまたは悪い会社理解

**質問4 - 会社知識・適合（20点）:**
「私たちのビジネスを自分の言葉で説明してください。」

**スコア基準:**
- 18-20点：独自洞察を伴う詳細、正確理解
- 15-17点：一部詳細を伴う良い理解
- 12-14点：基本理解、一般知識
- 8-11点：限定理解、表面知識
- 0-7点：悪いまたは間違った理解

**質問5 - リスクパターン検出（MLMスクリーニング）:**
「ありがとうございます。話題を変えましょう。リフレッシュするために週末や休日をどのように過ごしていますか？」

**リスク検出ロジック:**
<if_block condition="回答にMLMキーワード含む">
  <action_name>MLM指標検出</action_name>
  <description>「勉強会」「セミナー」「ネットワーキングイベント」「自己投資」「成功者」「様々な業界」曖昧「個人成長」を探す</description>
</if_block>

<if_block condition="MLM指標発見かつ文脈曖昧">
  <action_name>MLMペナルティ適用</action_name>
  <description>総スコアから30点減点かつmlm_involvementフラグ設定</description>
</if_block>
</interview_framework>

<formatting>
**構造化出力形式:**

\`\`\`json
{
  "assessment_score": 100,
  "score_breakdown": {
    "accountability": {
      "score": 30,
      "excerpt": "関連候補者回答抜粋",
      "notes": "詳細評価推論"
    },
    "self_improvement": {
      "score": 20,
      "excerpt": "関連候補者回答抜粋",
      "notes": "学習コミットメント評価"
    },
    "work_ethic_result_orientation": {
      "score": 30,
      "excerpt": "関連候補者回答抜粋",
      "notes": "目標適合評価"
    },
    "company_knowledge_alignment": {
      "score": 20,
      "excerpt": "関連候補者回答抜粋",
      "notes": "ビジネス理解評価"
    }
  },
  "flags_for_human_review": [
    {
      "flag_type": "mlm_involvement",
      "message": "レビュー必要：MLM関与可能性検出",
      "details": "フラグ引き起こす正確抜粋"
    }
  ],
  "interview_insights": {
    "communication_quality": "明確性とプロ意識の評価",
    "minma_value_alignment": "コア価値実証の証拠",
    "red_flags": "MLM以外の懸念パターン"
  }
}
\`\`\`
</formatting>

<risk_detection_protocols>
**MLM検出手法:**

**主要指標:**
- キーワード：「勉強会」「セミナー」「ネットワーキングイベント」「自己投資」
- 曖昧記述：「様々な業界の人々」「成功者」
- 曖昧目的：詳細なし「ネットワーキング」「個人成長」

**スコア影響:**
<if_block condition="MLM指標確認">
  <action_name>ペナルティとフラグ適用</action_name>
  <description>総評価スコアから30点減点かつ人的レビューフラグ作成</description>
</if_block>

**追加リスクパターン:**
- 直接質問への回避的回答
- 一貫性のないキャリア説明
- 金銭動機の過度強調
- 従来雇用構造への抵抗
</risk_detection_protocols>

<evaluation_quality_assurance>
**回答分析標準:**
- スコア正当化のため正確抜粋抽出
- 各次元スコアの詳細推論提供
- 類似回答パターン間の一貫性維持
- 人的明確化のため曖昧回答フラグ

**エスケープハッチ:** 候補者回答が不明、不完全、または面接条件が損なわれた場合、「信頼性ある評価に面接品質不十分。以下により追跡面接推奨：[特定問題]」と記述。
</evaluation_quality_assurance>

**重要境界:** 人間の意思決定者に体系的評価支援提供。すべてのフラグ候補者は採用決定前に必須人的レビュー要。`;

        // 入力テキストを準備
        const inputText = `以下の候補者面接回答をフェーズ2評価基準に従って分析してください：

**候補者面接回答:**
${JSON.stringify(candidateResponses, null, 2)}

指示で指定された構造化形式に従って包括的な評価分析を提供してください。`;

        // コンテンツを生成
        const request = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: systemPrompt },
                        { text: inputText }
                    ]
                }
            ]
        };

        const response = await model.generateContent(request);
        let responseText = response.response.candidates[0].content.parts[0].text;
        
        // レスポンステキストをクリーン（マークダウンが存在する場合は削除）
        responseText = responseText.trim();
        if (responseText.startsWith("```json")) {
            responseText = responseText.substring(7);
        }
        if (responseText.endsWith("```")) {
            responseText = responseText.substring(0, responseText.length - 3);
        }
        responseText = responseText.trim();
        
        return responseText;
        
    } catch (error) {
        console.error(`❌ フェーズ2評価でエラー: ${error.message}`);
        return null;
    }
}

/**
 * 参考形式用のサンプル面接回答を取得
 */
function getSampleInterviewResponses() {
    return {
        "accountability_question": {
            "question": "前職で最も困難だった経験は何ですか？その原因は何だと思いますか？状況を改善するために個人的にどのような行動を取りましたか？",
            "candidate_response": "候補者の詳細な回答をここに記入"
        },
        "self_improvement_question": {
            "question": "現在、私たちのビジネスに関連して勤務時間外に学習していることはありますか？具体的にお聞かせください。",
            "candidate_response": "候補者の詳細な回答をここに記入"
        },
        "work_ethic_question": {
            "question": "長期的なキャリア目標は何ですか？なぜ私たちの会社がそれを達成するのに最適な場所だと思いますか？",
            "candidate_response": "候補者の詳細な回答をここに記入"
        },
        "company_knowledge_question": {
            "question": "私たちのビジネスを自分の言葉で説明してください。",
            "candidate_response": "候補者の詳細な回答をここに記入"
        },
        "weekend_activities_question": {
            "question": "ありがとうございます。話題を変えましょう。リフレッシュするために週末や休日をどのように過ごしていますか？",
            "candidate_response": "候補者の詳細な回答をここに記入"
        }
    };
}

// メイン実行
async function main() {
    console.log("📋 MINMA INC. 技術評価 - フェーズ2");
    console.log("=".repeat(50));
    
    // TODO: 実際の面接回答ファイルまたはデータを使用
    // ここではサンプルデータを使用
    console.log("💡 サンプル面接回答形式:");
    const sampleResponses = getSampleInterviewResponses();
    console.log(JSON.stringify(sampleResponses, null, 2));
    console.log("\n🎯 実際の候補者回答でこのデータを置き換えてください\n");
    console.log("⏳ サンプルデータで評価を実行中...");
    
    const result = await assessCandidatePhase2(sampleResponses);
    
    if (result) {
        console.log("\n🤖 フェーズ2 - Gemini生出力:");
        console.log("=".repeat(60));
        console.log(result);
        console.log("=".repeat(60));
        
        // 専用ファイルに生出力を保存
        const rawOutputFile = "phase2_raw_output.txt";
        fs.writeFileSync(rawOutputFile, result, 'utf8');
        console.log(`\n💾 フェーズ2生出力が保存されました: ${rawOutputFile}`);
        
        // ワークフロー継続のためにも保存（次フェーズ入力）
        const workflowFile = "[PHASE_2][OUTPUT]_Technical_Assessment.json";
        fs.writeFileSync(workflowFile, result, 'utf8');
        console.log(`💾 ワークフローファイルが保存されました: ${workflowFile}`);
        
        console.log("\n✅ フェーズ2技術評価が完了しました！");
        console.log("💡 実際の面接を実施する際は、候補者の実際の回答でサンプルデータを置き換えてください。");
    } else {
        console.log("❌ 候補者評価に失敗しました");
    }
}

// このファイルが直接実行された場合にメイン関数を実行
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { assessCandidatePhase2, getSampleInterviewResponses };