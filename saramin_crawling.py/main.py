from bs4 import BeautifulSoup
from urllib.parse import urlencode
from params_code import *


if __name__ == "__main__":

    try:
        input_searchWord = input("검색어를 입력하세요: ")
        input_location = input("지역을 입력하세요: ")
        input_job = input("직종을 입력하세요: ")
        input_page = int(input("페이지를 입력하세요: "))
        if input_page < 1:
            raise ValueError("페이지는 1 이상이어야 합니다.")
        input_page_count = input("페이지 당 노출갯수를 입력하세요: ")
        if input_page_count < 1:
            raise ValueError("페이지 당 노출갯수는 1 이상이어야 합니다.")
        input_sort = input("정렬을 입력하세요: ")
        input_company = input("회사형태를 입력하세요: ")
    except ValueError as e:
        print(e)
        exit(0)

    base_url = "https://www.saramin.co.kr/zf_user/search/recruit"  ## (채용정보)

    params = {
        "searchword": input_searchWord,  ## 검색어 선택
        "loc_mcd": get_location_code(input_location),
        "cat_mcls": get_job_code(input_job),
        "recruitPage": input_page,  ## 페이지
        "recruitPageCount": input_page_count,  ## 페이지 당 노출갯수
        "recruitSort": get_sort_code(input_sort),
        "inner_com_type": get_company_code(input_company),
        "company_cd": "0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10",  ##회사 필터링, 파악불가 [모두 체크=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9%2C10 , 일반 & 파견 = 0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C9, 일반& 헤드 = 0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C10, 파견대행 & 헤드헌팅=9%2C10, 헤드헌팅 =10, 파견대행=9, 일반채용 정보=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7]
    }

    crawling_url = f"{base_url}?{urlencode(params)}"  ## unlenncode() => searchword=python&loc_mcd=101000&cat_mcls=14&recruitPage=1&recruitPageCount=40&recruitSort=relation
