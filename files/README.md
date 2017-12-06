# Visualizing Medical Care Access Disparities Using Google Maps - Usage

## Introduction

This website allows users to view differences in medical care access between counties in each state of the United States. Each county
is assigned a Medical Care Access Index (MCAI) value that is based off of the number of hospitals, public health centers, urgent cares,
and nursing homes in that county. Based on the maximum MCAI value for a county with a state (not the maximum found throughout the country),
the counties are separated into four categories: very low access (< 10% of maximum state MCAI value), low access (between 10% and < 50%
of maximum state MCAI value), medium access (between 50% and < 90% of maximum state MCAI value), and high access (> 90% of maximum state
MCAI value). The counties are shaded on the map according to their category.

## Deployment

This project is built to be compiled and run in the CS50 IDE. The project folder contains 3 folders: files, for this README document,
DESIGN document, and final project video; static, which contains a loading gif (ajax-loader.gif), scripts.js, and styles.css,
and templates, which contains index.html. The main project folder also contains application.py and theproject's database
(named finalproject.db). After changing the current directory to the project folder in the IDE, you must get a Google API key
from developers.google.com/maps/web/. After logging in if prompted, you should click GET A KEY at the top-righthand side of the page,
copy the value below YOUR API KEY, then run the command "export API_KEY=(YOUR VALUE HERE)" in the IDE. Following this, you will
have the ability to run the program and see the website using Flask, a Python microframework used for running web applications. Run
the command "flask run", and click on the link that appears, then the website will open.

## Using the website

### The map

The map on the website is an implementation of a Google map, with some added and removed features. Upon opening the website, the magnification
of the map is set at its fixed minimum value, and the center of the map is set at the center of the continental United States. Users
have the ability to increase and decrease magnification (up to this minimum value) using the "+" and "-" at the bottom right corner
of the page. There is a clickable marker that is placed at the geographic center of the state and Washington DC. Unlike a standard
Google map, other than the markers, no other element of the map is clickable.

### Viewing a state

To view a state, click on its marker. Upon doing so, the map changes its magnification and center location so that the selected state
is the object of focus. A county map overlay will appear, with each county shaded according to its MCAI value as described previously.
The county map overlay is slightly transparent so that city names can be viewed underneath. A legend will also appear on the right
side of the page. To view a particular county's information, click on it in the overlay. A window will appear the displays that county's
name, the number of public health departments, hospitals, urgent cares, and nursing homes it has, and its MCAI value. If there is
no number displayed next to a particular field, that indicates that the value is 0. To view another county's data and close the window
for a previous county, a user can click on the other county.

IMPORTANT: In order to view another state, a user MUST right click on the marker for the state previously viewed. This action will
remove the overlay for this state and allow a new state to be viewed. This is because only one map overlay can be opened at a time.
If this action is not completed, the legend for the next state will appear, but the map will not.

### The search bar

At the top of the webpage is a search bar. This search bar can be used to find a particular city or location on the map. After
entering a query, a list of matching locations will appear. When a location is clicked, the map will recenter to this location.

NOTE: only one search word can be used (a city name or zipcode). Using multiple search words will cause no results to appear.
