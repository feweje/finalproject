# Visualizing Medical Care Access Disparities Using Google Maps - Design

## Introduction

This document is a description of how this tool to visualize medical care access disparities was constructed. It proceeds in terms
of the files found in the project folder, beginning with the database that the project was based on. Following this, application.py
is described, a Python file which contains an implementation of a Flask web server to run web site. After this, the webpage's visual
structure is detailed throug a discussion of index.html and styles.css. Finally, the JavaScript code used to manipulate the webpage's
html is described.

## finalproject.db

There are two sets of data tables found in finalproject.db: location tables, which contain information about the locations for objects
on the map, and data tables, which contain medical data for each county on the map.

There are two tables containing location data in the database: geostates and places. geostates is a table that lists information for
every state in the United States and Washington DC. Among other information, this table contains values for the latitude and longitude
for the center of each of these states (Retrieved from: https://inkplant.com/code/us-state-mysql-table). This table was referenced in
application.py to define the location for every marker on the map. The second table, places, was referenced in implementing the search.
This table contains information for zip code in the United States, including a city name, state name, county code, and other pieces
of information (Retrieved from: CS50 Staff, Mashup).

There are four tables that directly contain medical data in the database: hospitals, publichealthdepartments, urgentcares, and nursinghomes.
As their names suggest, these four tables contain data about all of the hospitals, public health departments, urgent cares, and nursing homes
in the United States (Retrieved from: https://hifld-dhs-gii.opendata.arcgis.com/datasets?group_id=53cae225778d428fb82d68ac43feb3ef).
The data in these tables were the basis of the medical care access index; not the details of every location in the table, but simply
the number of each type of institution found in each county in the United States. I chose these particular four types of places because
they all may provide some direct medical care.

The medical tables in finalproject.db were manipulated using SQL commands to generate the data for another set of tables. These tables
were Google Fusion Tables, which can be used to define geometric objects on a Google map and presented their properties. In this case,
I used a Google Fusion Table for every state that contain rows for every county in that state. Each row contained the number of hospitals,
public health departments, urgent cares, and nursing homes found in that county, along with the value for the medical care access index
for that county. Along with these things, each row also contained the contents of a Keyhole Markup Language (KML) file, which can be
used to display geographic data in tools like Google Maps. This data was used to define the boundaries of every county that appeared on the map.
I chose to use these fusion tables rather than constructing more tables in finalproject.db because using fusion tables because
this allowed me to generate county overlays for every state using a Google Maps Fusion Table Layer. This functionality would not have
been as straightforward had I used a table constructed in finalproject.db. statescodes, another table in finalproject.db, contains
a list of all of the states along with the code used to reference its corresponding fusion table.

## application.py

application.py contains multiple routes that return a variety of things. "/" (paired with the function index()) renders the map
on the webpage. lats(), longs(), boundaries(), and statecodes() return a json containing the latitudes, longitudes, county boundaries, and fusion
table code for every state. Finally, search() returns the results of a search on the webpage, limited to 10 unique results. This is done
by selecting the postal codes and city names that are similar to the search query. To allow for some flexibility, rather than having
the query have to match an postal code or city in the table exactly, I used the SQL command "LIKE" to ensure that the query only had to match
a phrase that begins some element of the table, not match it entirely.

## index.html

index.html begins with importing a variety of JavaScript and CSS libraries that were used to build the webpage in the head, including
a CSS script, styles.css, that details the visual structure of the webpage itself and of the legend that appears when a user clicks on a state on
the map. index.html defines the body of the webpage to contain a google map, and makes the container for that map fluid so that it
fills the entire page. The body also defined to contain a form to receive user input, aka the search bar.

## scripts.js

scripts.js begins by initializin the map that will be displayed on the webpage.
### Initializing map

### configure()

### addMarker() and Google's fusion tables


## Concluding remarks


A "design document" for your project in the form of a Markdown file called DESIGN.md that discusses, technically, how you
implemented your project and why you made the design decisions you did. Your design document should be at least several paragraphs
in length. Whereas your documentation is meant to be a user’s manual, consider your design document your opportunity to give the
staff a technical tour of your project underneath its hood.