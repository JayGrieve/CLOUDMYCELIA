# CLOUDMYCELIA

[CLOUDMYCELIA](https://cloudmycelia.com) is a web-app that uses computer vision to track the growth of mycelium on grain spawn. Images are taken by a Raspberry Pi and uploaded to AWS. A custom computer vision algorithm measures the colonization progress. Results and analysis are displayed for the grower to view on the website.

## Stack

![image](https://github.com/user-attachments/assets/970d19f2-7da4-4c17-bc4a-dd6db804eaab)


## Directory Structure

## Directory Structure

- [Backend](./backend)  
  Contains ExpressJS server that pulls data from AWS

- [Frontend](./frontend)  
  Contains React frontend for the web-app
- [Image Processing Lambda](./image_processing_lambda)  
  Contains computer vision code wrapped in an AWS Lambda
