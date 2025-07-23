#!/usr/bin/env python3
"""
HR Automation Master Script - Complete Workflow Orchestration
Executes the full recruitment pipeline from CV extraction to culture fit assessment
"""

import os
import json
import sys
from pathlib import Path
import time
import importlib.util

# Import all phase modules using importlib for files with special characters
def import_module_from_file(file_path, module_name):
    """Import a module from file path"""
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load module from {file_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Import phase modules
phase0_module = import_module_from_file("[PHASE_0][CODE]_CV_Analysis.py", "phase0")
phase1_module = import_module_from_file("[PHASE_1][CODE]_Initial_Screening.py", "phase1")
phase2_module = import_module_from_file("[PHASE_2][CODE]_Technical_Assessment.py", "phase2")
phase3_module = import_module_from_file("[PHASE_3][CODE]_Interview_Briefing.py", "phase3")
phase4_module = import_module_from_file("[PHASE_4][CODE]_Culture_Fit_Assessment.py", "phase4")

# Extract functions from modules
extract_cv_info_phase0 = phase0_module.extract_cv_info_phase0
screen_candidate_phase1 = phase1_module.screen_candidate_phase1
assess_candidate_phase2 = phase2_module.assess_candidate_phase2
generate_briefing_sheet_phase3 = phase3_module.generate_briefing_sheet_phase3
analyze_team_feedback_phase4 = phase4_module.analyze_team_feedback_phase4

class HRAutomationPipeline:
    """Complete HR automation pipeline orchestrator"""
    
    def __init__(self, cv_file_path="CV-IT-JP.pdf", job_description="Software Engineer at Minma Vietnam - Hanoi"):
        self.cv_file_path = cv_file_path
        self.job_description = job_description
        self.results = {}
        self.output_files = {}
        
    def print_phase_header(self, phase_name, phase_number):
        """Print formatted phase header"""
        print(f"\n{'='*70}")
        print(f"🚀 PHASE {phase_number}: {phase_name}")
        print('='*70)
        
    def save_result(self, result, filename, phase_name):
        """Save result to file and track output"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                if isinstance(result, str):
                    try:
                        # Clean response text (remove markdown if present)
                        cleaned_result = result.strip()
                        if cleaned_result.startswith("```json"):
                            cleaned_result = cleaned_result[7:]
                        if cleaned_result.endswith("```"):
                            cleaned_result = cleaned_result[:-3]
                        cleaned_result = cleaned_result.strip()
                        
                        # Try to parse as JSON first
                        result_json = json.loads(cleaned_result)
                        json.dump(result_json, f, indent=2, ensure_ascii=False)
                        self.results[phase_name] = result_json
                    except json.JSONDecodeError:
                        # If not JSON, save as text
                        f.write(result)
                        self.results[phase_name] = result
                else:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                    self.results[phase_name] = result
            
            self.output_files[phase_name] = filename
            print(f"✅ {phase_name} results saved to: {filename}")
            return True
        except Exception as e:
            print(f"❌ Error saving {phase_name} results: {e}")
            return False
    
    def phase_0_cv_extraction(self):
        """Phase 0: Extract information from CV PDF"""
        self.print_phase_header("CV INFORMATION EXTRACTION", 0)
        
        if not os.path.exists(self.cv_file_path):
            print(f"❌ CV file not found: {self.cv_file_path}")
            return False
        
        print(f"📄 Processing CV: {self.cv_file_path}")
        print("⏳ Extracting candidate information...")
        
        result = extract_cv_info_phase0(self.cv_file_path)
        if not result:
            print("❌ Phase 0 failed: CV extraction error")
            return False
        
        return self.save_result(result, "[PHASE_0][OUTPUT]_CV_Analysis.json", "phase_0")
    
    def phase_1_screening(self):
        """Phase 1: Screen candidate based on extracted CV data"""
        self.print_phase_header("CANDIDATE SCREENING ANALYSIS", 1)
        
        phase0_file = self.output_files.get("phase_0")
        if not phase0_file or not os.path.exists(phase0_file):
            print("❌ Phase 1 failed: Phase 0 output not available")
            return False
        
        print("📊 Analyzing candidate qualification...")
        print("⏳ Calculating screening scores...")
        
        result = screen_candidate_phase1(phase0_file, self.job_description)
        if not result:
            print("❌ Phase 1 failed: Screening analysis error")
            return False
        
        return self.save_result(result, "[PHASE_1][OUTPUT]_Initial_Screening.json", "phase_1")
    
    def phase_2_assessment(self):
        """Phase 2: Assess candidate through structured interview questions"""
        self.print_phase_header("CANDIDATE ASSESSMENT INTERVIEW", 2)
        
        # Use sample interview responses for automated flow
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
        
        print("🤖 Using sample interview responses for automated assessment...")
        print("⏳ Analyzing candidate responses...")
        
        result = assess_candidate_phase2(sample_responses)
        if not result:
            print("❌ Phase 2 failed: Assessment analysis error")
            return False
        
        # Also save the interview responses
        self.save_result(sample_responses, "[SAMPLE]_Interview_Responses.json", "phase_2_responses")
        
        return self.save_result(result, "[PHASE_2][OUTPUT]_Technical_Assessment.json", "phase_2")
    
    def phase_3_interview_preparation(self):
        """Phase 3: Generate interviewer briefing sheet"""
        self.print_phase_header("INTERVIEW PREPARATION & BRIEFING", 3)
        
        phase1_file = self.output_files.get("phase_1")
        phase2_file = self.output_files.get("phase_2")
        
        if not phase1_file or not os.path.exists(phase1_file):
            print("❌ Phase 3 failed: Phase 1 output not available")
            return False
            
        if not phase2_file or not os.path.exists(phase2_file):
            print("❌ Phase 3 failed: Phase 2 output not available")
            return False
        
        # Load previous results
        with open(phase1_file, 'r', encoding='utf-8') as f:
            screening_data = json.load(f)
        
        with open(phase2_file, 'r', encoding='utf-8') as f:
            assessment_data = json.load(f)
        
        print("📋 Generating interviewer briefing sheet...")
        print("⏳ Compiling candidate insights and recommendations...")
        
        result = generate_briefing_sheet_phase3(screening_data, assessment_data, self.job_description)
        if not result:
            print("❌ Phase 3 failed: Briefing generation error")
            return False
        
        return self.save_result(result, "[PHASE_3][OUTPUT]_Interview_Briefing.json", "phase_3")
    
    def phase_4_culture_assessment(self):
        """Phase 4: Assess culture fit through team feedback"""
        self.print_phase_header("CULTURE FIT & TEAM ASSESSMENT", 4)
        
        # Use sample team feedback for automated flow
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
            },
            "member_3": {
                "member_name": "Yamamoto-san",
                "member_role": "Product Manager",
                "observations": {
                    "communication_effectiveness": "Excellent communication, understood business requirements well",
                    "values_demonstration": "Strong customer focus, asked relevant questions about user experience",
                    "cultural_adaptation": "Respectful and professional, good cultural awareness",
                    "team_chemistry": "Enthusiastic about company mission, would contribute well to team dynamics"
                },
                "overall_impression": "Highly recommended - excellent culture fit and business understanding"
            }
        }
        
        print("👥 Using sample team feedback for automated assessment...")
        print("⏳ Analyzing culture fit and team compatibility...")
        
        result = analyze_team_feedback_phase4(sample_team_feedback)
        if not result:
            print("❌ Phase 4 failed: Culture assessment error")
            return False
        
        # Save team feedback as well
        self.save_result(sample_team_feedback, "[PHASE_4][OUTPUT]_Team_Feedback.json", "phase_4_feedback")
        
        return self.save_result(result, "[PHASE_4][OUTPUT]_Culture_Fit_Report.json", "phase_4")
    
    def generate_final_report(self):
        """Generate comprehensive final recruitment report"""
        self.print_phase_header("FINAL RECRUITMENT REPORT", "FINAL")
        
        print("📊 Compiling comprehensive recruitment analysis...")
        
        # Extract key scores
        final_report = {
            "candidate_summary": {
                "cv_file": self.cv_file_path,
                "job_description": self.job_description,
                "assessment_date": time.strftime("%Y-%m-%d %H:%M:%S")
            },
            "phase_scores": {},
            "overall_assessment": {},
            "recommendations": {}
        }
        
        # Extract scores from each phase
        if "phase_1" in self.results:
            screening_data = self.results["phase_1"]
            if isinstance(screening_data, dict) and "screening_score" in screening_data:
                final_report["phase_scores"]["screening_score"] = screening_data["screening_score"]
        
        if "phase_2" in self.results:
            assessment_data = self.results["phase_2"]
            if isinstance(assessment_data, dict) and "assessment_score" in assessment_data:
                final_report["phase_scores"]["assessment_score"] = assessment_data["assessment_score"]
        
        if "phase_3" in self.results:
            interview_data = self.results["phase_3"]
            final_report["phase_scores"]["interview_preparation"] = "Completed"
        
        if "phase_4" in self.results:
            culture_data = self.results["phase_4"]
            final_report["phase_scores"]["culture_fit"] = "Assessed"
        
        # Calculate overall recommendation
        scores = []
        if "screening_score" in final_report["phase_scores"]:
            scores.append(final_report["phase_scores"]["screening_score"])
        if "assessment_score" in final_report["phase_scores"]:
            scores.append(final_report["phase_scores"]["assessment_score"])
        
        if scores:
            avg_score = sum(scores) / len(scores)
            final_report["overall_assessment"]["average_score"] = round(avg_score, 2)
            
            if avg_score >= 85:
                recommendation = "HIGHLY RECOMMENDED"
            elif avg_score >= 75:
                recommendation = "RECOMMENDED"
            elif avg_score >= 65:
                recommendation = "CONDITIONAL RECOMMENDATION"
            else:
                recommendation = "NOT RECOMMENDED"
            
            final_report["overall_assessment"]["recommendation"] = recommendation
        
        # Add file references
        final_report["output_files"] = self.output_files
        
        # Save final report
        self.save_result(final_report, "[FINAL][OUTPUT]_Recruitment_Summary.json", "final_report")
        
        print("\n🎯 RECRUITMENT PIPELINE SUMMARY:")
        print("=" * 50)
        for phase, filename in self.output_files.items():
            print(f"✅ {phase.replace('_', ' ').title()}: {filename}")
        
        if "average_score" in final_report["overall_assessment"]:
            print(f"\n📊 Overall Score: {final_report['overall_assessment']['average_score']}/100")
            print(f"🎯 Recommendation: {final_report['overall_assessment']['recommendation']}")
        
        return True
    
    def generate_additional_reports(self):
        """Generate additional documentation and guide files"""
        self.print_phase_header("ADDITIONAL DOCUMENTATION", "DOCS")
        
        print("📋 Generating documentation files...")
        
        # Create the Output directory if it doesn't exist
        output_dir = "Output"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"📁 Created output directory: {output_dir}")
        
        # Copy all output files to Output directory
        self.copy_outputs_to_folder()
        
        print("✅ Additional reports generation completed!")
        return True
    
    def copy_outputs_to_folder(self):
        """Copy all generated output files to Output folder"""
        import shutil
        
        output_dir = "Output"
        
        for phase_name, filename in self.output_files.items():
            if os.path.exists(filename):
                dest_path = os.path.join(output_dir, filename)
                shutil.copy2(filename, dest_path)
                print(f"📄 Copied {filename} → {dest_path}")
    
    def run_complete_pipeline(self):
        """Execute the complete HR automation pipeline"""
        print("🏁 MINMA INC. HR AUTOMATION - COMPLETE PIPELINE")
        print("=" * 70)
        print(f"📄 CV File: {self.cv_file_path}")
        print(f"💼 Position: {self.job_description}")
        print("=" * 70)
        
        start_time = time.time()
        
        # Execute all phases in sequence
        phases = [
            ("CV Extraction", self.phase_0_cv_extraction),
            ("Screening Analysis", self.phase_1_screening),
            ("Assessment Interview", self.phase_2_assessment),
            ("Interview Preparation", self.phase_3_interview_preparation),
            ("Culture Fit Assessment", self.phase_4_culture_assessment)
        ]
        
        success_count = 0
        for phase_name, phase_func in phases:
            try:
                if phase_func():
                    success_count += 1
                    print(f"✅ {phase_name} completed successfully")
                else:
                    print(f"❌ {phase_name} failed")
                    print("⚠️  Continuing with remaining phases...")
            except Exception as e:
                print(f"❌ {phase_name} error: {e}")
                print("⚠️  Continuing with remaining phases...")
        
        # Generate final report regardless of individual phase failures
        self.generate_final_report()
        
        # Generate additional output files
        self.generate_additional_reports()
        
        end_time = time.time()
        duration = round(end_time - start_time, 2)
        
        print(f"\n🏁 PIPELINE EXECUTION COMPLETED")
        print("=" * 50)
        print(f"⏱️  Total Duration: {duration} seconds")
        print(f"✅ Successful Phases: {success_count}/{len(phases)}")
        print(f"📁 Results saved in current directory")
        
        if success_count == len(phases):
            print("\n🎉 ALL PHASES COMPLETED SUCCESSFULLY!")
            print("🎯 Complete candidate evaluation ready for HR review")
        else:
            print(f"\n⚠️  {len(phases) - success_count} phases had issues")
            print("📋 Review individual phase outputs for details")
        
        return success_count == len(phases)

def main():
    """Main execution function"""
    print("🚀 MINMA INC. HR AUTOMATION MASTER SCRIPT")
    print("=" * 60)
    
    # Check available CV files
    cv_files = ["IT Communicator 3.pdf", "CV-IT-JP.pdf", "rirekisyovi.pdf"]
    available_cvs = [cv for cv in cv_files if os.path.exists(cv)]
    
    if not available_cvs:
        print("❌ No CV files found!")
        print("Please ensure one of these files exists:")
        for cv in cv_files:
            print(f"   - {cv}")
        return False
    
    # Use the first available CV
    cv_file = available_cvs[0]
    print(f"📄 Using CV file: {cv_file}")
    
    # Job description (can be customized)
    job_desc = "Software Engineer at Minma Vietnam - Hanoi office, focusing on e-commerce platform development"
    
    # Initialize and run pipeline
    pipeline = HRAutomationPipeline(cv_file, job_desc)
    return pipeline.run_complete_pipeline()

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 