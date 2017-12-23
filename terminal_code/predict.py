from sklearn.feature_extraction.text import CountVectorizer
from load_data import *
from sklearn.model_selection import StratifiedKFold
from sklearn import svm
from sklearn.metrics import classification_report
import numpy as np
import sys, os
from contextlib import contextmanager
import cPickle
import json
from section_identify import extract_section
import sys

if  len(sys.argv) != 3:
	print ("The command is: python predict.py <input file> <output file>")
	exit()

#load trained models for checkboxes
store_model = cPickle.load(open("model.p",'rb'))



def predict_field(name,x):
	global store_model
	clf,vectorizer = store_model[name]
	x_vec = vectorizer.transform([x])
	pred_x = clf.predict(x_vec)
	
	if pred_x[0] == 1:
		return True
	else:
		return False

def predict(report_file_path):
	#Init json var
	with open('template.json') as data_file:
		try:
			data = json.load(data_file)	
		except:
			print("Json load error",sys.exc_info(), data_file)
			exit()
	
	#Load txt report 
	sections = extract_section(report_file_path)		
	x = ' '.join(sections)	#using all sections for training
	
	data["form_data"]["sections"]["Review Overview"]["Role(s) of Review Provider"]["Consultancy (incl. 2 nd opinion)"] = predict_field("Review_Overview__Roles_of_Review_Provider_consultancy", x)
	data["form_data"]["sections"]["Review Overview"]["Role(s) of Review Provider"]["Rating"] = predict_field("Review_Overview__Roles_of_Review_Provider_rating", x)
	data["form_data"]["sections"]["Review Overview"]["Role(s) of Review Provider"]["Verification"] = predict_field("Review_Overview__Roles_of_Review_Provider_verification", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Clean transportation"] = predict_field("Detailed_Review__Use_of_Proceeds_clean_transportation", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Climate change adaptation"] = predict_field("Detailed_Review__Use_of_Proceeds_climate_change_adaptation", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Eco-efficient products, production technologies and processes"] = predict_field("Detailed_Review__Use_of_Proceeds_eco_efficient", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Energy efficiency"] = predict_field("Detailed_Review__Use_of_Proceeds_energy_efficiency", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Other (please specify)"] = predict_field("Detailed_Review__Use_of_Proceeds_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Pollution prevention and control"] = predict_field("Detailed_Review__Use_of_Proceeds_pollution_prevention", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Renewable energy"] = predict_field("Detailed_Review__Use_of_Proceeds_renewable_energy", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Sustainable management of living natural resources"] = predict_field("Detailed_Review__Use_of_Proceeds_sustainable_management", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Sustainable water management"] = predict_field("Detailed_Review__Use_of_Proceeds_sustainable_water_management", x)
	data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"]["Terrestrial and aquatic biodiversity conservation"] = predict_field("Detailed_Review__Use_of_Proceeds_terrestrial", x)					
	data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"]["Evaluation and Selection"]["Defined and transparent criteria for projects eligible for Green Bond proceeds"] = predict_field("Detailed_Review__Process_for_Project_Evaluation_and_Selection_defined", x)
	data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"]["Evaluation and Selection"]["Documented process to determine that projects fit within defined categories"] = predict_field("Detailed_Review__Process_for_Project_Evaluation_and_Selection_documented", x)
	data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"]["Evaluation and Selection"]["Summary criteria for project evaluation and selection publicly available"] = predict_field("Detailed_Review__Process_for_Project_Evaluation_and_Selection_summary", x)
	data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"]["Information on Responsibilities and Accountability"]["Evaluation / Selection criteria subject to external advice or verification"] = predict_field("Detailed_Review__Process_for_Project_Information_evaluation", x)
	data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"]["Information on Responsibilities and Accountability"]["In-house assessment"] = predict_field("Detailed_Review__Process_for_Project_Information_in_house", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"]["Allocation to a portfolio of disbursements"] = predict_field("Detailed_Review__Management_Additional_disclosure_allocation_to_a_portfolio_of_disbursements", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"]["Allocation to individual disbursements"] = predict_field("Detailed_Review__Management_Additional_disclosure_allocation_to_individual_disbursements", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"]["Allocations to both existing and future investments"] = predict_field("Detailed_Review__Management_Additional_disclosure_allocations_to_both_existing_and_future", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"]["Disclosure of portfolio balance of unallocated proceeds"] = predict_field("Detailed_Review__Management_Additional_disclosure_disclosure_of_portfolio_balance_of", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"]["Other (please specify)"] = predict_field("Detailed_Review__Management_Additional_disclosure_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Tracking of Proceeds"]["Disclosure of intended types of temporary investment instruments for unallocated proceeds"] = predict_field("Detailed_Review__Management_Tracking_of_Proceeds_disclosure", x)
	data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Tracking of Proceeds"]["Green Bond proceeds segregated or tracked by the issuer in a systematic manner"] = predict_field("Detailed_Review__Management_Tracking_of_Proceeds_green", x)				
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Frequency"]["Annual"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_annual", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Frequency"]["Other (please specify)"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Frequency"]["Semi-annual"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_semi_annual", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Information Reported"]["GB financed share of total investment"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_gb_financed", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Information Reported"]["Other (please specify)"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Linkage to individual bond(s)"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_linkage_to_individual", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["On a project portfolio basis"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_on_a_project_portfolio_basis", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Other (please specify)"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Project-by-project"] = predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other_project_by_project", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Frequency"]["Annual"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_Frequency_annual", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Frequency"]["Other (please specify)"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_Frequency_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Frequency"]["Semi-annual"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_Frequency_semi_annual", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Information Reported"]["Energy Savings"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_Information_Reported_energy_savings", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Information Reported"]["GHG Emissions / Savings"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_Information_Reported_ghg", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Information Reported"]["Other ESG indicators (please specify)"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_Information_Reported_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Linkage to individual bond(s)"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_linkage_to_individual", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["On a project portfolio basis"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_on_a_project_portfolio_basis", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Other (please specify)"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Project-by-project"] = predict_field("Detailed_Review__Reporting_Impact_Reporting_project_by_project", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"]["Information published in ad hoc documents"] = predict_field("Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_ad_hoc", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"]["Information published in financial report"] = predict_field("Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_financial_report", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"]["Information published in sustainability report"] = predict_field("Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_sustainability_report", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"]["Other (please specify)"] = predict_field("Detailed_Review__Reporting_Means_of_Disclosure_other", x)
	data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"]["Reporting reviewed (if yes, please specify which parts of the reporting are subject to external review)"] = predict_field("Detailed_Review__Reporting_Means_of_Disclosure_reporting_reviewed", x)
	return data
#Example
#predict("data/report/Bancoldex-Green-Bond-Second-Opinion_report.txt")

output = predict(sys.argv[1])
with open(sys.argv[2], 'w') as outfile:
    json.dump(output, outfile)