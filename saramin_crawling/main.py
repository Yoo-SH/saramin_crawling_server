from params_code import *
from dotenv import load_dotenv
import os
from crawler import crawl_saramin
from sqlalchemy import create_engine


# .env 파일에서 환경 변수 로드
load_dotenv()

# 사용 예시
if __name__ == "__main__":

    keyword = input("검색할 키워드를 입력하세요: ")
    pages = input("크롤링할 페이지 수를 입력하세요 (기본값: 1): ")
    pages = int(pages) if pages else 1

    df = crawl_saramin(keyword, pages)
    print(df)

    # postgresql 연결
    engine = create_engine(
        f"postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}",
        connect_args={"client_encoding": "utf8"},
    )

    try:
        # 연결 테스트
        with engine.connect() as connection:
            print("연결 성공")
            # PostgreSQL 데이터베이스에 연결하여 크롤링한 데이터를 "jobs" 테이블에 저장합니다.
            df.to_sql("jobs", engine, if_exists="append", index=False)
    except Exception as e:
        print("연결 실패:", e)
