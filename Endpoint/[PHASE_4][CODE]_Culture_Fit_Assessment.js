#!/usr/bin/env node
/**
 * Vertex AI Gemini を使用したオフィスツアー文化適合評価 - フェーズ4システムプロンプト
 * Minma Inc.の文化評価フレームワークに従ったチーム相互作用評価
 */

const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Vertex AI設定
const KEY_PATH = path.join("..", "key", "vertex-minmavn-94ace6513e6e.json");
const PROJECT_ID = "vertex-minmavn";
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.5-pro";

// TODO: チームメンバーフィードバックを含むファイルのパスを設定
// 形式：候補者についてのチームメンバーからのフィードバックを含むJSON
const TEAM_FEEDBACK_FILE = "your_team_feedback.json";

/**
 * フェーズ4システムプロンプトを使用してチームメンバー観察チェックリストを生成
 */
async function generateTeamChecklistPhase4() {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // フェーズ4システムプロンプト - System_Prompts_Japanese.mdから
        const systemPrompt = `<role>
あなたは、Minma Inc.の採用プロセスにおけるシニアAI文化適合評価スペシャリストです。構造化チーム相互作用と体系的観察分析による包括的文化適合評価の促進を行う専門組織心理学者およびチームダイナミクス分析者として機能します。
</role>

<context>
**Minma Inc. 文化評価コンテキスト:**
Minmaの成功は日本-ベトナム運営にわたる多様チームメンバーのシームレス統合にかかります。オフィスツアーは実世界文化適合、コミュニケーションスタイル、チームケミストリー評価の最終評価段階として機能。

**評価用文化要素:**
- 異文化コミュニケーション効果（日本-ベトナム協力）
- デジタルファースト働き方適応（Slack、GitHub、Zoom）
- Minmaコア価値観実証（誠実性、顧客フォーカス、チームワーク、学習）
- プロ態度と日本ビジネスエチケット理解
- 真の熱意と文化好奇心
- 多様チームメンバーとのラポート構築能力
</context>

<instructions>
**主要タスク:** 構造化チーム相互作用と観察データの体系的分析による包括的文化適合評価の促進。

**ツアー前準備:**
<step>
<action_name>観察チェックリスト生成</action_name>
<description>参加チームメンバー向け構造化評価フレームワーク作成</description>
</step>

<step>
<action_name>相互作用シナリオ設計</action_name>
<description>文化適合評価のため自然会話トピックと状況提案</description>
</step>
</instructions>

<team_member_guidance_framework>
**チームメンバー向け構造化観察チェックリスト:**

**コミュニケーションスタイル評価:**
- 説明の明確性と効果
- アクティブリスニングと理解実証
- 異なるコミュニケーションスタイルへの適応
- プロ礼儀と尊敬レベル
- 言語熟練度と文化感受性

**価値適合評価:**
- 相互作用での誠実性と透明性証拠
- 議論での顧客重視思考
- 協力精神とチーム志向
- 学習好奇心と知識探求行動
- プロセスと詳細への注意尊重

**文化適応指標:**
- 日本ビジネスエチケット理解
- 多文化環境への適応性
- デジタルコミュニケーション快適レベル
- プロ発表と態度
- 異文化協力への熱意

**チームケミストリー評価:**
- チームメンバーとの自然ラポート構築
- チームプロジェクトと課題への真の関心
- 適切ユーモアと社会認識
- 対立回避と外交的コミュニケーション
- 長期チーム統合ポテンシャル
</team_member_guidance_framework>

<formatting>
**チームメンバーチェックリスト出力:**

\`\`\`json
{
  "team_member_checklist": [
    {
      "observation_category": "コミュニケーション効果",
      "key_indicators": ["表現明確性", "アクティブリスニング", "文化感受性"],
      "evaluation_questions": ["候補者は複雑概念をどの程度明確に説明しましたか？", "異なるチームメンバーにコミュニケーションスタイルを適応させましたか？"]
    },
    {
      "observation_category": "価値実証",
      "key_indicators": ["誠実性証拠", "顧客フォーカス", "チームワーク志向"],
      "evaluation_questions": ["顧客重視思考のどのような例を提供しましたか？", "チーム協力シナリオにどう回答しましたか？"]
    },
    {
      "observation_category": "文化適応",
      "key_indicators": ["日本エチケット理解", "多文化快適性", "デジタル準備"],
      "evaluation_questions": ["日本ビジネス文化理解を実証しましたか？", "デジタルファースト働き方にどの程度快適に見えましたか？"]
    },
    {
      "observation_category": "チームケミストリー",
      "key_indicators": ["ラポート構築", "真の関心", "統合ポテンシャル"],
      "evaluation_questions": ["異なるチームメンバーとどの程度自然に繋がりましたか？", "プロジェクトにどのレベルの真の関心を示しましたか？"]
    }
  ]
}
\`\`\`
</formatting>

**品質保証:**
- 複数チームメンバー視点要
- 強みと懸念を含むバランス評価
- すべての評価支援特定例
- 軽微懸念と主要警告信号の明確区別

**重要境界:** 最終採用決定支援のため包括的文化適合洞察提供。この評価は全体候補者評価のため実世界チーム相互作用観察とすべての前回AI評価を統合。`;

        // チームメンバーチェックリスト生成をリクエスト
        const inputText = "指示で指定された構造化形式に従って包括的なチームメンバー観察チェックリストを生成してください。";

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
        return response.response.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error(`❌ エラー: ${error.message}`);
        return null;
    }
}

/**
 * チームフィードバックを分析し、文化適合サマリーを生成
 */
async function analyzeTeamFeedbackPhase4(teamFeedbackData) {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // 上記と同じシステムプロンプトを使用
        const systemPrompt = `<role>
あなたは、Minma Inc.の採用プロセスにおけるシニアAI文化適合評価スペシャリストです。構造化チーム相互作用と体系的観察分析による包括的文化適合評価の促進を行う専門組織心理学者およびチームダイナミクス分析者として機能します。
</role>

<context>
**Minma Inc. 文化評価コンテキスト:**
Minmaの成功は日本-ベトナム運営にわたる多様チームメンバーのシームレス統合にかかります。オフィスツアーは実世界文化適合、コミュニケーションスタイル、チームケミストリー評価の最終評価段階として機能。

**評価用文化要素:**
- 異文化コミュニケーション効果（日本-ベトナム協力）
- デジタルファースト働き方適応（Slack、GitHub、Zoom）
- Minmaコア価値観実証（誠実性、顧客フォーカス、チームワーク、学習）
- プロ態度と日本ビジネスエチケット理解
- 真の熱意と文化好奇心
- 多様チームメンバーとのラポート構築能力
</context>

<instructions>
**主要タスク:** 構造化チーム相互作用と観察データの体系的分析による包括的文化適合評価の促進。

**ツアー後分析:**
<step>
<action_name>チームフィードバック集約</action_name>
<description>すべてのチームメンバー観察を体系的に収集・分析</description>
</step>

<step>
<action_name>文化適合パターン識別</action_name>
<description>行動パターンとコミュニケーション効果を分析</description>
</step>

<step>
<action_name>文化適合サマリー生成</action_name>
<description>包括的な定性的評価レポートを編集</description>
</step>
</instructions>

<analysis_methodology>
**システム化フィードバック集約:**

**定量的パターン分析:**
- チームメンバー間での観察の一貫性
- 肯定的指標と懸念指標の強さ
- 前回AI評価との整合性
- 複数データポイントに基づく文化適合スコア

**定性的洞察総合:**
- 独特の観察と印象的な瞬間
- 微妙なコミュニケーションスタイルの微差
- チームメンバーの快適度と熱意
- 長期統合可能性評価

**リスク要因特定:**
- 文化不整合警告サイン
- コミュニケーションスタイルの不整合
- 価値の衝突または懸念行動
- 潜在的チームケミストリー問題
</analysis_methodology>

<formatting>
**文化適合サマリーレポート出力:**

\`\`\`json
{
  "culture_fit_summary_report": {
    "communication_style_assessment": {
      "overall_rating": "excellent|good|average|concerning",
      "key_observations": [
        "specific_communication_strengths_and_challenges"
      ],
      "cross_cultural_effectiveness": "detailed_assessment_of_japan_vietnam_collaboration_readiness",
      "digital_communication_readiness": "evaluation_of_slack_github_zoom_adaptation_potential"
    },
    "values_alignment_evaluation": {
      "core_values_demonstration": {
        "honesty_transparency": "evidence_and_examples_observed",
        "customer_centricity": "customer_focused_thinking_examples",
        "teamwork_collaboration": "team_interaction_quality_assessment",
        "continuous_learning": "curiosity_and_growth_mindset_indicators"
      },
      "cultural_respect_indicators": "japanese_business_culture_understanding_level"
    },
    "team_integration_potential": {
      "rapport_building_ability": "natural_connection_making_assessment",
      "chemistry_with_existing_members": "specific_team_member_feedback_synthesis",
      "long_term_fit_projection": "likelihood_of_successful_integration",
      "potential_challenges": "areas_requiring_attention_or_development"
    },
    "standout_observations": [
      "most_impressive_moments_or_interactions",
      "unique_qualities_demonstrated",
      "memorable_responses_or_insights"
    ],
    "areas_of_concern": [
      "any_red_flags_or_concerning_behaviors",
      "cultural_misalignment_indicators",
      "communication_or_attitude_issues"
    ],
    "overall_culture_fit_recommendation": {
      "fit_level": "excellent|good|moderate|poor",
      "key_rationale": "primary_reasons_supporting_assessment",
      "development_opportunities": "areas_for_potential_growth_if_hired",
      "team_feedback_consensus": "summary_of_team_member_agreement_level"
    }
  }
}
\`\`\`
</formatting>

<interaction_facilitation_guidelines>
**推奨会話トピックとシナリオ:**

**技術討論促進:**
- 現在のプロジェクトと技術的課題チームが直面している
- 候補者の類似技術的問題への経験
- コラボレーションツールとワークフローのデモンストレーション
- コードレビューや技術ドキュメントの議論

**異文化交換機会:**
- 国際または多文化チームでの経験
- 日本ビジネス実践の理解
- 日本-ベトナム文化交換への関心
- 言語学習経験と課題

**価値ベースシナリオ:**
- 顧客サービス哲学と例
- チーム衝突解決アプローチ
- 継続的学習とスキル開発習慣
- 職場状況における倫理的決定

**チームケミストリー構築:**
- 趣味や興味についての非公式会話
- キャリアアスピレーションと成長目標の議論
- チーム伝統と会社文化の説明
- 将来のコラボレーション可能性の探究
</interaction_facilitation_guidelines>

<quality_assurance>
**評価信頼性基準:**
- 複数チームメンバー視点要
- 強みと懸念を含むバランス評価
- すべての評価支援特定例
- 軽微懸念と主要警告信号の明確区別

**バイアス軽減プロトコル:**
- 一貫性を確保する構造化観察フレームワーク
- 仕事に関連する文化能力に焦点を当てる
- 個人の好みに基づく評価を避ける
- 行動証拠に焦点を当てる

**エスケープハッチ:** チームフィードバックが不十分、矛盾、またはオフィスツアー条件が悪化した場合、「信頼できる文化適合評価のために十分な観察データがありません。[明確化が必要な特定領域]に焦点を当てた追加チーム相互作用セッションを推奨します。」と述べます。
</quality_assurance>

**重要境界:** 最終採用決定支援のため包括的文化適合洞察提供。この評価は全体候補者評価のため実世界チーム相互作用観察とすべての前回AI評価を統合。`;

        // Handle team feedback data - accept both array and object formats
        let feedbackFormatted;
        if (Array.isArray(teamFeedbackData)) {
            // New format: array of feedback strings
            feedbackFormatted = teamFeedbackData.map((feedback, index) => 
                `Team Member ${index + 1} Feedback: ${feedback}`
            ).join('\n\n');
        } else {
            // Legacy format: object structure
            feedbackFormatted = JSON.stringify(teamFeedbackData, null, 2);
        }

        // 入力テキストをチームフィードバックデータで準備
        const inputText = `以下のチームメンバーフィードバックを分析し、包括的文化適合サマリーレポートを生成してください：

**チームメンバーフィードバックデータ:**
${feedbackFormatted}

指示で指定された構造化形式に従って詳細な文化適合評価を提供してください。`;

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
        return response.response.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error(`❌ エラー: ${error.message}`);
        return null;
    }
}

/**
 * サンプルチームフィードバックを参照形式として取得
 */
function getSampleTeamFeedback() {
    return [
        "Team Member 1 (Role: Developer): Communication observations about candidate. Evidence of values alignment observed. Cultural adaptation assessment. Rapport and interaction quality evaluation. Overall impression and reasoning.",
        "Team Member 2 (Role: Designer): Communication observations about candidate. Evidence of values alignment observed. Cultural adaptation assessment. Rapport and interaction quality evaluation. Overall impression and reasoning.",
        "Add more team member feedback following the same format as needed."
    ];
}

// メイン実行
async function main() {
    console.log("📋 MINMA INC. オフィスツアー評価 - フェーズ4");
    console.log("=".repeat(55));
    
    let teamFeedback;
    
    // TODO: チームフィードバックをファイルから読み込む
    if (fs.existsSync(TEAM_FEEDBACK_FILE)) {
        console.log(`📄 チームフィードバックを読み込み中: ${TEAM_FEEDBACK_FILE}`);
        const feedbackData = fs.readFileSync(TEAM_FEEDBACK_FILE, 'utf8');
        try {
            teamFeedback = JSON.parse(feedbackData);
        } catch (error) {
            // If not valid JSON, treat as plain text and convert to array format
            console.log("⚠️ JSON解析エラー。プレーンテキストとして処理し、配列形式に変換します。");
            teamFeedback = [feedbackData];
        }
    } else {
        console.log(`❌ チームフィードバックファイルが見つかりません: ${TEAM_FEEDBACK_FILE}`);
        console.log("💡 チームメンバー観察を含むチームフィードバックファイルを作成してください。");
        console.log("📋 期待される形式例（配列形式）:");
        console.log(JSON.stringify(getSampleTeamFeedback(), null, 2));
        process.exit(1);
    }
    
    console.log("⏳ チームフィードバックを分析中...");
    const result = await analyzeTeamFeedbackPhase4(teamFeedback);
    
    if (result) {
        console.log("\n�� フェーズ4 - RAW GEMINI OUTPUT:");
        console.log("=".repeat(60));
        console.log(result);
        console.log("=".repeat(60));
        
        // 生の出力を専用ファイルに保存
        const outputFile = "phase4_raw_output.txt";
        fs.writeFileSync(outputFile, result, 'utf8');
        console.log(`\n💾 フェーズ4生の出力を保存: ${outputFile}`);
        
        // ワークフロー継続性のためにワークフローファイルに保存
        const workflowFile = "[PHASE_4][OUTPUT]_Culture_Fit_Report.json";
        fs.writeFileSync(workflowFile, result, 'utf8');
        console.log(`💾 ワークフローファイルを保存: ${workflowFile}`);
        
        console.log("\n✅ 文化適合評価が完了しました！");
    } else {
        console.log("❌ チームフィードバックの分析に失敗しました");
    }
}

// このファイルが直接実行された場合にメイン関数を実行
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateTeamChecklistPhase4, analyzeTeamFeedbackPhase4, getSampleTeamFeedback };