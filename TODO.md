# 할일 
0. 에러 응답 반응 공통으로 모아두고 호출하기
1. swagger api 성공 반응 -> 서비스에서 응답 메시지 수정(status) + statusCode 안 맞는 것도 수정 특히 201
2. swagger api 실패 반응
3. 회원 탈퇴시, bookmark도 연결되어 있어서 그 내용도 트랜젝션으로 제거해야함. bookmark 테이블에서 참조 중임.


## company entity와 연결 할 경우

import requests
from bs4 import BeautifulSoup
import psycopg2

# PostgreSQL 연결 설정
DB_HOST = "localhost"
DB_NAME = "your_database_name"
DB_USER = "your_username"
DB_PASSWORD = "your_password"

def crawl_jobs():
    # 예시: 직업 데이터를 크롤링하는 함수
    url = 'https://example.com/jobs'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 필요한 데이터 파싱 (예: 회사명, 제목, 링크 등)
    jobs_data = []
    for job_element in soup.find_all('div', class_='job'):
        company = job_element.find('span', class_='company').text.strip()
        title = job_element.find('h2').text.strip()
        jobs_data.append({'company': company, 'title': title})
    
    return jobs_data

def save_jobs_to_db(jobs):
    try:
        # PostgreSQL 연결
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()

        # Step 1: Company 테이블 생성 (존재하지 않는 경우)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS company (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        """)

        # Step 2: Jobs 테이블에 company_id 컬럼 추가 (존재하지 않는 경우)
        cursor.execute("""
            ALTER TABLE IF EXISTS jobs ADD COLUMN IF NOT EXISTS company_id INTEGER;
        """)

        # Step 3: 중복되지 않는 Company 이름들을 테이블에 삽입
        for job in jobs:
            cursor.execute("""
                INSERT INTO company (name)
                VALUES (%s)
                ON CONFLICT (name) DO NOTHING;
            """, (job['company'],))

        # Step 4: Jobs 테이블에 데이터 삽입 및 company_id 매핑
        for job in jobs:
            # Company ID 가져오기
            cursor.execute("""
                SELECT id FROM company WHERE name = %s;
            """, (job['company'],))
            company_id = cursor.fetchone()[0]

            # Jobs 테이블에 데이터 삽입
            cursor.execute("""
                INSERT INTO jobs (title, company_id)
                VALUES (%s, %s);
            """, (job['title'], company_id))

        # Step 5: 외래 키 제약 추가 (존재하지 않는 경우)
        cursor.execute("""
            ALTER TABLE jobs
            ADD CONSTRAINT IF NOT EXISTS fk_company
            FOREIGN KEY (company_id)
            REFERENCES company(id);
        """)

        # 변경 사항 커밋 및 연결 종료
        conn.commit()
        cursor.close()
        conn.close()
        print("Jobs data has been successfully migrated and saved.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Step 1: Job 데이터 크롤링
    jobs = crawl_jobs()

    # Step 2: 크롤링한 데이터를 데이터베이스에 저장 및 마이그레이션
    save_jobs_to_db(jobs)