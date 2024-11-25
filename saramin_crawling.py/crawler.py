import requests
from bs4 import BeautifulSoup
import time


## 예제 코드
def crawling():
    recruit_info_list = []
    for i in range(1, 11):
        url = f"https:,//www.saramin.co.kr/zf_user/jobs/list/job-category?cat_cd=404&panel_type=&search_optional_item=n&search_done=y&panel_count=y&quick_apply=n&recruitPage={i}&recruitSort=relation&recruitPageCount=40&inner_com_type=&company_cd=0&searchType=search&searchword=python"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        recruit_list = soup.select("#recruit_info_list > div.content > div")
        for recruit in recruit_list:
            title = recruit.select_one("div.area_job > h2 > a > span").text
            company = recruit.select_one("div.area_corp > a").text
            recruit_info_list.append({"title": title, "company": company})
    time.sleep(1)
    return recruit_info_list


# recruit_info_list > div.content > div:nth-child(2)
# recruit_info_list > div.content > div:nth-child(1) > div.area_job > h2 > a > span
# /html/body/div[4]/div/div[1]/section[1]/div[3]/div[1]/div[1]/div[2]/h2/a/span
# recruit_info_list > div.content > div:nth-child(1) > div.area_job > div.toolTipWrap.wrap_scrap > a > img
