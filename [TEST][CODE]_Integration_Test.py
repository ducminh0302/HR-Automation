#!/usr/bin/env python3
"""
HR Automation Integration Test - Full Process Flow
Tests the complete workflow from Phase 0 to Phase 4
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*60}")
    print(f"🔄 {title}")
    print('='*60)

def check_file_exists(filepath, phase_name):
    """Check if required file exists"""
    if os.path.exists(filepath):
        print(f"✅ {phase_name} output found: {filepath}")
        return True
    else:
        print(f"❌ {phase_name} output missing: {filepath}")
        return False

def run_phase(script_name, phase_name):
    """Run a phase script and check for success"""
    print(f"\n🚀 Running {phase_name}...")
    try:
        result = subprocess.run([sys.executable, script_name], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {phase_name} completed successfully")
            return True
        else:
            print(f"❌ {phase_name} failed:")
            print(f"STDOUT: {result.stdout}")
            print(f"STDERR: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error running {phase_name}: {e}")
        return False

def validate_json_output(filepath, expected_keys=None):
    """Validate JSON output structure"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if expected_keys:
            missing_keys = [key for key in expected_keys if key not in data]
            if missing_keys:
                print(f"⚠️  Missing keys in {filepath}: {missing_keys}")
                return False
        
        print(f"✅ Valid JSON structure in {filepath}")
        return True
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in {filepath}")
        return False
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
        return False

def test_full_integration():
    """Test the complete HR automation workflow"""
    print_section("HR AUTOMATION INTEGRATION TEST")
    print("Testing complete workflow from Phase 0 to Phase 4")
    
    # Required files check
    required_files = [
        ("analyze_cv_phase0.py", "Phase 0 - CV Extraction"),
        ("screening_phase1.py", "Phase 1 - Screening"),
        ("assessment_phase2.py", "Phase 2 - Assessment"),
        ("interview_phase3.py", "Phase 3 - Interview"),
        ("office_tour_phase4.py", "Phase 4 - Office Tour")
    ]
    
    print_section("CHECKING REQUIRED FILES")
    missing_files = []
    for script, description in required_files:
        if os.path.exists(script):
            print(f"✅ {description}: {script}")
        else:
            print(f"❌ {description}: {script} NOT FOUND")
            missing_files.append(script)
    
    if missing_files:
        print(f"\n❌ Cannot proceed. Missing files: {missing_files}")
        return False
    
    # Check if CV files exist
    print_section("CHECKING INPUT FILES")
    cv_files = ["IT Communicator 3.pdf", "CV-IT-JP.pdf", "rirekisyovi.pdf"]
    cv_found = False
    for cv_file in cv_files:
        if os.path.exists(cv_file):
            print(f"✅ CV file found: {cv_file}")
            cv_found = True
            break
    
    if not cv_found:
        print("❌ No CV files found. Please ensure at least one PDF CV is available.")
        return False
    
    # Expected output files for each phase
    phase_outputs = {
        "Phase 0": {
            "file": "[PHASE_0][OUTPUT]_CV_Analysis.json",
            "keys": ["candidate_info", "minma_culture_fit_indicators", "extraction_quality"]
        },
        "Phase 1": {
            "file": "[PHASE_1][OUTPUT]_Initial_Screening.json", 
            "keys": ["screening_score", "score_breakdown", "minma_alignment_assessment"]
        },
        "Phase 2": {
            "file": "[PHASE_2][OUTPUT]_Technical_Assessment.json",
            "keys": ["assessment_score", "score_breakdown", "interview_insights"]
        },
        "Phase 3": {
            "file": "[PHASE_3][OUTPUT]_Interview_Briefing.json",
            "keys": ["candidate_summary", "deep_dive_questions", "suggested_technical_questions"]
        },
        "Phase 4": {
            "file": "[PHASE_4][OUTPUT]_Culture_Fit_Report.json",
            "keys": ["culture_fit_summary_report"]
        }
    }
    
    print_section("VALIDATING WORKFLOW INTEGRATION")
    
    # Phase 0: CV Extraction (should already exist or can be run manually)
    phase0_output = phase_outputs["Phase 0"]["file"]
    if not check_file_exists(phase0_output, "Phase 0"):
        print("⚠️  Phase 0 output not found. You may need to run analyze_cv_phase0.py manually first.")
        print("   This phase requires PDF input and may need manual execution.")
    else:
        validate_json_output(phase0_output, phase_outputs["Phase 0"]["keys"])
    
    # Phase 1: Screening (requires Phase 0 output)
    print_section("TESTING PHASE 1 - SCREENING")
    phase1_output = phase_outputs["Phase 1"]["file"]
    
    if os.path.exists(phase0_output):
        print("✅ Phase 0 output available for Phase 1 input")
        if check_file_exists(phase1_output, "Phase 1"):
            validate_json_output(phase1_output, phase_outputs["Phase 1"]["keys"])
        else:
            print("⚠️  Run screening_phase1.py to generate Phase 1 results")
    else:
        print("❌ Cannot test Phase 1 without Phase 0 output")
    
    # Phase 2: Assessment (independent, but creates input for Phase 3)
    print_section("TESTING PHASE 2 - ASSESSMENT") 
    phase2_output = phase_outputs["Phase 2"]["file"]
    
    if check_file_exists(phase2_output, "Phase 2"):
        validate_json_output(phase2_output, phase_outputs["Phase 2"]["keys"])
    else:
        print("⚠️  Run assessment_phase2.py to generate Phase 2 results")
        print("   This phase requires interactive interview or prepared responses")
    
    # Phase 3: Interview (requires Phase 1 and Phase 2 outputs)
    print_section("TESTING PHASE 3 - INTERVIEW")
    phase3_output = phase_outputs["Phase 3"]["file"]
    
    phase1_exists = os.path.exists(phase1_output)
    phase2_exists = os.path.exists(phase2_output)
    
    if phase1_exists and phase2_exists:
        print("✅ Phase 1 and Phase 2 outputs available for Phase 3 input")
        if check_file_exists(phase3_output, "Phase 3"):
            validate_json_output(phase3_output, phase_outputs["Phase 3"]["keys"])
        else:
            print("⚠️  Run interview_phase3.py to generate briefing sheet")
    else:
        missing = []
        if not phase1_exists: missing.append("Phase 1")
        if not phase2_exists: missing.append("Phase 2")
        print(f"❌ Cannot test Phase 3 without {', '.join(missing)} output(s)")
    
    # Phase 4: Office Tour (independent)
    print_section("TESTING PHASE 4 - OFFICE TOUR")
    phase4_output = phase_outputs["Phase 4"]["file"]
    
    if check_file_exists(phase4_output, "Phase 4"):
        validate_json_output(phase4_output, phase_outputs["Phase 4"]["keys"])
    else:
        print("⚠️  Run office_tour_phase4.py to generate team checklist")
        print("   This phase requires team member feedback collection")
    
    # Integration Summary
    print_section("INTEGRATION SUMMARY")
    
    all_outputs_exist = all(os.path.exists(phase_outputs[phase]["file"]) 
                           for phase in phase_outputs)
    
    if all_outputs_exist:
        print("✅ All phase outputs detected - Full integration possible")
        print("\n📋 WORKFLOW SUMMARY:")
        print("Phase 0 → Phase 1: CV extraction JSON → Screening analysis")
        print("Phase 1 + Phase 2 → Phase 3: Scores → Interview briefing")
        print("Phase 4: Independent culture fit assessment")
        
        print("\n🎯 RECOMMENDED EXECUTION ORDER:")
        print("1. analyze_cv_phase0.py (manual - requires PDF)")
        print("2. screening_phase1.py (automatic)")
        print("3. assessment_phase2.py (interactive)")
        print("4. interview_phase3.py (briefing generation)")
        print("5. office_tour_phase4.py (team feedback)")
        
        return True
    else:
        missing_phases = [phase for phase in phase_outputs 
                         if not os.path.exists(phase_outputs[phase]["file"])]
        print(f"⚠️  Partial integration - Missing: {', '.join(missing_phases)}")
        
        print("\n📝 TO COMPLETE INTEGRATION:")
        for phase in missing_phases:
            phase_num = phase.split()[1]
            script_map = {
                "0": "analyze_cv_phase0.py",
                "1": "screening_phase1.py", 
                "2": "assessment_phase2.py",
                "3": "interview_phase3.py",
                "4": "office_tour_phase4.py"
            }
            print(f"   - Run {script_map[phase_num]} for {phase}")
        
        return False

def generate_sample_data():
    """Generate sample data files for testing"""
    print_section("GENERATING SAMPLE TEST DATA")
    
    # Sample interview responses for Phase 2
    sample_responses = {
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
    
    sample_file = "[SAMPLE]_Interview_Responses.json"
    with open(sample_file, 'w', encoding='utf-8') as f:
        json.dump(sample_responses, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Sample interview responses created: {sample_file}")
    
    # Sample team feedback for Phase 4
    sample_team_feedback = {
        "member_1": {
            "member_name": "Tanaka-san",
            "member_role": "Senior Developer",
            "observations": {
                "communication_effectiveness": "Clear and professional communication, adapted well to different conversation styles",
                "values_demonstration": "Showed customer-focused thinking when discussing past projects",
                "cultural_adaptation": "Demonstrated good understanding of Japanese business etiquette",
                "team_chemistry": "Built natural rapport, showed genuine interest in our technical challenges"
            },
            "overall_impression": "Positive - would fit well with our development team culture"
        },
        "member_2": {
            "member_name": "Nguyen Minh",
            "member_role": "QA Engineer", 
            "observations": {
                "communication_effectiveness": "Good technical explanations, asked thoughtful questions",
                "values_demonstration": "Emphasized quality and continuous learning",
                "cultural_adaptation": "Comfortable with multicultural environment",
                "team_chemistry": "Friendly approach, engaged well in technical discussions"
            },
            "overall_impression": "Very positive - strong technical mindset and team collaboration potential"
        }
    }
    
    sample_feedback_file = "[SAMPLE]_Team_Feedback.json"
    with open(sample_feedback_file, 'w', encoding='utf-8') as f:
        json.dump(sample_team_feedback, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Sample team feedback created: {sample_feedback_file}")
    
    return sample_file, sample_feedback_file

if __name__ == "__main__":
    print("🔧 MINMA INC. HR AUTOMATION - INTEGRATION TEST")
    print("=" * 60)
    
    print("\nChoose test mode:")
    print("1. Test full integration workflow")
    print("2. Generate sample data for testing")
    print("3. Both (generate sample data + test integration)")
    
    choice = input("\nEnter choice (1, 2, or 3): ").strip()
    
    if choice == "1":
        success = test_full_integration()
        if success:
            print("\n🎉 INTEGRATION TEST COMPLETED SUCCESSFULLY!")
        else:
            print("\n⚠️  INTEGRATION TEST COMPLETED WITH ISSUES")
    
    elif choice == "2":
        sample_file, feedback_file = generate_sample_data()
        print(f"\n✅ Sample data generated!")
        print(f"📝 Use {sample_file} for testing Phase 2")
        print(f"📝 Use {feedback_file} for testing Phase 4")
    
    elif choice == "3":
        print_section("GENERATING SAMPLE DATA")
        sample_file, feedback_file = generate_sample_data()
        
        print_section("TESTING INTEGRATION")
        success = test_full_integration()
        
        if success:
            print("\n🎉 COMPLETE INTEGRATION TEST SUCCESSFUL!")
        else:
            print("\n⚠️  INTEGRATION TEST COMPLETED - CHECK MISSING COMPONENTS")
        
        print(f"\n📝 Sample files available:")
        print(f"   - Interview responses: {sample_file}")
        print(f"   - Team feedback: {feedback_file}")
    
    else:
        print("❌ Invalid choice. Please run again and select 1, 2, or 3.")
    
    print("\n" + "="*60)
    print("🏁 Integration test completed.")
    print("="*60) 