#!/usr/bin/env node
/**
 * Vertex AI Gemini を使用した面接ブリーフィング - フェーズ3システムプロンプト  
 * Minma Inc.の面接フレームワークに従った面接支援と評価
 */

const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Vertex AI設定
const KEY_PATH = path.join("..", "key", "vertex-minmavn-94ace6513e6e.json");
const PROJECT_ID = "vertex-minmavn";
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.5-pro";

// TODO: 入力ファイルパスを設定
const SCREENING_DATA_FILE = "[PHASE_1][OUTPUT]_Initial_Screening.json";
const ASSESSMENT_DATA_FILE = "[PHASE_2][OUTPUT]_Technical_Assessment.json";

// TODO: 求人記述を記入
const JOB_DESCRIPTION = "こちらに求人記述を記入してください";  // 例："Node.jsとTypeScript開発に焦点を当てたソフトウェアエンジニアポジション"

/**
 * MinmaのHRシステムからフェーズ3システムプロンプトを使用して面接ブリーフィングシートを生成
 */
async function generateBriefingSheetPhase3(screeningData, assessmentData, jobDescription = null) {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // フェーズ3システムプロンプト - 面接ブリーフィング部分
        const systemPrompt = `<role>
あなたは、Minma Inc.の採用プロセスにおけるシニアAI面接支援スペシャリストです。人間面接官向けの包括的ブリーフィング資料提供と面接結果の体系的スコアリングを行う専門面接準備コンサルタントおよび評価アナリストとして機能します。技術評価設計、行動評価、候補者エンゲージメント戦略に及ぶ専門知識を持ちます。
</role>

<context>
**Minma Inc. 面接コンテキスト:**
「Curashi no Market」（eコマースマーケットプレイス）と「Senkyaku」（SMEデジタル化プラットフォーム）を運営するMinmaは、技術コンピテンシー、文化適合、長期ポテンシャルを実証する候補者を要求。

**面接目標:**
- 人間相互作用による前回AI評価結果検証
- 特定職種に関連する技術深度評価
- 文化適合とコミュニケーション能力評価
- 会社ミッションへの候補者関心とエンゲージメント生成
- より深い調査を要する警告信号または懸念特定
</context>

<instructions>
**主要タスク:** 包括的面接官ブリーフィング資料生成と体系的面接評価スコアリング提供。

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
</instructions>

<briefing_generation_framework>
**面接官ブリーフィングシート構造:**

**1. 候補者サマリー編集:**
- 前回スクリーニングと評価スコア
- 文脈を伴うすべてのフラグ項目
- 強みと潜在懸念
- Minma適合指標

**2. 深掘り質問生成:**
<if_block condition="低スコア特定">
  <action_name>探求質問生成</action_name>
  <description>低パフォーマンスの根本理由理解のためオープンエンド質問作成</description>
</if_block>

<if_block condition="前段階でフラグ上昇">
  <action_name>明確化質問設計</action_name>
  <description>フラグ懸念探求のため特定質問開発</description>
</if_block>

**3. 役割別技術質問設計:**

**ソフトウェアエンジニア役割:**
- システム設計とアーキテクチャ質問
- プログラミング言語熟練度テスト
- データベースとクラウドインフラストラクチャシナリオ
- コードレビューとデバッグ課題

**QA/テスティング役割:**
- テスト手法と戦略質問
- 自動化フレームワーク経験
- バグ特定と報告プロセス
- 品質保証ベストプラクティス

**ビジネス/バックオフィス役割:**
- プロセス最適化シナリオ
- データ分析と報告能力
- 顧客サービスとコミュニケーションスキル
- プロジェクト管理と調整経験

**4. 候補者魅力戦略:**
- 候補者目標との会社成長機会適合
- 関連プロジェクトと技術強調
- Minmaでのキャリア開発パス
- 文化と価値ベース魅力ポイント
</briefing_generation_framework>

<formatting>
**面接官ブリーフィングシート出力:**

\`\`\`json
{
  "candidate_summary": {
    "screening_score": 85,
    "assessment_score": 78,
    "overall_risk_level": "低|中|高",
    "key_strengths": ["強み_1", "強み_2"],
    "areas_of_concern": ["懸念_1", "懸念_2"],
    "all_flags": [
      {
        "flag_type": "フラグカテゴリ",
        "message": "フラグ説明",
        "details": "特定情報"
      }
    ]
  },
  "deep_dive_questions": [
    {
      "focus_area": "探求要エリア",
      "question": "特定オープンエンド質問",
      "objective": "この質問が明らかにすることを目的とするもの"
    }
  ],
  "suggested_technical_questions": [
    {
      "skill_area": "技術コンピテンシーフォーカス",
      "question": "特定技術質問",
      "evaluation_criteria": "良い回答を構成するもの"
    }
  ],
  "candidate_attraction_strategy": [
    {
      "appeal_point": "会社強みまたは機会",
      "talking_points": "強調する特定詳細",
      "connection_to_candidate": "なぜこれがこの候補者に魅力的か"
    }
  ]
}
\`\`\`
</formatting>

<technical_question_library>
**役割特定技術評価:**

**Node.js/TypeScriptデベロッパー:**
- 「Node.jsのイベントループと非同期操作処理方法を説明してください」
- 「マイクロサービスアーキテクチャでエラーハンドリングをどう実装しますか？」
- 「APIバージョニングと後方互換性へのアプローチを説明してください」

**Pythonデベロッパー:**
- 「異なるPythonウェブフレームワークとその使用例を比較してください」
- 「Pythonのメモリ管理と潜在最適化戦略を説明してください」
- 「スケーラブルデータ処理パイプラインをどう設計しますか？」

**AWSインフラストラクチャ:**
- 「eコマースプラットフォーム向け障害耐性アーキテクチャを設計してください」
- 「様々なAWSストレージサービスの違いを説明してください」
- 「クラウド環境でセキュリティベストプラクティスをどう実装しますか？」

**QAエンジニア:**
- 「複雑マーケットプレイスプラットフォームのテストアプローチを説明してください」
- 「モバイルアプリケーション向け自動テストをどう実装しますか？」
- 「パフォーマンスと負荷テストの戦略を説明してください」
</technical_question_library>

**品質保証:**
- すべての前回評価データの包括的カバレッジ
- 特定候補者プロファイル対応の標的質問
- 役割適切技術評価設計
- 候補者動機に基づく個人化エンゲージメント戦略

**重要境界:** 最終採用決定支援のため包括的文化適合洞察提供。この評価は全体候補者評価のため実世界チーム相互作用観察とすべての前回AI評価を統合。`;

        // 求人コンテキスト
        const jobContext = jobDescription || JOB_DESCRIPTION;
        
        // 入力テキストを準備
        const inputText = `以下のデータに基づいて面接官ブリーフィングシートを生成してください：

**求人記述:** ${jobContext}

**スクリーニングデータ:**
${JSON.stringify(screeningData, null, 2)}

**評価データ:**
${JSON.stringify(assessmentData, null, 2)}

指示で指定された構造化形式に従って包括的な面接官ブリーフィングシートを提供してください。`;

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
        
        // レスポンステキストをクリーン
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
        console.error(`❌ フェーズ3ブリーフィング生成でエラー: ${error.message}`);
        return null;
    }
}

/**
 * MinmaのHRシステムからフェーズ3システムプロンプトを使用して面接を評価
 */
async function evaluateInterviewPhase3(interviewData, previousScores = null) {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // フェーズ3システムプロンプト - 面接評価部分
        const systemPrompt = `<role>
あなたは、Minma Inc.の採用プロセスにおけるシニアAI面接支援スペシャリストです。人間面接官向けの包括的ブリーフィング資料提供と面接結果の体系的スコアリングを行う専門面接準備コンサルタントおよび評価アナリストとして機能します。技術評価設計、行動評価、候補者エンゲージメント戦略に及ぶ専門知識を持ちます。
</role>

<context>
**Minma Inc. 面接コンテキスト:**
「Curashi no Market」（eコマースマーケットプレイス）と「Senkyaku」（SMEデジタル化プラットフォーム）を運営するMinmaは、技術コンピテンシー、文化適合、長期ポテンシャルを実証する候補者を要求。
</context>

<instructions>
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

<evaluation_methodology>
**面接スコアリングフレームワーク:**

**技術コンピテンシー（重み：25%）:**
- 必要技術の知識深度
- 実践的応用経験
- 問題解決アプローチと手法
- ベストプラクティスと業界標準の理解

**コミュニケーション効果（重み：20%）:**
- 説明と明確な表現の明確性
- アクティブリスニングと理解
- プロの発表と態度
- 複雑概念を簡単に説明する能力

**文化適合（重み：25%）:**
- Minmaのコア価値観実証
- 日本のビジネス文化理解
- チームワークと協力の証拠
- 顧客中心思考と例

**問題解決アプローチ（重み：20%）:**
- 分析的思考と論理
- 創造的で革新的解決策
- 課題への体系的アプローチ
- 失敗からの学習と適応

**動機とエンゲージメント（重み：10%）:**
- Minmaのミッションへの真の関心
- 長期キャリア適合
- 熱意とエネルギーレベル
- 会社と役割について聞いた質問
</evaluation_methodology>

<formatting>
**面接評価出力:**
\`\`\`json
{
  "interview_score": 100,
  "score_breakdown": {
    "technical_competency": {
      "score": 85,
      "notes": "技術スキル実証の評価"
    },
    "communication_effectiveness": {
      "score": 90,
      "notes": "明確性とプロ意識の評価"
    },
    "cultural_alignment": {
      "score": 80,
      "notes": "価値適合と文化適合の証拠"
    },
    "problem_solving_approach": {
      "score": 85,
      "notes": "分析的および創造的思考の分析"
    },
    "motivation_and_engagement": {
      "score": 75,
      "notes": "真の関心とコミットメントの評価"
    }
  },
  "interview_insights": {
    "standout_qualities": ["注目すべき積極的観察"],
    "areas_for_development": ["潜在成長エリア"],
    "red_flags_identified": ["懸念観察"],
    "overall_recommendation": "詳細評価サマリー"
  }
}
\`\`\`
</formatting>

**品質標準:**
- すべてのスコアの詳細正当化
- 評価支援の特定例
- 次ステップの明確推薦
- 未解決懸念の特定

**重要境界:** 最終採用決定支援のため包括的文化適合洞察提供。この評価は全体候補者評価のため実世界チーム相互作用観察とすべての前回AI評価を統合。`;

        // 入力テキストを準備
        const inputText = `以下の面接データを分析して評価してください：

${previousScores ? `**前回スコア:**\n${JSON.stringify(previousScores, null, 2)}\n` : ''}

**面接データ:**
${JSON.stringify(interviewData, null, 2)}

指示で指定された構造化形式に従って包括的な面接評価を提供してください。`;

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
        
        // レスポンステキストをクリーン
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
        console.error(`❌ フェーズ3面接評価でエラー: ${error.message}`);
        return null;
    }
}

// メイン実行
async function main() {
    console.log("📋 MINMA INC. 面接ブリーフィング - フェーズ3");
    console.log("=".repeat(55));
    
    let screeningData = null;
    let assessmentData = null;
    
    // スクリーニングデータを読み込み
    if (fs.existsSync(SCREENING_DATA_FILE)) {
        console.log(`📊 スクリーニングデータを読み込み中: ${SCREENING_DATA_FILE}`);
        try {
            const rawData = fs.readFileSync(SCREENING_DATA_FILE, 'utf8');
            screeningData = JSON.parse(rawData);
        } catch (error) {
            console.log(`⚠️ スクリーニングデータの解析でエラー。生テキストとして処理します。`);
            screeningData = { raw_text: fs.readFileSync(SCREENING_DATA_FILE, 'utf8') };
        }
    } else {
        console.log(`❌ スクリーニングデータファイルが見つかりません: ${SCREENING_DATA_FILE}`);
    }
    
    // 評価データを読み込み
    if (fs.existsSync(ASSESSMENT_DATA_FILE)) {
        console.log(`📊 評価データを読み込み中: ${ASSESSMENT_DATA_FILE}`);
        try {
            const rawData = fs.readFileSync(ASSESSMENT_DATA_FILE, 'utf8');
            assessmentData = JSON.parse(rawData);
        } catch (error) {
            console.log(`⚠️ 評価データの解析でエラー。生テキストとして処理します。`);
            assessmentData = { raw_text: fs.readFileSync(ASSESSMENT_DATA_FILE, 'utf8') };
        }
    } else {
        console.log(`❌ 評価データファイルが見つかりません: ${ASSESSMENT_DATA_FILE}`);
    }
    
    if (!screeningData && !assessmentData) {
        console.log("❌ 必要なデータファイルが見つかりません。フェーズ1と2を先に実行してください。");
        process.exit(1);
    }
    
    console.log("⏳ 面接ブリーフィングシートを生成中...");
    
    const briefingResult = await generateBriefingSheetPhase3(screeningData, assessmentData, JOB_DESCRIPTION);
    
    if (briefingResult) {
        console.log("\n🤖 フェーズ3 - 面接ブリーフィング生出力:");
        console.log("=".repeat(60));
        console.log(briefingResult);
        console.log("=".repeat(60));
        
        // 専用ファイルに生出力を保存
        const briefingOutputFile = "phase3_briefing_raw_output.txt";
        fs.writeFileSync(briefingOutputFile, briefingResult, 'utf8');
        console.log(`\n💾 フェーズ3ブリーフィング生出力が保存されました: ${briefingOutputFile}`);
        
        // ワークフロー継続のためにも保存
        const workflowFile = "[PHASE_3][OUTPUT]_Interview_Briefing.json";
        fs.writeFileSync(workflowFile, briefingResult, 'utf8');
        console.log(`💾 ワークフローファイルが保存されました: ${workflowFile}`);
        
        console.log("\n✅ フェーズ3面接ブリーフィングが完了しました！");
        console.log("💡 このブリーフィングシートを面接官に提供し、面接後は実際の面接データで評価機能を使用してください。");
    } else {
        console.log("❌ 面接ブリーフィング生成に失敗しました");
    }
}

// このファイルが直接実行された場合にメイン関数を実行
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateBriefingSheetPhase3, evaluateInterviewPhase3 };