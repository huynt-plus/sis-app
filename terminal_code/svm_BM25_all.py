from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from load_data import *
from sklearn.model_selection import StratifiedKFold
from sklearn import svm
from sklearn.metrics import classification_report
import numpy as np
import sys, os
from contextlib import contextmanager
from sklearn.metrics import f1_score
@contextmanager
def suppress_stdout():
    with open(os.devnull, "w") as devnull:
        old_stdout = sys.stdout
        sys.stdout = devnull
        try:  
            yield
        finally:
            sys.stdout = old_stdout

list_load_func = [	load_Review_Overview__Roles_of_Review_Provider_certification
					,load_Review_Overview__Roles_of_Review_Provider_consultancy
					,load_Review_Overview__Roles_of_Review_Provider_other
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
					,load_Detailed_Review__Use_of_Proceeds_unknown
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
					,load_Detailed_Review__Management_Tracking_of_Proceeds_other
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_annual
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_other
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_semi_annual
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_gb_financed
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_other
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_linkage_to_individual
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_on_a_project_portfolio_basis
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other
					,load_Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other_project_by_project
					,load_Detailed_Review__Reporting_Impact_Reporting_Frequency_annual
					,load_Detailed_Review__Reporting_Impact_Reporting_Frequency_other
					,load_Detailed_Review__Reporting_Impact_Reporting_Frequency_semi_annual
					,load_Detailed_Review__Reporting_Impact_Reporting_Information_Reported_energy_savings
					,load_Detailed_Review__Reporting_Impact_Reporting_Information_Reported_ghg
					,load_Detailed_Review__Reporting_Impact_Reporting_Information_Reported_other
					,load_Detailed_Review__Reporting_Impact_Reporting_linkage_to_individual
					,load_Detailed_Review__Reporting_Impact_Reporting_on_a_project_portfolio_basis
					,load_Detailed_Review__Reporting_Impact_Reporting_other
					,load_Detailed_Review__Reporting_Impact_Reporting_project_by_project
					,load_Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_ad_hoc
					,load_Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_financial_report
					,load_Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_sustainability_report
					,load_Detailed_Review__Reporting_Means_of_Disclosure_other
					,load_Detailed_Review__Reporting_Means_of_Disclosure_reporting_reviewed
				]

def train(load_data_func):
	print("Training for Checkbox name:",load_data_func.__name__.replace("load_",""))
	# print("Load data for training")
	with suppress_stdout():
		x_data_raw, y_data = load_data_func()
	vectorizer = CountVectorizer()
	# print("Convert to BOW features")
	x_data = vectorizer.fit_transform(x_data_raw)
	avgdl = np.average(np.sum(x_data.toarray(),axis=1))


	def my_kernel(X, Y):
		k1 = 2
		b = 0.75	
		tfidf = TfidfVectorizer()
		result = tfidf.fit_transform(x_data_raw)
		feature_range = len(tfidf.get_feature_names())
		
		bm25_matrix = np.zeros((X.shape[0], Y.shape[0]))
		X = X.toarray()
		Y = Y.toarray()
		for i, x in enumerate(X):
			for j, y in enumerate(Y):
				score_x_y = 0			
				for k in range(feature_range):				
					if y[k] > 0:
						score_x_y += tfidf.idf_[k]*(x[k]*(k1 + 1)/(x[k]+k1*(1-b+b*(np.sum(x)/avgdl))))
				bm25_matrix[i,j] = score_x_y
		return bm25_matrix
	
	
	skf = StratifiedKFold(n_splits=5)#Split data for cross-validation
	accs = 0
	f1s = 0
	flag = True
	
	#Train for each fold
	for train_index, test_index in skf.split(x_data, y_data):
		X_train, X_test = x_data[train_index], x_data[test_index]
		y_train, y_test = y_data[train_index], y_data[test_index]
		clf = svm.SVC(kernel=my_kernel)
		clf.fit(X_train, y_train)	
		y_pred = clf.predict(X_test)	
		acc = (len(y_pred) -  np.sum(np.abs(y_pred-y_test)))/(len(y_pred)*1.0)
		accs += acc
		if flag:
			flag = False
			print("Report for the first fold:")
			print(classification_report(y_test, y_pred))			
			
		
	print ("Avg acc for 5 folds:", accs/5)
	print ("=================================")
	print ("\n")

for e in list_load_func:
	try:
		train(e)
	except:		
		# print(e.__name__,sys.exc_info())
		print ("\n")