from params_code import *
from dotenv import load_dotenv
import os
from crawler import crawl_saramin
from sqlalchemy import create_engine
import pandas as pd
import time

# .env 파일에서 환경 변수 로드
load_dotenv()

MAX_RETRIES = 2  # 최대 재시도 횟수
RETRY_DELAY = 5  # 재시도 간격 (초)


def main():
    """메인 실행 함수."""
    keyword = input("검색할 키워드를 입력하세요: ")
    pages = input("크롤링할 페이지 수를 입력하세요 (기본값: 1): ")
    pages = int(pages) if pages else 1

    print(f"키워드: {keyword}, 페이지 수: {pages}")

    try:
        df = crawl_saramin(keyword, pages)
        print(df)

        engine = get_database_engine()
        success = attempt_transaction_with_retries(engine, df)
        if not success:
            print("트랜잭션 수행에 실패하여 작업이 종료되었습니다.")
    except Exception as e:
        print("작업 실패: ", e)


def get_database_engine():
    """PostgreSQL 데이터베이스 엔진 생성."""
    return create_engine(
        f"postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}",
        connect_args={"client_encoding": "utf8"},
    )


def attempt_transaction_with_retries(engine, df):
    """트랜잭션 재시도 로직."""
    retries = 0
    with engine.connect() as connection:
        while retries < MAX_RETRIES:
            try:
                return save_to_database(connection, engine, df)
            except Exception as e:
                retries += 1
                print(f"{retries}번째 재시도 중... 에러: {e}")
                time.sleep(RETRY_DELAY)

        print("최대 재시도 횟수를 초과했습니다. 트랜잭션 실패.")
        return False


def save_to_database(connection, engine, df):
    """트랜잭션 내 데이터 저장 로직."""
    trans = connection.begin()
    try:
        # 중복되지 않는 company 데이터 추출
        unique_company_df = filter_unique_companies(df, connection)

        if not unique_company_df.empty:
            # company 데이터 저장
            unique_company_df.to_sql("company", engine, if_exists="append", index=False)
            print(f"{len(unique_company_df)}개의 새로운 company 데이터 저장 완료")

            # jobs 데이터 저장
            df.to_sql("jobs", engine, if_exists="append", index=False)
            print("jobs 데이터 저장 완료")

            trans.commit()
            return True
        else:
            print("중복된 데이터로 인해 저장할 항목이 없습니다.")
            trans.rollback()
            return False
    except Exception as e:
        print(f"트랜잭션 실패: {e}")
        trans.rollback()
        raise


def filter_unique_companies(df, connection):
    """데이터프레임에서 기존 company 데이터와 중복되지 않는 항목 필터링."""
    company_df = df[["company"]].rename(columns={"company": "name"})
    existing_names = pd.read_sql("SELECT name FROM company", connection)
    unique_company_df = company_df[~company_df["name"].isin(existing_names["name"])]
    return unique_company_df


if __name__ == "__main__":
    main()
