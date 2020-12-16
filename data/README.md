# Put any data files in this folder

Ideally your data is a CSV file.

*Do not commit personally identifying or confidential data!*
If you do so, it is a pain to remove it later and it may have already been crawled by other sources. But [here is how you do so](https://help.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository).

Data Structure for Visualizations

We imported a subset of data into a SQL Server Database with online JSON item PostItem, after that we modified columns to create simplier queries and manually create our data. Basic SQL query for the bubble graph are similar to this - 

SELECT count(*) FROM PostItems
WHERE body LIKE 'covid'

This is repeated for the 15 keywords that we have in our keywords list. The keywords can come from interviews and previous research done by the research team. 15 keywords were chosen by us as a proof of concept.

Next to build the network JSON; 
We defined related works that are concerned with the keywords. 
From this we ran nested queries that look like this for all keywords; this was completed recursively

SELECT count(*) FROM
(SELECT * FROM PostItems
WHERE body LIKE 'covid')
WHERE body LIKE 'health safety'

For the line graph we ran a simple query for -

SELECT COUNT(*) 
from PostItems
WHERE body LIKE 'covid'
group by datePosted

The final template for the three files are listed below:

CSV for line graph
date ; word; count

CSV for keyword bubble graph
keywords; count

JSON for network
id is the keyword; group is either a keyword(root) or related word(subroot)
Nodes ->  id ; group (root | subroot) 

source is the base node, target is the connecting node and value is the frequency
Links -> source; target; value

While the dataset is large, We believe that a SQL Query is not an ideal setting for data scraping in our project. We would have preferred to implement a no-SQL Database, but this is not in the scope of DS4200, the course we're building this project for.

