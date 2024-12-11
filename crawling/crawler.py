import requests
from bs4 import BeautifulSoup
import pandas as pd
from sqlalchemy import create_engine
import time


def crawl_saramin(keyword, pages=1):
    """
    사람인 채용공고를 크롤링하는 함수

    Args:
        keyword (str): 검색할 키워드
        pages (int): 크롤링할 페이지 수

    Returns:
        DataFrame: 채용공고 정보가 담긴 데이터프레임
    """
    jobs = []
    headers = {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

    }

    for page in range(1, pages + 1):
        url = f"https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword={keyword}&recruitPage={page}"
        print(f"Fetching page {page}: {url}")

        try:
            # 네트워크 요청
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")

            # 채용공고 목록 가져오기
            job_listings = soup.select(".item_recruit")
            print(f"Found {len(job_listings)} job listings on page {page}")

            for job in job_listings:
                try:
                    # 채용 정보 파싱
                    company = job.select_one(".corp_name a")
                    company = company.text.strip() if company else "N/A"

                    title = job.select_one(".job_tit a")
                    title = title.text.strip() if title else "N/A"

                    link = job.select_one(".job_tit a")
                    link = "https://www.saramin.co.kr" + link["href"] if link else "N/A"

                    conditions = job.select(".job_condition span")
                    location = conditions[0].text.strip() if len(conditions) > 0 else "N/A"
                    experience = conditions[1].text.strip() if len(conditions) > 1 else "N/A"
                    education = conditions[2].text.strip() if len(conditions) > 2 else "N/A"
                    employment_type = conditions[3].text.strip() if len(conditions) > 3 else "N/A"

                    deadline = job.select_one(".job_date .date")
                    deadline = deadline.text.strip() if deadline else "N/A"

                    job_sector = job.select_one(".job_sector")
                    sector = job_sector.text.strip() if job_sector else "N/A"

                    salary_badge = job.select_one(".area_badge .badge")
                    salary = salary_badge.text.strip() if salary_badge else "N/A"

                    # 결과 추가
                    jobs.append(
                        {
                            "company": company,
                            "title": title,
                            "link": link,
                            "location": location,
                            "experience": experience,
                            "education": education,
                            "employment_type": employment_type,
                            "deadline": deadline,
                            "sector": sector,
                            "salary": salary,
                        }
                    )
                except Exception as e:
                    print(f"Error parsing job details: {e}")
                    continue

            print(f"Page {page} completed")
            time.sleep(1)  # 딜레이 추가

        except requests.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            break

    # DataFrame으로 반환
    return pd.DataFrame(jobs)


