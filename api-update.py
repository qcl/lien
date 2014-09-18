# -*- coding: utf-8 -*-
# qcl

from pyquery import PyQuery as pq
import simplejson as json
import urllib2

def updateLiensPolicy():

    # API path
    apiPath = "./api/official-policy"

    # User-Agent
    userAgent = "Mozilla/5.0"
    opener = lambda url, **kw: urllib2.urlopen(urllib2.Request(url,None,{"User-Agent":userAgent})).read()

    # URLs
    liensWebsiteBaseURL = "http://taipeihope.tw"
    liensOfficalPolicyBaseURL = liensWebsiteBaseURL + "/issue/issue-list/official-policy/topics/"
    liensAllPolicyPage = liensOfficalPolicyBaseURL + "8.html"

    # Get all policy's page
    topicPages = []
   
    nextPageLink = liensAllPolicyPage
    while True:
        if nextPageLink == None:
            break
        
        page = pq(url=nextPageLink, opener=opener)
        nextPageBtn = page(".pagination-next")
        
        if len(nextPageBtn) < 1:
            break

        nextPageLink = nextPageBtn.find("a")
        if len(nextPageLink) > 0:
            nextPageLink = liensWebsiteBaseURL + nextPageLink.attr("href")
        else:
            nextPageLink = None

        for row in page("#topics-wrap>.row>div.item"):
            topicPages.append( pq(row).find("a").attr("href") )


    # Extract each policy
    liensOfficalPolicy = []

    for topicURL in topicPages:
        policyURL = liensWebsiteBaseURL + topicURL
        page = pq(url=policyURL,opener=opener)

        policyTitle = page(".heading>h2>a").text()
        policyContent = page("div.text").html()
        policyPlainContent = page("div.text>p").text()

        print "Extract %s" % (policyTitle)

        liensOfficalPolicy.append({
            "title":policyTitle,
            "url":policyURL,
            "plain_content":policyPlainContent,
            "content":policyContent
            })

    # Write to file as json
    json.dump(liensOfficalPolicy,open(apiPath,"w")) 

if __name__ == '__main__':
    print "Connect to Lien's offical website and extract policy"
    updateLiensPolicy()
