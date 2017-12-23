# SIS APPLICATION

## SETUP ENVIRONMENT

**pip install -r requirements.txt**

## RUN ON TERMINAL

Using the **terminal_code** folder for running code on terminal:

1. Evaluate the performance of each checkbox predictor: **python evaluate.py** 
2. Train model: **python train.py**
3. Given report_file, predict the value of each checkbox: **python predict <input_report_file> <output_json_file>**

Ex: python predict data/report/Bancoldex-Green-Bond-Second-Opinion_report.txt result.json

## SETUP WEBSITE AND SERVER

Open terminal and run the following sh files:

**Note: the server must be run first and then running the website**

### SIS APIs
#### These steps are to run server
1. Download pre-trained model: https://drive.google.com/file/d/1s0M3KHAwfEJHTOUSTBLE2UXknEla-SxQ/view?usp=sharing
2. Copy pre-trained model into **sis_apis/config/** folder
2. From **sis_apis** folder, run sh file with the following command: **sh run_server.sh** 
### SIS WEB
#### This step is to run web
From **sis_web** folder, run sh file with the following command: **sh run_web.sh**


