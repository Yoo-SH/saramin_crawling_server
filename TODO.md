# 할일 
job entity로 왜 연결 user entity가 

- user와 applications 관계 (1:N 관계)

사용자는 여러 구인 공고에 지원할 수 있습니다. 즉, 한 사용자는 여러 applications 항목을 가질 수 있지만, 각 지원 항목은 한 명의 사용자와만 연결됩니다.
Foreign Key를 applications 테이블에 user_id로 추가합니다.

- jobs와 applications 관계 (1:N 관계)

각 구인 공고(jobs)는 여러 명의 사용자가 지원할 수 있습니다. 따라서 각 applications 항목은 특정 jobs 항목과 연결됩니다.
Foreign Key를 applications 테이블에 job_id로 추가합니다.

- user와 bookmarks 관계 (1:N 관계)

사용자는 여러 구인 공고를 북마크할 수 있습니다. 즉, 한 사용자는 여러 bookmarks 항목을 가질 수 있지만, 각 북마크는 한 명의 사용자와만 연결됩니다.
Foreign Key를 bookmarks 테이블에 user_id로 추가합니다.

- jobs와 bookmarks 관계 (1:N 관계)

각 구인 공고(jobs)는 여러 사용자에게 북마크될 수 있습니다. 따라서 각 bookmarks 항목은 특정 jobs 항목과 연결됩니다.
Foreign Key를 bookmarks 테이블에 job_id로 추가합니다.


# DB 구현 모델
## 채용공고 정보
## 회사 정보 
## 지원 내역
## 북마크/관심 공고 모델
## 연봉 정보
## 업종 정보
## 근무형태 정보

# 필수 수집 정보 
## 지역별
## 경력별
## 기술스택별
## 회사명
## 포지션
## 공고 상세 조회
## 공고 조회수(증가)
## 관련 공고 추천
## 날짜



# API
## 채용공고- 조회, 검색, 필터링, 정렬, 등록, 수정, 삭제
## 회원 관리 - 회원가입, 로그인, 조회,  회원탈퇴
## 지원하기- 지원하기, 관심등록, 지원취소, 지원 내역 조회
## MORE
## MORE
## MORE