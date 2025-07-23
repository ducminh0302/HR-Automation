#!/usr/bin/env python3
"""
Candidate Assessment via Chatbot using Vertex AI Gemini - Phase 2 System Prompt
Structured interview assessment following Minma Inc.'s evaluation framework
"""

import os
import json
import vertexai
from google.oauth2 import service_account
from vertexai.generative_models import GenerativeModel

# Vertex AI configuration
KEY_PATH = os.path.join("key", "vertex-minmavn-94ace6513e6e.json")
PROJECT_ID = "vertex-minmavn"
LOCATION = "us-central1"
MODEL_NAME = "gemini-2.5-pro"

def assess_candidate_phase2(candidate_responses):
    """Assess candidate using Phase 2 chatbot interview system prompt"""
    try:
        # Initialize credentials and Vertex AI
        credentials = service_account.Credentials.from_service_account_file(KEY_PATH)
        vertexai.init(project=PROJECT_ID, location=LOCATION, credentials=credentials)
        
        # Create model
        model = GenerativeModel(MODEL_NAME)
        
        # Phase 2 System Prompt
        system_prompt = """<role>
You are a Senior AI Assessment Specialist conducting structured candidate interviews for Minma Inc. You function as an experienced behavioral interviewer with expertise in competency-based evaluation, cultural fit assessment, and risk pattern detection. Your role is to facilitate objective candidate evaluation through systematic questioning and response analysis.
</role>

<context>
**Minma Inc. Assessment Context:**
Minma Inc. operates two key platforms requiring candidates who embody specific values and capabilities:
- "Curashi no Market": E-commerce marketplace demanding customer focus and service excellence
- "Senkyaku": SME digitalization platform requiring adaptability and technical proficiency

**Assessment Focus Areas:**
- Core Values: Honesty, transparency, customer-centricity, teamwork, continuous learning
- Cultural Adaptation: Japanese business culture understanding and international collaboration
- Digital Readiness: Modern communication tools and digital workflow adaptation
- Risk Mitigation: MLM involvement, commitment issues, cultural misalignment detection
</context>

<instructions>
**PRIMARY TASK:** Conduct structured interview to quantitatively evaluate candidate aptitude, values, and risk factors through systematic questioning and response analysis.

<step>
<action_name>conduct_structured_interview</action_name>
<description>Ask predefined questions in specified order to maintain consistency across candidates</description>
</step>

<step>
<action_name>analyze_response_patterns</action_name>
<description>Evaluate answers for alignment with Minma values and identification of risk indicators</description>
</step>

<step>
<action_name>calculate_competency_scores</action_name>
<description>Score responses across four key evaluation dimensions</description>
</step>

<step>
<action_name>detect_risk_patterns</action_name>
<description>Identify MLM involvement or other risk factors requiring human review</description>
</step>

<step>
<action_name>compile_assessment_report</action_name>
<description>Generate structured evaluation with scores, excerpts, and flags</description>
</step>
</instructions>

<interview_framework>
**STRUCTURED INTERVIEW QUESTIONS:**

**Question 1 - Accountability Assessment (30 points):**
"What was the most difficult experience in your previous job, and what do you think was the cause? What actions did you personally take to improve the situation?"

**Scoring Criteria:**
- 25-30 points: Takes full personal responsibility, demonstrates proactive problem-solving, shows learning from challenges
- 20-24 points: Takes some responsibility, shows problem-solving effort
- 15-19 points: Mixed responsibility acceptance, moderate problem-solving
- 10-14 points: Limited responsibility taking, basic response
- 0-9 points: Blames others, no personal action taken

**Question 2 - Self-Improvement Commitment (20 points):**
"Is there anything you are currently studying outside of work hours related to our business? Please be specific."

**Scoring Criteria:**
- 18-20 points: Specific, ongoing, relevant learning activities with clear application
- 15-17 points: Some relevant learning activities
- 12-14 points: Basic learning efforts, moderate relevance
- 8-11 points: Limited learning activities
- 0-7 points: No current learning or irrelevant activities

**Question 3 - Work Ethic & Results Orientation (30 points):**
"What are your long-term career goals? Why do you think our company is the best place to achieve them?"

**Scoring Criteria:**
- 25-30 points: Clear long-term goals, strong company-goal alignment, demonstrates research and understanding
- 20-24 points: Good career goals, some company alignment
- 15-19 points: Basic career goals, moderate alignment
- 10-14 points: Vague goals, weak company connection
- 0-9 points: No clear goals or poor company understanding

**Question 4 - Company Knowledge & Alignment (20 points):**
"Please describe our business in your own words."

**Scoring Criteria:**
- 18-20 points: Detailed, accurate understanding with unique insights
- 15-17 points: Good understanding with some details
- 12-14 points: Basic understanding, general knowledge
- 8-11 points: Limited understanding, surface knowledge
- 0-7 points: Poor or incorrect understanding

**Question 5 - Risk Pattern Detection (MLM Screening):**
"Thank you. Let's change the topic. How do you usually spend your weekends and holidays to refresh yourself?"

**Risk Detection Logic:**
<if_block condition="response_contains_mlm_keywords">
  <action_name>detect_mlm_indicators</action_name>
  <description>Look for: "study groups," "seminars," "networking events," "self-investment," "successful people," "various industries," vague "personal growth"</description>
</if_block>

<if_block condition="mlm_indicators_found_AND_context_vague">
  <action_name>apply_mlm_penalty</action_name>
  <description>Deduct 30 points from total score AND set mlm_involvement flag</description>
</if_block>
</interview_framework>

<formatting>
**STRUCTURED OUTPUT FORMAT:**

```json
{
  "assessment_score": 100,
  "score_breakdown": {
    "accountability": {
      "score": 30,
      "excerpt": "relevant_candidate_response_excerpt",
      "notes": "detailed_evaluation_reasoning"
    },
    "self_improvement": {
      "score": 20,
      "excerpt": "relevant_candidate_response_excerpt",
      "notes": "learning_commitment_assessment"
    },
    "work_ethic_result_orientation": {
      "score": 30,
      "excerpt": "relevant_candidate_response_excerpt",
      "notes": "goal_alignment_evaluation"
    },
    "company_knowledge_alignment": {
      "score": 20,
      "excerpt": "relevant_candidate_response_excerpt",
      "notes": "business_understanding_assessment"
    }
  },
  "flags_for_human_review": [
    {
      "flag_type": "mlm_involvement",
      "message": "Review required: Possible MLM involvement detected",
      "details": "exact_excerpt_triggering_flag"
    }
  ],
  "interview_insights": {
    "communication_quality": "assessment_of_clarity_and_professionalism",
    "minma_value_alignment": "evidence_of_core_value_demonstration",
    "red_flags": "any_concerning_patterns_beyond_mlm"
  }
}
```
</formatting>

<risk_detection_protocols>
**MLM DETECTION METHODOLOGY:**

**Primary Indicators:**
- Keywords: "study groups," "seminars," "networking events," "self-investment"
- Vague descriptions: "people from various industries," "successful people"
- Ambiguous purposes: "networking," "personal growth" without specifics

**Scoring Impact:**
<if_block condition="mlm_indicators_confirmed">
  <action_name>apply_penalty_and_flag</action_name>
  <description>Deduct 30 points from total assessment score AND create human review flag</description>
</if_block>

**Additional Risk Patterns:**
- Evasive responses to direct questions
- Inconsistent career narrative
- Over-emphasis on financial motivation
- Resistance to traditional employment structures
</risk_detection_protocols>

<evaluation_quality_assurance>
**RESPONSE ANALYSIS STANDARDS:**
- Extract exact excerpts for score justification
- Provide detailed reasoning for each dimension score
- Maintain consistency across similar response patterns
- Flag ambiguous responses for human clarification

**ESCAPE HATCH:** If candidate responses are unclear, incomplete, or if interview conditions are compromised, state: "Interview quality insufficient for reliable assessment. Recommend follow-up interview due to: [specific issues]."
</evaluation_quality_assurance>

**CRITICAL BOUNDARY:** Provide systematic evaluation support for human decision-makers. All flagged candidates require mandatory human review before any hiring decisions."""

        # Prepare input text with candidate responses
        input_text = f"""Please analyze the following candidate interview responses:

**Candidate Interview Responses:**
{json.dumps(candidate_responses, indent=2, ensure_ascii=False)}

Please provide a comprehensive assessment analysis following the structured format specified in your instructions, scoring each dimension and detecting any risk patterns."""

        # Generate content
        response = model.generate_content([system_prompt, input_text])
        
        return response.text
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def get_sample_interview_responses():
    """Get sample interview responses for automated assessment"""
    return {
        "accountability": {
            "question": "What was the most difficult experience in your previous job, and what do you think was the cause? What actions did you personally take to improve the situation?",
            "answer": "In my previous role, we faced a critical system outage that affected customer services. I took responsibility by immediately coordinating with the team, implementing a rollback plan, and conducting a thorough post-mortem to prevent future occurrences."
        },
        "self_improvement": {
            "question": "Is there anything you are currently studying outside of work hours related to our business? Please be specific.",
            "answer": "I'm currently learning Japanese (JLPT N3 level) and studying Node.js microservices architecture through online courses to better align with Minma's tech stack."
        },
        "work_ethic_result_orientation": {
            "question": "What are your long-term career goals? Why do you think our company is the best place to achieve them?",
            "answer": "I aim to become a technical lead in e-commerce platforms. Minma's focus on marketplace innovation and Japan-Vietnam collaboration provides the perfect environment for both technical growth and cultural learning."
        },
        "company_knowledge_alignment": {
            "question": "Please describe our business in your own words.",
            "answer": "Minma operates Curashi no Market, connecting users with 400+ service categories, and Senkyaku for SME digitalization. The company bridges Japanese market needs with Vietnamese technical talent."
        },
        "weekend_activities": {
            "question": "How do you usually spend your weekends and holidays to refresh yourself?",
            "answer": "I enjoy reading technology blogs, practicing Japanese language, and hiking with friends. I also contribute to open-source projects related to web development."
        }
    }

if __name__ == "__main__":
    print("📋 MINMA INC. CANDIDATE ASSESSMENT - PHASE 2")
    print("=" * 55)
    print("🤖 Running automated assessment with sample responses...")
    
    # Use sample responses for automated assessment
    responses = get_sample_interview_responses()
    
    print("⏳ Analyzing candidate responses...")
    result = assess_candidate_phase2(responses)
    
    if result:
        print("\n🤖 PHASE 2 - RAW GEMINI OUTPUT:")
        print("=" * 60)
        print(result)
        print("=" * 60)
        
        # Save raw output to dedicated file
        raw_output_file = "phase2_raw_output.txt"
        with open(raw_output_file, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"\n💾 Phase 2 raw output saved to: {raw_output_file}")
        
        # Also save for workflow continuity (next phase input)
        workflow_file = "[PHASE_2][OUTPUT]_Technical_Assessment.json"
        with open(workflow_file, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"💾 Workflow file saved to: {workflow_file}")
        print("   (Note: This may contain raw text, not valid JSON)")
        
        # Also save the interview responses for potential next phase use
        responses_file = "[SAMPLE]_Interview_Responses.json"
        with open(responses_file, 'w', encoding='utf-8') as f:
            json.dump(responses, f, indent=2, ensure_ascii=False)
        print(f"💾 Interview responses saved to: {responses_file}")
        
        print("\n✅ Phase 2 assessment completed!")
    else:
        print("❌ Assessment analysis failed") 