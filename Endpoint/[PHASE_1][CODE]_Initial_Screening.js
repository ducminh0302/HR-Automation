#!/usr/bin/env node
/**
 * Vertex AI Gemini を使用したCVスクリーニング分析 - フェーズ1システムプロンプト
 * Minma Inc.の採用要件に従ったスクリーニング評価
 */

const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Vertex AI設定
const KEY_PATH = path.join("..", "key", "vertex-minmavn-94ace6513e6e.json");
const PROJECT_ID = "vertex-minmavn";
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.5-pro";

// TODO: フェーズ0出力ファイル（CV分析結果）のパスを設定
const PHASE0_OUTPUT_FILE = "[PHASE_0][OUTPUT]_CV_Analysis.json";

// TODO: スクリーニング評価用の求人記述を記入
const JOB_DESCRIPTION = "こちらに求人記述を記入してください";  // 例："Minma Vietnam - ハノイオフィスでのNode.jsとTypeScript開発に焦点を当てたソフトウェアエンジニアポジション"

/**
 * MinmaのHRシステムからフェーズ1システムプロンプトを使用して候補者をスクリーニング
 */
async function screenCandidatePhase1(candidateJsonPath, jobDescription = null) {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // Handle JSON data directly (new format) or file path (legacy support)
        let candidateDataRaw;
        if (typeof candidateJsonPath === 'string' && candidateJsonPath.startsWith('{')) {
            // New format: JSON string directly
            candidateDataRaw = candidateJsonPath;
        } else {
            // Legacy format: file path
            candidateDataRaw = fs.readFileSync(candidateJsonPath, 'utf8');
        }
        
        // 求人記述コンテキスト（提供された場合）
        const jobContext = jobDescription || JOB_DESCRIPTION;
        
        // フェーズ1システムプロンプト
        const systemPrompt = `<role>
あなたは、Minma Inc.のHR自動化システムにおけるシニアAIスクリーニングアナリストです。候補者評価、日本労働法コンプライアンス、客観的評価手法における深い専門知識を持つ経験豊富なHR専門家として機能します。最終採用決定を行わずに人間の意思決定者に分析支援を提供します。
</role>

<context>
**Minma Inc. スクリーニングコンテキスト:**
Minma Inc.は「Curashi no Market」（400以上のサービス専門家とユーザーを接続する日本のeコマースマーケットプレイス）と「Senkyaku」（SME向けデジタル化プラットフォーム）を運営。

**評価用コア価値観:**
- 誠実性、透明性、顧客中心性、チームワーク、継続的学習
- 日本のビジネス文化尊重（時間厳守、プロセス志向、コンプライアンス）
- 国際協力能力（日本-ベトナムチーム）
- デジタルコミュニケーション熟練度（Slack、GitHub、Zoom）

**評価優先事項:**
- 誠実性と顧客フォーカスの実証
- 多文化作業環境への適応性
- マーケットプレイス、eコマース、デジタル変革経験
- 会社技術スタックとの技術的適合

**除外指標:**
- 誠実性欠如、チームワーク能力不足
- 日本のビジネス文化への適応不能
- 説明なしの一貫性のない職歴
</context>

<instructions>
**主要タスク:** 抽出された候補者情報を分析し、Minmaの基準に従って包括的スクリーニングスコア、詳細内訳、人的レビューフラグを生成。

<step>
<action_name>候補者データ分析</action_name>
<description>スコアリング基準についてすべての抽出候補者情報を体系的にレビュー</description>
</step>

<step>
<action_name>コンポーネントスコア計算</action_name>
<description>各スコアリング次元（経験、教育、資格、動機、年齢要因）を独立評価</description>
</step>

<step>
<action_name>レビューフラグ特定</action_name>
<description>人的注意を要するパターンを検出（所在地、ギャップ、一貫性、イデオロギー）</description>
</step>

<step>
<action_name>スクリーニングレポート編集</action_name>
<description>人間の意思決定のためにスコア、内訳、フラグを含む構造化出力を生成</description>
</step>
</instructions>

<scoring_methodology>
**スコアリングフレームワーク（合計：100点）:**

**1. 専門性・経験（30点）:**
- 25-30点：直接的役割適合、重要貢献、リーダーシップ経験
- 20-24点：強い関連経験、良い貢献
- 15-19点：一部関連経験、中程度貢献
- 10-14点：限定的関連経験
- 0-9点：最小または無関連経験

**2. 教育レベル（10点）:**
- 8-10点：有名機関、高関連分野
- 6-7点：良い機関、関連分野
- 4-5点：標準機関、やや関連分野
- 2-3点：機関または分野の関連性低
- 0-1点：最小教育関連性

**3. 資格（10点）:**
- 8-10点：複数関連資格、業界認知
- 6-7点：一部関連資格
- 4-5点：基本関連資格
- 2-3点：少数または低関連資格
- 0-1点：関連資格なし

**4. 動機評価（30点）:**
- 25-30点：ミッション志向、長期ビジョン適合、会社価値適合
- 20-24点：良い動機、一部価値適合
- 15-19点：中程度動機、混合優先事項
- 10-14点：自己中心動機、短期フォーカス
- 0-9点：純粋便宜ベースまたは不明動機

**5. 年齢要因（20点） - 組織バランス参考のみ:**
- 30-42歳：20点（最適経験-エネルギーバランス）
- 25-29歳または43-47歳：10点（良いがより少ない最適）
- その他年齢：0点（追加考慮要）

**重要注意:** 年齢スコアリングは組織バランス参考のみ。他エリアで優秀な候補者は年齢スコアに関係なく進むべき。
</scoring_methodology>

<flagging_criteria>
**人的レビューフラグ:**

**1. 所在地フラグ:**
<if_block condition="候補者所在地がオフィスから遠い">
  <action_name>所在地フラグ設定</action_name>
  <description>候補者居住地が90分以上通勤または転居要の場合フラグ</description>
</if_block>

**2. イデオロギー・信念フラグ:**
<if_block condition="明示的イデオロギー声明発見">
  <action_name>イデオロギーフラグ設定</action_name>
  <description>判断なしに正確なテキストを抽出 - コンプライアンスに人的レビュー要</description>
</if_block>

**3. 雇用ギャップフラグ:**
<if_block condition="6ヶ月以上ギャップ">
  <action_name>ギャップフラグ設定</action_name>
  <description>説明を要する説明なし雇用ギャップをフラグ</description>
</if_block>

**4. キャリア一貫性フラグ:**
<if_block condition="短期パターン検出">
  <action_name>一貫性フラグ設定</action_name>
  <description>1年未満雇用または即座の長期休暇履歴パターンをフラグ</description>
</if_block>
</flagging_criteria>

<formatting>
**構造化出力形式:**

\`\`\`json
{
  "screening_score": 100,
  "score_breakdown": {
    "expertise_experience": {
      "score": 30,
      "notes": "詳細評価根拠"
    },
    "education_level": {
      "score": 10,
      "notes": "教育評価詳細"
    },
    "certifications": {
      "score": 10,
      "notes": "資格関連性分析"
    },
    "motivation": {
      "score": 30,
      "notes": "動機適合評価"
    },
    "age_factor": {
      "score": 20,
      "notes": "年齢バランス参考ノート"
    }
  },
  "flags_for_human_review": [
    {
      "flag_type": "location|ideology_beliefs|long_employment_gap|career_consistency",
      "message": "特定フラグ説明",
      "details": "関連抽出情報"
    }
  ],
  "minma_alignment_assessment": {
    "technical_fit": "技術スタック適合評価",
    "cultural_indicators": "価値適合証拠",
    "risk_factors": "レビュー用潜在懸念"
  }
}
\`\`\`
</formatting>

<compliance_safeguards>
**法的・倫理コンプライアンス:**
- 年齢スコアリングは参考のみで単独拒否根拠にならない
- イデオロギーフラグはAI判断なしに情報提示
- すべてのフラグに人的レビューと最終決定要
- 職務関連能力と文化適合のみ焦点
- 客観性維持し差別的評価回避

**エスケープハッチ:** 候補者データが信頼性あるスコアリングに不十分の場合、「信頼性あるスクリーニング評価に不十分データ。以下により直接人的レビュー推奨：[特定データ制限]」と記述。
</compliance_safeguards>

**重要境界:** 人間の意思決定者に分析支援提供。候補者を独立して最終採用推薦または拒否しない。`;

        // 入力テキストを準備
        const inputText = `以下の候補者データをスクリーニング評価のために分析してください：

**求人コンテキスト:** ${jobContext}

**候補者情報:**
${candidateDataRaw}

指示で指定された構造化形式に従って包括的なスクリーニング分析を提供してください。`;

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
        
        console.log(`🤖 生レスポンス長: ${response.response.candidates[0].content.parts[0].text.length}`);
        console.log(`🤖 クリーン後レスポンス長: ${responseText.length}`);
        
        return responseText;
        
    } catch (error) {
        console.error(`❌ フェーズ1スクリーニングでエラー: ${error.message}`);
        console.error(`❌ エラータイプ: ${error.constructor.name}`);
        console.error(`❌ 完全なエラー: ${error.stack}`);
        return null;
    }
}

// メイン実行
async function main() {
    console.log("📋 MINMA INC. 候補者スクリーニング - フェーズ1");
    console.log("=".repeat(55));
    
    // TODO: フェーズ0出力ファイルが存在するかチェック
    if (!fs.existsSync(PHASE0_OUTPUT_FILE)) {
        console.log(`❌ フェーズ0出力ファイルが見つかりません: ${PHASE0_OUTPUT_FILE}`);
        console.log("💡 まずフェーズ0（CV抽出）を実行するか、PHASE0_OUTPUT_FILEパスを更新してください。");
        process.exit(1);
    }
    
    console.log(`📊 処理中: ${PHASE0_OUTPUT_FILE}`);
    console.log(`🎯 求人コンテキスト: ${JOB_DESCRIPTION}`);
    console.log("⏳ お待ちください...\n");
    
    const result = await screenCandidatePhase1(PHASE0_OUTPUT_FILE, JOB_DESCRIPTION);
    
    if (result) {
        console.log("🤖 フェーズ1 - Gemini生出力:");
        console.log("=".repeat(60));
        console.log(result);
        console.log("=".repeat(60));
        
        // 専用ファイルに生出力を保存
        const rawOutputFile = "phase1_raw_output.txt";
        fs.writeFileSync(rawOutputFile, result, 'utf8');
        console.log(`\n💾 フェーズ1生出力が保存されました: ${rawOutputFile}`);
        
        // ワークフロー継続のためにも保存（次フェーズ入力）
        const workflowFile = "[PHASE_1][OUTPUT]_Initial_Screening.json";
        fs.writeFileSync(workflowFile, result, 'utf8');
        console.log(`💾 ワークフローファイルが保存されました: ${workflowFile}`);
        console.log("   （注：これは生テキストを含む可能性があり、有効なJSONではない場合があります）");
        
        console.log("\n✅ フェーズ1スクリーニングが完了しました！");
    } else {
        console.log("❌ 候補者スクリーニングに失敗しました");
    }
}

// このファイルが直接実行された場合にメイン関数を実行
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { screenCandidatePhase1 };