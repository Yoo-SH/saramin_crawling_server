from params_code import *
from dotenv import load_dotenv
import os
from crawler import crawl_saramin
from sqlalchemy import create_engine
import pandas as pd

# .env 파일에서 환경 변수 로드
load_dotenv()
if __name__ == "__main__":
    keyword = input("검색할 키워드를 입력하세요: ")
    pages = input("크롤링할 페이지 수를 입력하세요 (기본값: 1): ")
    pages = int(pages) if pages else 1

    print(f"키워드: {keyword}, 페이지 수: {pages}")

    try:
        df = crawl_saramin(keyword, pages)
        print(df)

        # PostgreSQL 연결
        engine = create_engine(
            f"postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}",
            connect_args={"client_encoding": "utf8"},
        )

        with engine.connect() as connection:
            print("DB 연결 성공")

            # 전체 데이터 저장
            df.to_sql("jobs", engine, if_exists="append", index=False)
            print("jobs 데이터 저장 완료")

            # company 열만 추출 후 name 열로 변경
            company_df = df[["company"]].rename(columns={"company": "name"})

            # 중복 제거 로직 추가
            existing_names = pd.read_sql("SELECT name FROM company", connection)
            unique_company_df = company_df[
                ~company_df["name"].isin(existing_names["name"])
            ]

            if not unique_company_df.empty:
                unique_company_df.to_sql(
                    "company", engine, if_exists="append", index=False
                )
                print(f"{len(unique_company_df)}개의 새로운 company 데이터 저장 완료")
            else:
                print("중복된 데이터로 인해 저장할 항목이 없습니다.")
    except Exception as e:
        print("에러 발생:", e)
