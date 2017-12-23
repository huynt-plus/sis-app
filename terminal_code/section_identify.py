import re

def extract_section(input_path):
	preamble = ""
	preface = ""
	introduction = ""
	framework_overview = ""
	overview_of_issuer = ""
	use_of_proceed = ""
	project_evaluation = ""
	management_proceeds = ""
	reporting = ""
	opinion = ""
	appendices = ""

	line_number = 0
	preamble_flag = True
	preface_flag = False
	introduction_flag = False
	framework_overview_flag = False
	overview_of_issuer_flag = False
	use_of_proceed_flag = False
	project_evaluation_flag = False
	management_proceeds_flag = False
	reporting_flag = False
	opinion_flag = False
	appendices_flag = False

	preamble_count = 0
	with open(input_path) as f:
		for line in f:
			line_number += 1
			line = line.strip("\r\n ")			
			
			#extract <preamble>: Detect by the second "\x0c\xc2\xa9 Sustainalytics \d\d\d\d"
			if preamble_flag:
				if line != "":			
					preamble += line + "\n"
					if re.search("\x0c\xc2*", line):#re.search("\x0c\xc2\xa9 +Sustainalytics \d\d\d\d", line) or re.search("\x0c\xc2\xa9 +Sus tainalytics \d\d\d\d", line):
						preamble_count += 1				
						if preamble_count == 2:
							# print ("<preamble>")				
							# print preamble.strip("\n")
							# print ("</preamble>")
							preamble_flag = False
							
			#extract <preface>	
			elif preface_flag:
				if line != "":				
					if line[-12:] == "INTRODUCTION":
						# print ("<preface>")				
						# print preface.strip("\n")
						# print ("</preface>")
						
						introduction += line + "\n"
						introduction_flag = True
						preface_flag = False
					elif line[-18:] == "OVERVIEW OF ISSUER":
						# print ("<preface>")				
						# print preface.strip("\n")
						# print ("</preface>")
						
						overview_of_issuer += line + "\n"
						overview_of_issuer_flag = True
						preface_flag = False
					else:
						preface += line + "\n"
			#extract <introduction>			
			elif introduction_flag:
				if line != "":				
					if line[-18:] == "FRAMEWORK OVERVIEW":
						# print ("<introduction>")				
						# print introduction.strip("\n")
						# print ("</introduction>")
						
						framework_overview += line + "\n"
						framework_overview_flag = True					
						introduction_flag = False
					elif line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[-25:] == "Sustainalytics\xe2\x80\x99 Opinion":
						# print ("<introduction>")				
						# print introduction.strip("\n")
						# print ("</introduction>")
						
						opinion += line + "\n"
						opinion_flag = True					
						introduction_flag = False
					elif line[-18:] == "OVERVIEW OF ISSUER":
						# print ("<introduction>")				
						# print introduction.strip("\n")
						# print ("</introduction>")
						
						overview_of_issuer += line + "\n"
						overview_of_issuer_flag = True					
						introduction_flag = False
					else:
						introduction += line + "\n"
			#extract <overview-of-issuer>   (this available in some reports)
			elif overview_of_issuer_flag:
				if line != "":				
					if line[-18:] == "FRAMEWORK OVERVIEW":
						# print ("<overview-of-issuer>")				
						# print overview_of_issuer.strip("\n")
						# print ("</overview-of-issuer>")
						
						framework_overview += line + "\n"
						framework_overview_flag = True					
						overview_of_issuer_flag = False
					elif line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[-25:] == "Sustainalytics\xe2\x80\x99 Opinion":
						# print ("<overview-of-issuer>")				
						# print overview_of_issuer.strip("\n")
						# print ("</overview-of-issuer>")
						
						opinion += line + "\n"
						opinion_flag = True					
						overview_of_issuer_flag = False
					else:
						overview_of_issuer += line + "\n"					
			
			#extract <framework-overview>
			elif framework_overview_flag:
				if line != "":				
					if line[-15:] == "Use of Proceeds" and "\xef" not in line:
						# print ("<framework-overview>")				
						# print framework_overview.strip("\n")
						# print ("</framework-overview>")
						
						use_of_proceed += line + "\n"
						use_of_proceed_flag = True					
						framework_overview_flag = False		
					else:
						framework_overview += line + "\n"
			#extract <use-of-proceed>			
			elif use_of_proceed_flag:
				if line != "":				
					if line[-40:] == "Project Evaluation and Selection Process" or line[-44:] == "Process for Project Evaluation and Selection" or line[-25:] ==  "Project Selection Process":
						# print ("<use-of-proceed>")				
						# print use_of_proceed.strip("\n")
						# print ("</use-of-proceed>")
						
						project_evaluation += line + "\n"
						project_evaluation_flag = True					
						use_of_proceed_flag = False		
					else:
						use_of_proceed += line + "\n"
			elif project_evaluation_flag:
				if line != "":				
					if line[-22:] == "Management of Proceeds":
						# print ("<project-eval-selection>")				
						# print project_evaluation.strip("\n")
						# print ("</project-eval-selection>")
						
						management_proceeds += line + "\n"
						management_proceeds_flag = True	
						project_evaluation_flag = False
					else:
						project_evaluation += line + "\n"
			elif management_proceeds_flag:
				if line != "":				
					if line[-9:] == "Reporting":
						# print ("<management-proceeds>")				
						# print management_proceeds.strip("\n")
						# print ("</management-proceeds>")
						
						reporting += line + "\n"
						reporting_flag = True	
						management_proceeds_flag = False
					else:
						management_proceeds += line + "\n"
			elif reporting_flag:
				if line != "":				
					if line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[-25:] == "Sustainalytics\xe2\x80\x99 Opinion":
						# print ("<reporting>")				
						# print reporting.strip("\n")
						# print ("</reporting>")
						
						opinion += line + "\n"
						opinion_flag = True	
						reporting_flag = False
					else:
						reporting += line + "\n"
			elif opinion_flag:
				if line != "":				
					if line[-10:] == "APPENDICES":
						# print ("<opinion>")				
						# print opinion.strip("\n")
						# print ("</opinion>")
						
						appendices += line + "\n"
						appendices_flag = True	
						opinion_flag = False
					else:
						opinion += line + "\n"
			elif appendices_flag:
				if line != "":				
					if line[-14:] == "SUSTAINALYTICS" or line[-10:] == "Disclaimer" or line[-52:] == "Green Bond/Green Bond Programme External Review Form":
						# print ("<appendices>")				
						# print appendices.strip("\n")
						# print ("</appendices>")
						
						appendices_flag = False
					else:
						appendices += line + "\n"
			else:
				#Detect whether PREFACE section is
				if line[-7:] == "PREFACE":
					preface_flag = True
					preface += line + "\n"
				elif line[-12:] == "INTRODUCTION":
					introduction_flag = True
					introduction += line + "\n"

	return [preamble, preface, introduction, framework_overview, use_of_proceed, project_evaluation, management_proceeds, reporting, opinion, appendices]


def extract_section_fromString(raw_text):
	preamble = ""
	preface = ""
	introduction = ""
	framework_overview = ""
	overview_of_issuer = ""
	use_of_proceed = ""
	project_evaluation = ""
	management_proceeds = ""
	reporting = ""
	opinion = ""
	appendices = ""

	line_number = 0
	preamble_flag = True
	preface_flag = False
	introduction_flag = False
	framework_overview_flag = False
	overview_of_issuer_flag = False
	use_of_proceed_flag = False
	project_evaluation_flag = False
	management_proceeds_flag = False
	reporting_flag = False
	opinion_flag = False
	appendices_flag = False

	preamble_count = 0
	f = raw_text.split("\n")
	
	for line in f:
		line_number += 1
		line = line.strip("\r\n ")			
		
		#extract <preamble>: Detect by the second "\x0c\xc2\xa9 Sustainalytics \d\d\d\d"
		if preamble_flag:
			if line != "":			
				preamble += line + "\n"
				if re.search("\x0c\xc2*", line):#re.search("\x0c\xc2\xa9 +Sustainalytics \d\d\d\d", line) or re.search("\x0c\xc2\xa9 +Sus tainalytics \d\d\d\d", line):
					preamble_count += 1				
					if preamble_count == 2:
						# print ("<preamble>")				
						# print preamble.strip("\n")
						# print ("</preamble>")
						preamble_flag = False
						
		#extract <preface>	
		elif preface_flag:
			if line != "":				
				if line[-12:] == "INTRODUCTION":
					# print ("<preface>")				
					# print preface.strip("\n")
					# print ("</preface>")
					
					introduction += line + "\n"
					introduction_flag = True
					preface_flag = False
				elif line[-18:] == "OVERVIEW OF ISSUER":
					# print ("<preface>")				
					# print preface.strip("\n")
					# print ("</preface>")
					
					overview_of_issuer += line + "\n"
					overview_of_issuer_flag = True
					preface_flag = False
				else:
					preface += line + "\n"
		#extract <introduction>			
		elif introduction_flag:
			if line != "":				
				if line[-18:] == "FRAMEWORK OVERVIEW":
					# print ("<introduction>")				
					# print introduction.strip("\n")
					# print ("</introduction>")
					
					framework_overview += line + "\n"
					framework_overview_flag = True					
					introduction_flag = False
				elif line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[-25:] == "Sustainalytics\xe2\x80\x99 Opinion":
					# print ("<introduction>")				
					# print introduction.strip("\n")
					# print ("</introduction>")
					
					opinion += line + "\n"
					opinion_flag = True					
					introduction_flag = False
				elif line[-18:] == "OVERVIEW OF ISSUER":
					# print ("<introduction>")				
					# print introduction.strip("\n")
					# print ("</introduction>")
					
					overview_of_issuer += line + "\n"
					overview_of_issuer_flag = True					
					introduction_flag = False
				else:
					introduction += line + "\n"
		#extract <overview-of-issuer>   (this available in some reports)
		elif overview_of_issuer_flag:
			if line != "":				
				if line[-18:] == "FRAMEWORK OVERVIEW":
					# print ("<overview-of-issuer>")				
					# print overview_of_issuer.strip("\n")
					# print ("</overview-of-issuer>")
					
					framework_overview += line + "\n"
					framework_overview_flag = True					
					overview_of_issuer_flag = False
				elif line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[-25:] == "Sustainalytics\xe2\x80\x99 Opinion":

					# print ("<overview-of-issuer>")				
					# print overview_of_issuer.strip("\n")
					# print ("</overview-of-issuer>")
					
					opinion += line + "\n"
					opinion_flag = True					
					overview_of_issuer_flag = False
				else:
					overview_of_issuer += line + "\n"					
		
		#extract <framework-overview>
		elif framework_overview_flag:
			if line != "":				
				if line[-15:] == "Use of Proceeds" and "\xef" not in line:
					# print ("<framework-overview>")				
					# print framework_overview.strip("\n")
					# print ("</framework-overview>")
					
					use_of_proceed += line + "\n"
					use_of_proceed_flag = True					
					framework_overview_flag = False		
				else:
					framework_overview += line + "\n"
		#extract <use-of-proceed>			
		elif use_of_proceed_flag:
			if line != "":				
				if line[-40:] == "Project Evaluation and Selection Process" or line[-44:] == "Process for Project Evaluation and Selection" or line[-25:] ==  "Project Selection Process":
					# print ("<use-of-proceed>")				
					# print use_of_proceed.strip("\n")
					# print ("</use-of-proceed>")
					
					project_evaluation += line + "\n"
					project_evaluation_flag = True					
					use_of_proceed_flag = False		
				else:
					use_of_proceed += line + "\n"
		elif project_evaluation_flag:
			if line != "":				
				if line[-22:] == "Management of Proceeds":
					# print ("<project-eval-selection>")				
					# print project_evaluation.strip("\n")
					# print ("</project-eval-selection>")
					
					management_proceeds += line + "\n"
					management_proceeds_flag = True	
					project_evaluation_flag = False
				else:
					project_evaluation += line + "\n"
		elif management_proceeds_flag:
			if line != "":				
				if line[-9:] == "Reporting":
					# print ("<management-proceeds>")				
					# print management_proceeds.strip("\n")
					# print ("</management-proceeds>")
					
					reporting += line + "\n"
					reporting_flag = True	
					management_proceeds_flag = False
				else:
					management_proceeds += line + "\n"
		elif reporting_flag:
			if line != "":				
				if line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[-25:] == "Sustainalytics\xe2\x80\x99 Opinion":
					# print ("<reporting>")				
					# print reporting.strip("\n")
					# print ("</reporting>")
					
					opinion += line + "\n"
					opinion_flag = True	
					reporting_flag = False
				else:
					reporting += line + "\n"
		elif opinion_flag:
			if line != "":				
				if line[-10:] == "APPENDICES":
					# print ("<opinion>")				
					# print opinion.strip("\n")
					# print ("</opinion>")
					
					appendices += line + "\n"
					appendices_flag = True	
					opinion_flag = False
				else:
					opinion += line + "\n"
		elif appendices_flag:
			if line != "":				
				if line[-14:] == "SUSTAINALYTICS" or line[-10:] == "Disclaimer" or line[-52:] == "Green Bond/Green Bond Programme External Review Form":
					# print ("<appendices>")				
					# print appendices.strip("\n")
					# print ("</appendices>")
					
					appendices_flag = False
				else:
					appendices += line + "\n"
		else:
			#Detect whether PREFACE section is
			if line[-7:] == "PREFACE":
				preface_flag = True
				preface += line + "\n"
			elif line[-12:] == "INTRODUCTION":
				introduction_flag = True
				introduction += line + "\n"

	return [preamble, preface, introduction, framework_overview, use_of_proceed, project_evaluation, management_proceeds, reporting, opinion, appendices]


		
