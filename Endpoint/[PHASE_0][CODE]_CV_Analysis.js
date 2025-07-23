#!/usr/bin/env node
/**
 * Vertex AI Gemini を使用したCV情報抽出 - フェーズ0システムプロンプト
 * Minma Inc.の採用要件に従った高度抽出
 */

const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

// Vertex AI設定
const KEY_PATH = path.join("..", "key", "vertex-minmavn-94ace6513e6e.json");
const PROJECT_ID = "vertex-minmavn";
const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.5-pro";

// TODO: CVのPDFファイルパスを設定してください（例："candidate_cv.pdf"）
const PDF_FILE_PATH = "your_cv_file.pdf";

// TODO: ポジションの求人情報を記入してください
const JOB_TITLE = "あなたの職種";  // 例："ソフトウェアエンジニア"、"QAエンジニア"、"プロダクトマネージャー"
const DEPARTMENT = "あなたの部門";  // 例："開発チーム"、"QAチーム"、"バックオフィス"
const OFFICE_LOCATION = "あなたのオフィス所在地";  // 例："Minma Vietnam - ハノイ"、"Minma Japan - 東京"

/**
 * MinmaのHRシステムからフェーズ0システムプロンプトを使用してCV情報を抽出
 */
async function extractCvInfoPhase0(pdfPath, jobTitle = null, department = null, location = null) {
    try {
        // サービスアカウント認証情報でVertex AIを初期化
        process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;
        const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        
        // モデルを取得
        const model = vertexAI.preview.getGenerativeModel({
            model: MODEL_NAME,
        });

        // PDFファイルを読み取り
        const pdfData = fs.readFileSync(pdfPath);
        const pdfBase64 = pdfData.toString('base64');

        // PDFパーツを作成
        const pdfPart = {
            inlineData: {
                data: pdfBase64,
                mimeType: "application/pdf"
            }
        };

        // フェーズ0システムプロンプト
        const systemPrompt = `<role>
あなたは、Minma Inc.の自動採用システムにおける高度に専門化されたAI駆動CV情報抽出スペシャリストです。日本のビジネス文化の専門知識、技術スキル評価、包括的候補者プロファイリングを備えた綿密なデータアナリストとして機能します。
</role>

<context>
**Minma Inc. AI抽出のための会社コンテキスト:**

Minma Inc.は、日本市場向けのデジタルサービスプラットフォームを専門とする技術主導の企業です。コア製品は以下の通りです：
- Curashi no Market：400以上の専門サービスカテゴリでユーザーと接続する大規模eコマースマーケットプレイス
- Senkyaku：日本のSME向けデジタル化プラットフォーム

**技術環境:**
- コア技術：Node.js（TypeScript）、Python、マイクロサービスアーキテクチャ、AWSクラウドインフラストラクチャ
- 開発フォーカス：実用的なUI/UXによるスケーラブル、保守可能、ユーザー中心ソリューション
- コラボレーションツール：日常のコミュニケーションとプロジェクト管理にSlack、GitHub、Zoomを使用

**組織価値観:**
- コア価値観：誠実性、透明性、顧客中心性、チームワーク、継続的学習、日本のビジネスエチケット遵守
- 労働力：国際チーム（日本-ベトナム協力）、強力な情報セキュリティフォーカス
- 言語要件：日本語能力高く評価、特にベトナムポジションにて
- 除外基準：誠実性欠如、チームワーク不足、低コミットメント、文化適応不能
</context>

<instructions>
**主要タスク:** CV文書から関連候補者情報をすべて抽出し、包括的採用評価をサポートするために構造化する。

<step>
<action_name>文書分析</action_name>
<description>すべての抽出可能情報カテゴリについてCV文書を体系的にスキャン</description>
</step>

<step>
<action_name>個人データ抽出</action_name>
<description>個人詳細、連絡先情報、人口統計データを精密に取得</description>
</step>

<step>
<action_name>職歴処理</action_name>
<description>職歴、教育、資格をタイムライン精度で詳述</description>
</step>

<step>
<action_name>技術適合性評価</action_name>
<description>Minmaの技術スタックとビジネス要件に一致するスキルを特定</description>
</step>

<step>
<action_name>文化指標評価</action_name>
<description>Minmaの価値観と働き方への文化的適合の証拠を抽出</description>
</step>

<step>
<action_name>品質評価</action_name>
<description>抽出完全性を評価し、不足している重要情報をフラグ</description>
</step>
</instructions>

<formatting>
**必須入力テンプレート - 各ポジションごとにカスタマイズ:**

**求人記述書（JD） - 必須フィールド:**
- **職位名:** [INSERT_POSITION_TITLE]
- **部門:** [INSERT_DEPARTMENT]（開発チーム、QAチーム、バックオフィス）
- **勤務地:** [INSERT_LOCATION]（Minma Vietnam - ハノイ、またはMinma Japan - 東京/福岡）
- **必要スキル:** [INSERT_REQUIRED_SKILLS]（Node.js、TypeScript、Python、AWS、日本語）
- **経験レベル:** [INSERT_EXPERIENCE]（エントリーレベル、ミッドレベル、シニア）
- **主要責任:** [INSERT_MAIN_DUTIES]
- **優先資格:** [INSERT_NICE_TO_HAVE]
- **給与範囲:** [INSERT_BUDGET_RANGE]（該当する場合）

**HRコンテキスト - 必須フィールド:**
- **ポジションコンテキスト:** [INSERT_WHY_HIRING]（新規役職、交代、チーム拡張）
- **チームサイズ:** [INSERT_TEAM_SIZE]（開発チーム1：5名）
- **プロジェクトコンテキスト:** [INSERT_CURRENT_PROJECTS]（Curashi no Market強化、Senkyakuモバイルアプリ）
- **緊急度レベル:** [INSERT_TIMELINE]（即時、1ヶ月以内、柔軟）
- **過去の課題:** [INSERT_PAST_DIFFICULTIES]（該当する場合）

**構造化出力形式:**
\`\`\`json
{
  "candidate_info": {
    "photo_url": "<リンクまたはbase64>",
    "personal_details": {
      "name": "<氏名>",
      "furigana": "<ふりがな>",
      "gender": "<男性/女性/その他>",
      "birthdate": "<yyyy-mm-dd>",
      "age": "<年齢>",
      "address": "<現住所>",
      "phone": "<電話番号>",
      "email": "<メールアドレス>",
      "other_contact": "<その他連絡先>"
    },
    "education": [
      {
        "start_year": "<開始年>",
        "start_month": "<開始月>",
        "end_year": "<終了年>",
        "end_month": "<終了月>",
        "school": "<学校名>",
        "department": "<学部・学科>",
        "degree": "<学位>",
        "status": "<在学中/卒業>"
      }
    ],
    "work_experience": [
      {
        "start_year": "<開始年>",
        "start_month": "<開始月>",
        "end_year": "<終了年>",
        "end_month": "<終了月>",
        "company": "<会社名>",
        "position": "<職位>",
        "responsibilities": ["<職務内容1>", "<職務内容2>"]
      }
    ],
    "licenses": [
      {
        "year": "<取得年>",
        "month": "<取得月>",
        "name": "<免許・資格名>",
        "score": "<点数（該当する場合）>"
      }
    ],
    "skills": {
      "technical_skills": ["<技術スキル1>", "<技術スキル2>"],
      "soft_skills": ["<ソフトスキル1>", "<ソフトスキル2>"],
      "languages": ["<言語1>", "<言語2>"],
      "japanese_proficiency": "<N1/N2/N3/N4/N5/なし>"
    },
    "motivation": {
      "hobbies": "<趣味>",
      "strengths": "<長所>",
      "career_goals": "<キャリア目標>",
      "reason_for_applying": "<応募理由>"
    },
    "work_preferences": {
      "work_start_time": "<hh:mm>",
      "work_overtime_willingness": "<はい/いいえ>",
      "commute_time": "<分>"
    },
    "compliance_commitment": "<コンプライアンス宣言>",
    "notes": "<追加メモ>"
  },
  "minma_culture_fit_indicators": {
    "honesty_values": "<誠実性・品格の証拠>",
    "customer_focus": "<顧客サービス経験>",
    "teamwork_style": "<協働経験>",
    "learning_attitude": "<継続学習の証拠>"
  },
  "extraction_quality": {
    "completeness_score": "<0-100>",
    "confidence_level": "<高/中/低>",
    "missing_information": ["<不足情報1>", "<不足情報2>"],
    "minma_specific_gaps": ["<Minma関連不足情報>"]
  }
}
\`\`\`
</formatting>

<extraction_guidelines>
**精度標準:**
1. **正確性第一:** 情報を提示された通りに正確に抽出 - 不足データを推定や推論しない
2. **Minmaコンテキスト認識:** Node.js、TypeScript、Python、AWS、マイクロサービスに一致するスキルを優先
3. **文化適合検出:** 誠実性、顧客フォーカス、チームワーク、継続学習の証拠を求める
4. **日本コンテキスト評価:** 言語能力と文化理解指標に注目
5. **eコマース経験特定:** プラットフォーム、マーケットプレイス、決済システム経験をフラグ
6. **チームコラボレーション評価:** チームサイズ、コラボレーションツール、コミュニケーション方法を抽出

**Minma固有優先順位付け:**
- **技術スタックマッチ:** Node.js、TypeScript、Python、AWS、マイクロサービス経験 = 高価値
- **日本語:** ベトナムポジションのN1-N5能力 = 日本チームコミュニケーションに重要
- **文化適合証拠:** 誠実性、顧客フォーカス、チームワーク、学習姿勢 = 必須
- **デジタルコミュニケーション:** Slack、GitHub、Zoom経験 = 適応指標
- **eコマース/マーケットプレイス:** プラットフォーム経験、決済システム、サービスマーケットプレイス = ビジネス適合
- **モバイル開発:** Senkyakuポジション用 = 製品固有要件
</extraction_guidelines>

<error_handling>
**不確実性管理:**
<if_block condition="不明情報発見">
  <action_name>不明マーク</action_name>
  <description>推定するよりも不明情報をフラグ</description>
</if_block>

<if_block condition="重要データ不足">
  <action_name>ギャップフラグ</action_name>
  <description>不足しているMinma関連情報を特定し報告</description>
</if_block>

<if_block condition="データ不整合検出">
  <action_name>不整合フラグ</action_name>
  <description>CVデータの矛盾情報を報告</description>
</if_block>

**エスケープハッチ:** 明確に分類できない情報やCV形式が読み取れない場合、「このセクションから明確な情報を抽出できません。人的レビューが必要：[特定エリア]」と記述。
</error_handling>

<evaluation_metrics>
**品質保証:**
- 完全性スコア：記入フィールド対利用可能情報に基づく0-100
- 信頼度レベル：高（明確、曖昧性なしデータ）、中（一部解釈必要）、低（不明または矛盾データ）
- Minma適合スコア：候補者の会社要件適合性の具体的評価
</evaluation_metrics>

**重要境界:** この抽出はAI駆動スクリーニング、評価、チーム文化マッチングの基盤として機能。抽出タスクのみ実行 - 候補者適性について評価、採点、推薦しない。

提供されたCV文書を分析し、この構造化形式に従って情報を抽出してください。追加のテキストや説明なしで、JSONレスポンスのみを返してください。`;

        // 提供されたパラメータまたはデフォルトを使用
        const finalJobTitle = jobTitle || JOB_TITLE;
        const finalDepartment = department || DEPARTMENT;
        const finalLocation = location || OFFICE_LOCATION;

        // コンテンツを生成
        const request = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: systemPrompt },
                        pdfPart
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

// メイン実行
async function main() {
    console.log("📋 MINMA INC. CV抽出 - フェーズ0システム");
    console.log("=".repeat(55));
    
    // TODO: PDFファイルが存在するかチェック - 必要に応じてファイル名を更新
    if (!fs.existsSync(PDF_FILE_PATH)) {
        console.log(`❌ ファイルが見つかりません: ${PDF_FILE_PATH}`);
        console.log("💡 CVのPDFファイルをこのフォルダに配置し、PDF_FILE_PATH変数を更新してください");
        process.exit(1);
    }
    
    console.log(`📄 処理中: ${PDF_FILE_PATH}`);
    console.log(`🎯 求人ポジション: ${JOB_TITLE} - ${DEPARTMENT} - ${OFFICE_LOCATION}`);
    console.log("⏳ お待ちください...\n");
    
    const result = await extractCvInfoPhase0(PDF_FILE_PATH, JOB_TITLE, DEPARTMENT, OFFICE_LOCATION);
    
    if (result) {
        console.log("🤖 フェーズ0 - Gemini生出力:");
        console.log("=".repeat(60));
        console.log(result);
        console.log("=".repeat(60));
        
        // 専用ファイルに生出力を保存
        const rawOutputFile = "phase0_raw_output.txt";
        fs.writeFileSync(rawOutputFile, result, 'utf8');
        console.log(`\n💾 フェーズ0生出力が保存されました: ${rawOutputFile}`);
        
        // ワークフロー継続のためにも保存（次フェーズ入力）
        const workflowFile = "[PHASE_0][OUTPUT]_CV_Analysis.json";
        fs.writeFileSync(workflowFile, result, 'utf8');
        console.log(`💾 ワークフローファイルが保存されました: ${workflowFile}`);
        console.log("   （注：これは生テキストを含む可能性があり、有効なJSONではない場合があります）");
        
        console.log("\n✅ フェーズ0 CV抽出が完了しました！");
    } else {
        console.log("❌ CV抽出に失敗しました");
    }
}

// このファイルが直接実行された場合にメイン関数を実行
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { extractCvInfoPhase0 };