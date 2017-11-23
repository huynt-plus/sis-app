# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.views import APIView
from rest_framework.response import Response
import json
from django.conf import settings
from rest_framework.parsers import MultiPartParser, JSONParser
import sys, re
import cPickle
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from cStringIO import StringIO
import codecs, os

class GetView(APIView):
    def get(self, request):
        try:
            f = open(os.path.join(settings.MEDIA_ROOT, 'data/data.json'))
            data = json.load(f)
            f.close()
            os.remove(os.path.join(settings.MEDIA_ROOT, 'data/data.json'))
            return Response({'message': {'message': "Analyzing successfuly!", "level": "text-info", 'hasErrors': "false", 'complete': "true"}, 'sections': json.dumps(data['form_data']['sections'])})
        except:
            return Response({'message': {'message': "Analyzing unsuccessfuly!", "level": "text-error", 'hasErrors': "true", 'complete': "false"}, 'sections': ''})

class FileUploadView(APIView):
    parser_classes = (JSONParser, MultiPartParser)
    store_model = cPickle.load(open(os.path.join(settings.MEDIA_ROOT, 'model/' + "model.p"), 'rb'))
    print 'Load model done!'

    def predict_field(self, name, x):
        clf, vectorizer = self.store_model[name]
        x_vec = vectorizer.transform([x])
        pred_x = clf.predict(x_vec)

        if pred_x[0] == 1:
            return True
        else:
            return False

    def extract_section_fromString(self, raw_text):
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

            # extract <preamble>: Detect by the second "\x0c\xc2\xa9 Sustainalytics \d\d\d\d"
            if preamble_flag:
                if line != "":
                    preamble += line + "\n"
                    if re.search("\x0c\xc2*",
                                 line):  # re.search("\x0c\xc2\xa9 +Sustainalytics \d\d\d\d", line) or re.search("\x0c\xc2\xa9 +Sus tainalytics \d\d\d\d", line):
                        preamble_count += 1
                        if preamble_count == 2:
                            # print ("<preamble>")
                            # print preamble.strip("\n")
                            # print ("</preamble>")
                            preamble_flag = False

            # extract <preface>
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
            # extract <introduction>
            elif introduction_flag:
                if line != "":
                    if line[-18:] == "FRAMEWORK OVERVIEW":
                        # print ("<introduction>")
                        # print introduction.strip("\n")
                        # print ("</introduction>")

                        framework_overview += line + "\n"
                        framework_overview_flag = True
                        introduction_flag = False
                    elif line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[
                                                                               -25:] == "Sustainalytics\xe2\x80\x99 Opinion":
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
            # extract <overview-of-issuer>   (this available in some reports)
            elif overview_of_issuer_flag:
                if line != "":
                    if line[-18:] == "FRAMEWORK OVERVIEW":
                        # print ("<overview-of-issuer>")
                        # print overview_of_issuer.strip("\n")
                        # print ("</overview-of-issuer>")

                        framework_overview += line + "\n"
                        framework_overview_flag = True
                        overview_of_issuer_flag = False
                    elif line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[
                                                                               -25:] == "Sustainalytics\xe2\x80\x99 Opinion":

                        # print ("<overview-of-issuer>")
                        # print overview_of_issuer.strip("\n")
                        # print ("</overview-of-issuer>")

                        opinion += line + "\n"
                        opinion_flag = True
                        overview_of_issuer_flag = False
                    else:
                        overview_of_issuer += line + "\n"

            # extract <framework-overview>
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
            # extract <use-of-proceed>
            elif use_of_proceed_flag:
                if line != "":
                    if line[-40:] == "Project Evaluation and Selection Process" or line[
                                                                                   -44:] == "Process for Project Evaluation and Selection" or line[
                                                                                                                                              -25:] == "Project Selection Process":
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
                    if line[-25:] == "SUSTAINALYTICS\xe2\x80\x99 OPINION" or line[
                                                                             -25:] == "Sustainalytics\xe2\x80\x99 Opinion":
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
                    if line[-14:] == "SUSTAINALYTICS" or line[-10:] == "Disclaimer" or line[
                                                                                       -52:] == "Green Bond/Green Bond Programme External Review Form":
                        # print ("<appendices>")
                        # print appendices.strip("\n")
                        # print ("</appendices>")

                        appendices_flag = False
                    else:
                        appendices += line + "\n"
            else:
                # Detect whether PREFACE section is
                if line[-7:] == "PREFACE":
                    preface_flag = True
                    preface += line + "\n"
                elif line[-12:] == "INTRODUCTION":
                    introduction_flag = True
                    introduction += line + "\n"

        return [preamble, preface, introduction, framework_overview, use_of_proceed, project_evaluation,
                management_proceeds, reporting, opinion, appendices]

    def predict_func(self, text):
        # Init json var
        with open(os.path.join(settings.MEDIA_ROOT, 'config/' + 'template.json')) as data_file:
            try:
                data = json.load(data_file)
            except:
                print("Json load error", sys.exc_info(), data_file)
                exit()

        # Load report
        sections = self.extract_section_fromString(text)
        x = ' '.join(sections)

        data["form_data"]["sections"]["Review Overview"]["Role(s) of Review Provider"][
            "Consultancy (incl. 2 nd opinion)"] = self.predict_field("Review_Overview__Roles_of_Review_Provider_consultancy",
                                                                x)
        data["form_data"]["sections"]["Review Overview"]["Role(s) of Review Provider"]["Rating"] = self.predict_field(
            "Review_Overview__Roles_of_Review_Provider_rating", x)
        data["form_data"]["sections"]["Review Overview"]["Role(s) of Review Provider"]["Verification"] = self.predict_field(
            "Review_Overview__Roles_of_Review_Provider_verification", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Clean transportation"] = self.predict_field("Detailed_Review__Use_of_Proceeds_clean_transportation", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Climate change adaptation"] = self.predict_field("Detailed_Review__Use_of_Proceeds_climate_change_adaptation",
                                                         x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Eco-efficient products, production technologies and processes"] = self.predict_field(
            "Detailed_Review__Use_of_Proceeds_eco_efficient", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Energy efficiency"] = self.predict_field("Detailed_Review__Use_of_Proceeds_energy_efficiency", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Other (please specify)"] = self.predict_field("Detailed_Review__Use_of_Proceeds_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Pollution prevention and control"] = self.predict_field("Detailed_Review__Use_of_Proceeds_pollution_prevention",
                                                                x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Renewable energy"] = self.predict_field("Detailed_Review__Use_of_Proceeds_renewable_energy", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Sustainable management of living natural resources"] = self.predict_field(
            "Detailed_Review__Use_of_Proceeds_sustainable_management", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Sustainable water management"] = self.predict_field(
            "Detailed_Review__Use_of_Proceeds_sustainable_water_management", x)
        data["form_data"]["sections"]["Detailed Review"]["Use of Proceeds"]["Use of Proceeds Categories as per GBP"][
            "Terrestrial and aquatic biodiversity conservation"] = self.predict_field(
            "Detailed_Review__Use_of_Proceeds_terrestrial", x)
        data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"][
            "Evaluation and Selection"][
            "Defined and transparent criteria for projects eligible for Green Bond proceeds"] = self.predict_field(
            "Detailed_Review__Process_for_Project_Evaluation_and_Selection_defined", x)
        data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"][
            "Evaluation and Selection"][
            "Documented process to determine that projects fit within defined categories"] = self.predict_field(
            "Detailed_Review__Process_for_Project_Evaluation_and_Selection_documented", x)
        data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"][
            "Evaluation and Selection"][
            "Summary criteria for project evaluation and selection publicly available"] = self.predict_field(
            "Detailed_Review__Process_for_Project_Evaluation_and_Selection_summary", x)
        data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"][
            "Information on Responsibilities and Accountability"][
            "Evaluation / Selection criteria subject to external advice or verification"] = self.predict_field(
            "Detailed_Review__Process_for_Project_Information_evaluation", x)
        data["form_data"]["sections"]["Detailed Review"]["Process for Project Evaluation and Selection"][
            "Information on Responsibilities and Accountability"]["In-house assessment"] = self.predict_field(
            "Detailed_Review__Process_for_Project_Information_in_house", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"][
            "Allocation to a portfolio of disbursements"] = self.predict_field(
            "Detailed_Review__Management_Additional_disclosure_allocation_to_a_portfolio_of_disbursements", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"][
            "Allocation to individual disbursements"] = self.predict_field(
            "Detailed_Review__Management_Additional_disclosure_allocation_to_individual_disbursements", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"][
            "Allocations to both existing and future investments"] = self.predict_field(
            "Detailed_Review__Management_Additional_disclosure_allocations_to_both_existing_and_future", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"][
            "Disclosure of portfolio balance of unallocated proceeds"] = self.predict_field(
            "Detailed_Review__Management_Additional_disclosure_disclosure_of_portfolio_balance_of", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Additional disclosure"][
            "Other (please specify)"] = self.predict_field("Detailed_Review__Management_Additional_disclosure_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Tracking of Proceeds"][
            "Disclosure of intended types of temporary investment instruments for unallocated proceeds"] = self.predict_field(
            "Detailed_Review__Management_Tracking_of_Proceeds_disclosure", x)
        data["form_data"]["sections"]["Detailed Review"]["Management of Proceeds"]["Tracking of Proceeds"][
            "Green Bond proceeds segregated or tracked by the issuer in a systematic manner"] = self.predict_field(
            "Detailed_Review__Management_Tracking_of_Proceeds_green", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Frequency"][
            "Annual"] = self.predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_annual", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Frequency"][
            "Other (please specify)"] = self.predict_field(
            "Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"]["Frequency"][
            "Semi-annual"] = self.predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Frequency_semi_annual",
                                           x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"][
            "Information Reported"]["GB financed share of total investment"] = self.predict_field(
            "Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_gb_financed", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"][
            "Information Reported"]["Other (please specify)"] = self.predict_field(
            "Detailed_Review__Reporting_Use_of_Proceeds_Reporting_Information_Reported_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"][
            "Linkage to individual bond(s)"] = self.predict_field(
            "Detailed_Review__Reporting_Use_of_Proceeds_Reporting_linkage_to_individual", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"][
            "On a project portfolio basis"] = self.predict_field(
            "Detailed_Review__Reporting_Use_of_Proceeds_Reporting_on_a_project_portfolio_basis", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"][
            "Other (please specify)"] = self.predict_field("Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Use of Proceeds Reporting"][
            "Project-by-project"] = self.predict_field(
            "Detailed_Review__Reporting_Use_of_Proceeds_Reporting_other_project_by_project", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Frequency"][
            "Annual"] = self.predict_field("Detailed_Review__Reporting_Impact_Reporting_Frequency_annual", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Frequency"][
            "Other (please specify)"] = self.predict_field("Detailed_Review__Reporting_Impact_Reporting_Frequency_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Frequency"][
            "Semi-annual"] = self.predict_field("Detailed_Review__Reporting_Impact_Reporting_Frequency_semi_annual", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Information Reported"][
            "Energy Savings"] = self.predict_field(
            "Detailed_Review__Reporting_Impact_Reporting_Information_Reported_energy_savings", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Information Reported"][
            "GHG Emissions / Savings"] = self.predict_field(
            "Detailed_Review__Reporting_Impact_Reporting_Information_Reported_ghg", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"]["Information Reported"][
            "Other ESG indicators (please specify)"] = self.predict_field(
            "Detailed_Review__Reporting_Impact_Reporting_Information_Reported_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"][
            "Linkage to individual bond(s)"] = self.predict_field(
            "Detailed_Review__Reporting_Impact_Reporting_linkage_to_individual", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"][
            "On a project portfolio basis"] = self.predict_field(
            "Detailed_Review__Reporting_Impact_Reporting_on_a_project_portfolio_basis", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"][
            "Other (please specify)"] = self.predict_field("Detailed_Review__Reporting_Impact_Reporting_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Impact Reporting"][
            "Project-by-project"] = self.predict_field("Detailed_Review__Reporting_Impact_Reporting_project_by_project", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"][
            "Information published in ad hoc documents"] = self.predict_field(
            "Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_ad_hoc", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"][
            "Information published in financial report"] = self.predict_field(
            "Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_financial_report", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"][
            "Information published in sustainability report"] = self.predict_field(
            "Detailed_Review__Reporting_Means_of_Disclosure_information_published_in_sustainability_report", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"][
            "Other (please specify)"] = self.predict_field("Detailed_Review__Reporting_Means_of_Disclosure_other", x)
        data["form_data"]["sections"]["Detailed Review"]["Reporting"]["Means of Disclosure"][
            "Reporting reviewed (if yes, please specify which parts of the reporting are subject to external review)"] = self.predict_field(
            "Detailed_Review__Reporting_Means_of_Disclosure_reporting_reviewed", x)
        return data

    def read_pdf_file(self, pdf_file):
        rsrcmgr = PDFResourceManager()
        retstr = StringIO()
        # codec = 'utf-8'
        codec = 'ascii'
        laparams = LAParams()
        device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
        fp = file(pdf_file, 'rb')
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        password = ""
        maxpages = 0
        caching = True
        pagenos = set()

        for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password, caching=caching,
                                      check_extractable=True):
            interpreter.process_page(page)

        text = retstr.getvalue()
        fp.close()
        device.close()
        retstr.close()
        return text

    def post(self, request):
        try:
            up_file = request.FILES['file']
            destination = open(os.path.join(settings.MEDIA_ROOT, 'data/' + up_file.name), 'wb+')
            for chunk in up_file.chunks():
                destination.write(chunk)
                destination.close()
            text = self.read_pdf_file(os.path.join(settings.MEDIA_ROOT, 'data/' + up_file.name))
            os.remove(os.path.join(settings.MEDIA_ROOT, 'data/' + up_file.name))
            with codecs.open(os.path.join(settings.MEDIA_ROOT, 'data/' + 'preprocess-report.txt'), "w", encoding="utf-8") as f:
                f.write(text)
            f.close()
            f = open(os.path.join(settings.MEDIA_ROOT, 'data/preprocess-report.txt'))
            text = f.read()
            os.remove(os.path.join(settings.MEDIA_ROOT, 'data/preprocess-report.txt'))
            data = self.predict_func(text)
            with codecs.open(os.path.join(settings.MEDIA_ROOT, 'data/' + 'data.json'), "w", encoding="utf-8") as f:
                f.write(json.dumps(data))
            f.close()
            return Response({'message': "Uploading file successfuly!", "level": "text-info", 'hasErrors': "false", 'complete': "true"})
        except:
            return Response({'message': "Uploading file unsuccessfuly!", "level": "text-error", 'hasErrors': "true", 'complete': "false"})
