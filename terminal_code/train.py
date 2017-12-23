from sklearn.feature_extraction.text import CountVectorizer
from load_data import *
from sklearn.model_selection import StratifiedKFold
from sklearn import svm
from sklearn.metrics import classification_report
import numpy as np
import sys, os
from contextlib import contextmanager
import cPickle

@contextmanager
def suppress_stdout():
    with open(os.devnull, "w") as devnull:
        old_stdout = sys.stdout
        sys.stdout = devnull
        try:  
            yield
        finally:
            sys.stdout = old_stdout

list_load_func = [	load_Review_Overview__Roles_of_Review_Provider_consultancy					
					,load_Review_Overview__Roles_of_Review_Provider_rating
					,load_Review_Overview__Roles_of_Review_Provider_verification
					,load_Detailed_Review__Use_of_Proceeds_clean_transportation
					,load_Detailed_Review__Use_of_Proceeds_climate_change_adaptation
					,load_Detailed_Review__Use_of_Proceeds_eco_efficient
					,load_Detailed_Review__Use_of_Proceeds_energy_efficiency
					,load_Detailed_Review__Use_of_Proceeds_other
					,load_Detailed_Review__Use_of_Proceeds_pollution_prevention
					,load_Detailed_Review__Use_of_Proceeds_renewable_energy
					,load_Detailed_Review__Use_of_Proceeds_sustainable_management
					,load_Detailed_Review__Use_of_Proceeds_sustainable_water_management
					,load_Detailed_Review__Use_of_Proceeds_terrestrial					
					,load_Detailed_Review__Process_for_Project_Evaluation_and_Selection_defined
					,load_Detailed_Review__Process_for_Project_Evaluation_and_Selection_documented
					,load_Detailed_Review__Process_for_Project_Evaluation_and_Selection_summary
					,load_Detailed_Review__Process_for_Project_Information_evaluation
					,load_Detailed_Review__Process_for_Project_Information_in_house
					,load_Detailed_Review__Management_Additional_disclosure_allocation_to_a_portfolio_of_disbursements
					,load_Detailed_Review__Management_Additional_disclosure_allocation_to_individual_disbursements
					,load_Detailed_Review__Management_Additional_disclosure_allocations_to_both_existing_and_future
					,load_Detailed_Review__Management_Additional_disclosure_disclosure_of_portfolio_balance_of
					,load_Detailed_Review__Management_Additional_disclosure_other
					,load_Detailed_Review__Management_Tracking_of_Proceeds_disclosure
					,load_Detailed_Review__Management_Tracking_of_Proceeds_green					
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_annual
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_other
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_semi_annual
					, load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_gb_financed
					, load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_other
					, load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_linkage_to_individual
					, load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_on_a_project_portfolio_basis
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other
					, load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other_project_by_project
					, load_Detailed_Review__Reporting_Impact_Reporting_Frequency_annual
					, load_Detailed_Review__Reporting_Impact_Reporting_Frequency_other
					, load_Detailed_Review__Reporting_Impact_Reporting_Frequency_semi_annual
					, load_Detailed_Review__Reporting_Impact_Reporting_Information_Reported_energy_savings
					, load_Detailed_Review__Reporting_Impact_Reporting_Information_Reported_ghg
					, load_Detailed_Review__Reporting_Impact_Reporting_Information_Reported_other
					, load_Detailed_Review__Reporting_Impact_Reporting_linkage_to_individual
					, load_Detailed_Review__Reporting_Impact_Reporting_on_a_project_portfolio_basis
					, load_Detailed_Review__Reporting_Impact_Reporting_other
					, load_Detailed_Review__Reporting_Impact_Reporting_project_by_project
					, load_Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_ad_hoc
					, load_Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_financial_report
					, load_Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_sustainability_report
					, load_Detailed_Review__Reporting_Means_of_Disclosure_other
					, load_Detailed_Review__Reporting_Means_of_Disclosure_reporting_reviewed
				]

store_model = {}				
def train(load_data_func):
	global store_model
	print(load_data_func.__name__)
	with suppress_stdout():
		#load data
		x_data, y_data = load_data_func() 
	#Convert to BOW feature
	vectorizer = CountVectorizer()
	x_data = vectorizer.fit_transform(x_data) 
	
	#Train
	clf = svm.SVC()
	clf.fit(x_data, y_data)
	
	return [clf,vectorizer]
	
	

for e in list_load_func:
	try:
		store_model[e.__name__.replace("load_","")] = train(e)
	except:
		print (e.__name__,sys.exc_info())
		
cPickle.dump(store_model, open("model.p", "wb"))	