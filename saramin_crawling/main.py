from params_code import *
from crawler import crawl_saramin


# 사용 예시
if __name__ == "__main__":

    keyword = input("검색할 키워드를 입력하세요: ")
    pages = input("크롤링할 페이지 수를 입력하세요 (기본값: 1): ")
    pages = int(pages) if pages else 1

    df = crawl_saramin(keyword, pages)
    print(df)
