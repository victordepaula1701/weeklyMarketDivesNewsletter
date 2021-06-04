# Weekly Market Dives Newsletter

## And here we go...

Last year I started my journey on the data world. I'm a journalist, but I started to have more contact with data, and a whole new incredible world of possibilities open for me. 

I started to breathe data, all day I was reading, watching videos, studying and trying to apply in my daily routine all this new knowledge to bring value to my work. 

I'm a really curious person and once I discover something that is so interesting and passionate I start going deeper and learn everything that I can. 

It's not just about tools, authors and best practices. It's about diving completely on this new and amazing subject, learn about everything that we need to become a data driven person. 

So, one thing that is a consensus on the tons of texts that I read about these professionals that work with data is that you need to have a good knowledge of the business. 

Knowing about the business is one of the most mentioned soft skills in the world of data analysis. I thought that this could be a good start for my journey and this project was born. 

## My personal newsletter 

I read a lot! Really a lot. The first thing that I do when I open my eyes is read and I usually read for at least half an hour before going to bed. 

I love to read newsletters and I receive a lot of them everyday. So when I started to think that I needed to know more about the market I'm in to improve my knowledge a newsletter was the first thing that came to my mind. 

I visited some websites, asked some colleges at work about where they go when they need to consume information and add it to my bookmark. 

But after a few weeks visiting more than 15 websites a day to read and all the newsletters started to be annoying. Some websites don't update every week and after a few days without anything new, you stop visiting them. 

I started to get unmotivated with that, it didn't work for me and I needed to find another route. So, as learning a programming language is another skill for a data person, and as a data person I'm putting in this bucket the data scientist, data analysts, data engineering everyone who works with data. I thought that would be a good opportunity to join the necessity of consuming information with the opportunity to learn building something cool. 

## The Idea is...

Simple! Make a newsletter scraping the data from websites with content about the market that I'm working now and create an email that once a week is sent to me so I can read with a good cup of coffee before work. 

I was inspired for two newsletters to compose my personal one, the "Interfaces" produced by Henrique and Samir (https://www.interfaces.news/), and the newsletter from Felipe Deschamps (https://filipedeschamps.com.br/newsletter)

To maintain all the things with zero costs I chose to use Google Spreadsheets as a back end besides Google Apps script to put everything together in a HTML template and send it to me. 

To summarize the project to better visualization we can considering this: 

* Web Scraping data (Python)
* Storage data (Google Sheets)
* Creating a HTML Template (HTML + Apps Script)
* Send Email (Javascript + Trigger with Apps Script). 

## This is adventure time! 
Actually I'm scraping about 16 different websites. But, to exemplify the logic of the work I chose the website from BELTA. 

The Brazilian Educational & Language Travel Association or BELTA is an association with the main brazilian institutions who work with study abroad programs. 

Founded in 1992, BELTA is recognized globally and all the associates represent more than 75% of the global educational market. 

```python
!pip install newspaper3k
!pip install gspread oauth2client

from bs4 import BeautifulSoup
import requests
import pandas as pd
import re
import datetime
from datetime import date, timedelta
import newspaper
from newspaper import Article
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from  gspread_dataframe  import  get_as_dataframe ,  set_with_dataframe

#Google Spreadsheet API connection
scope = ['https://spreadsheets.google.com/feeds']
creds = ServiceAccountCredentials.from_json_keyfile_name('\keys.json', scope)
client = gspread.authorize(creds)

#calculating and defining the time range
today = pd.to_datetime('today').floor('d')
dateRange = today - pd.Timedelta(7, unit='D')
dateRangeConverted = dateRange.strftime('%Y-%m-%d')
date = datetime.datetime.strptime(dateRangeConverted, "%Y-%m-%d").date()
strpTimeDate = date.strftime('%Y-%m-%d')

#Start of the web scraping code
url="http://www.belta.org.br/category/noticias/"

data = requests.get(url).content

soup = BeautifulSoup(data,'html.parser')

articleBelta = soup.find_all ('div', class_ = ['article-detail'])

articleDate = []
ul = soup.find_all ('ul', class_ = ['author-meta'])
for item in ul:
    dateStr = item.find('li').text.strip()
    dateToConvert = datetime.datetime.strptime(dateStr, '%d/%m/%Y')
    dateConverted = dateToConvert.strftime('%Y-%m-%d')
    articleDate.append(dateConverted)

articleUrls = []    
for getUrl in soup.find_all ('h1', class_ = ['article-title']):
  for a in getUrl.find_all ('a'):
    link = a.get('href')
    articleUrls.append(link)

dfBeltaNews = pd.DataFrame(articleDate, columns=['Date'])
dfBeltaNews.insert(loc=1, column='URL', value=articleUrls)

dates = pd.to_datetime(pd.Series(dfBeltaNews['Date']), format = '%Y-%m-%d')
dates.apply(lambda x: x.strftime('%Y-%m-%d'))

dateFilter = dfBeltaNews.loc[(dates >= strpTimeDate)]
urlsList = list(dateFilter["URL"])

articleTitle = []
articleContent = []

for url in urlsList:
  article = Article(url)
  article.download()
  article.parse()
  articleTitle.append(article.title)
  articleContent.append(article.text[:300]+"...")

articleAuthor = []
for i in urlsList:
  articleAuthor.append('BELTA Notícias')    

dfBeltaNews = dateFilter
dfBeltaNews.insert(loc=2, column='Title', value=articleTitle)
dfBeltaNews.insert(loc=3, column='Content', value=articleContent)
dfBeltaNews.insert(loc=4, column='Author', value=articleAuthor)
dfBeltaNews

#Storing the data that I collect on my spreadsheet
ss = client.open_by_key('SPREADSHEET ID')
ws = ss.worksheet("SHEET NAME")
set_with_dataframe(ws, dfBeltaNews)
```

```python
