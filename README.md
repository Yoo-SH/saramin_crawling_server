# [사람인 크롤링 서버](http://113.198.66.75:17182/api-docs)
![image](https://github.com/user-attachments/assets/6616bf3f-d987-4ad6-98ba-00a29729b4cc)

## `**Project 기본정보**`
* **[영상](https://www.youtube.com/watch?v=crGbyFKd5Dc)**
    - 구인구직 정보를 제공하는 백엔드 서버
    - 사람인 웹 사이트의 데이터를 크롤링하여 데이터 베이스에 저장하고 이를 기반으로 RESTful API를 제공
    - JWT를 활용한 인증 시스템을 구현
        - 로그인 성공시, JWT토큰을 쿠키에 발급하고 이를 통해 권한을 부여 받음.
        - access token과 refresh token을 발급하여 access token이 만료되면 refresh token을 통해 재발급(SSL 인증서 미적용)
    - Swagger를 활용한 API 문서화 
    - JCloude를 사용하여 백엔드 서버를 배포
    
           
## `기술 스택 명시`
```
DB
    - postgresql 16.4
ORM
    - typeorm 0.3.20
Server
    - nest 10.4.8
Crawling
    - python 3.12.4
```

## `설치 및 실행 가이드`

### Crawling (Python)
```
1. python 설치
2. pip install -r requirements.txt (crawling/, requirements.txt 경로)
3. python main.py (크롤링할 키워드와, 페이지수를 입력하면 해당 데이터를 로직에 따라 DB에 분류되어 저장)
```

### Server Side (NestJS)
```
1. npm install (/server/nest-server, package.json 경로)
2. npm build
3. (sudo) npm run start:prod  //우분투에서는 sudo 권한이 필요합니다.
4. pm2 start ecosystem.config.js (배포를 위한 pm2 설정)
```

### 유의사항
1. 크롤링한 데이터는 jobs, company 테이블에 저장됩니다.
2. 배포환경 application, bookmarks, users, auth 테이블의 데이터는 크롤링하지 않습니다.(API 요청으로 직접 데이터를 추가해야합니다.)
3. cookies 설정을 통해 JWT 토큰을 저장하고, 이를 통해 인증을 받습니다.

## `JCloude && 포트 정보`
* **JCloude**
    - JCloude를 사용하여 백엔드 서버를 배포하였습니다.
    - JCloude는 전북대학교 학생들에게 제공되는 클라우드 서비스입니다.
    - RAM: 8GB, VCPUs: 8 VCPU, 디스크:60GB
    - OS: Ubuntu 24.04 image
    - SSH, VNC, XRDP 등으로 CLI, GUI 접속
    - 네트워크
        - 공인 IP: 113.198.66.75
        - 인스턴스 IP: 10.0.0.182    
    - JCloud 에서 설정되어 있는 포트 포워딩
        - 80 (HTTP): 18xxx
        - 443 (HTTPS): 17xxx 
        - 7777 (SSH): 19xxx
        - 3000 (범용): 13xxx
        - 8080 (범용): 10xxx
    - 인스턴스 접근 예시(SSH)
        - SSH: ssh -p 19xxx ubuntu@113.198.66.75 

![image](https://github.com/user-attachments/assets/d74cdfe3-ab41-455a-9d89-be10112c33da)


**Instance Internal Firewall Settings Status**
- 80: vue 
- 443: NestJS server // SSL 인증서 미적용
- 3000: PostgreSQL server



| To            | Action | From              |
|---------------|--------|-------------------|
| 80/tcp        | ALLOW  | Anywhere          |
| 443/tcp       | ALLOW  | Anywhere          |
| Anywhere      | ALLOW  | 210.117.183.21    |
| Anywhere      | ALLOW  | 203.254.137.1     |
| 7777          | ALLOW  | Anywhere          |
| 5432/tcp      | ALLOW  | Anywhere          |
| 8080          | ALLOW  | Anywhere          |
| 3000          | ALLOW  | Anywhere          |
| 80/tcp (v6)   | ALLOW  | Anywhere (v6)     |
| 443/tcp (v6)  | ALLOW  | Anywhere (v6)     |
| 7777 (v6)     | ALLOW  | Anywhere (v6)     |
| 5432/tcp (v6) | ALLOW  | Anywhere (v6)     |
| 8080 (v6)     | ALLOW  | Anywhere (v6)     |
| 3000 (v6)     | ALLOW  | Anywhere (v6)     |


## `ERD`
- **ERD 설계**
    - 사용자 정보, 채용 정보, 회사 정보, 지원 정보, 북마크 정보 인증 정보를 저장하는 데이터베이스 설계
    - 인증 정보와 사용자 정보는 1:1 관계, 회사 정봐 채용 정보는 1:N 관계
    - 사용자 정보와 북마크 정보는 1:N 관계, 채용 정보와 북마크 정보는 1:N 관계 
    - 사용자 정보와 지원 정보는 1:N 관계, 채용 정보와 지원 정보는 1:N 관계
    

![image](https://github.com/user-attachments/assets/d9fa6df6-a535-45b1-8992-5dbc91349713)



## `API`
### API Response
```
 **성공 응답**
    - status: "success"
    - message: ""
    - statusCode: xxx
    - data: { ... }
    
 **실패 응답**
    - status: "error"
    - message: ""
    - statusCode: xxx
```

### 회원 관리 API (/auth)
* 회원 가입 (POST /auth/register)
    - 이메일 형식 검증
    - 비밀번호 암호화 (Base64)
    - 중복 회원 검사
    -  사용자 정보 저장
* 로그인 (POST /auth/login)
    - 사용자 인증
    - JWT 토큰 발급
    - 로그인 이력 저장
    - 실패 시 에러 처리
* 토큰 갱신 (POST /auth/refresh)
    - Refresh 토큰 검증
    - 새로운 Access 토큰 발급
    - 토큰 만료 처리
* 회원 정보 수정 (PUT /auth/profile)
    - 인증 미들웨어 적용
    - 비밀번호 변경
    - 프로필 정보 수정

### 채용 공고 API (/jobs)
* 공고 목록 조회 (GET /jobs)
    - 페이지네이션 처리 (필수)
    - 페이지 크기: 20
    - 정렬 기준 제공
    - 필터링 기능 
    - 지역별
    - 경력별
    - 급여별
    - 기술스택별
    - 검색 기능 
    - 키워드 검색
    - 회사명 검색
    - 포지션 검색
* 공고 상세 조회 (GET /jobs/:id)
    - 상세 정보 제공
    - 조회수 증가
    - 관련 공고 추천


### 지원 관리 API (/applications)
* 지원하기 (POST /applications)
    - 인증 확인
    - 중복 지원 체크
    - 지원 정보 저장
    - 이력서 첨부 
* 지원 내역 조회 (GET /applications)
    - 사용자별 지원 목록
    - 상태별 필터링
    - 날짜별 정렬
* 지원 취소 (DELETE /applications/:id)
    - 인증 확인
    - 취소 가능 여부 확인
    - 상태 업데이트

### 북마크 API (/bookmarks)
* 북마크 추가/제거 (POST /bookmarks)
    - 인증 확인
    - 북마크 토글 처리
    - 사용자별 저장
* 북마크 목록 조회 (GET /bookmarks)
    - 사용자별 북마크
    - 페이지네이션
    - 최신순 정렬

### 회사 정보 API (/company)
* 회사 정보 등록 (POST /company)
    - 회사 정보 등록


### 사용자 정보 API (/users)
* 사용자 정보 조회 (GET /users)
    - 사용자 정보 조회
    - 사용자 검색
    - 사용자 목록 조회



## `NEST lifeCycle (참고)`

![image](https://github.com/user-attachments/assets/80ec28de-dfb5-4e66-8bb0-1e15b759d45d)

1. Request
2. middleware ( 미들웨어 )
3. guards ( 가드 )
주로 permission ( 인증 ) 처리를 할 때 사용
pre-interceptors ( 인터셉터 )
주로 post-interceptor를 위한 변수 선언, 함수 실행 ( optional )
4. Pipes ( 파이프 )
변환( 요청 바디를 원하는 형식으로 변환 ), 유효성 검사 with Dto
5. Controller ( 컨트롤러 )
라우터 역할을 수행
6. Service ( 서비스 )
해당 요청에 대한 핵심 로직이 수행
7. post-interceptor ( 인터셉터 )
주로 pre-interceptor 로직을 가지고 응답한 데이터를 가공하거나 전체 로직의 속도 측정. 최종적으로 성공적인 응답 데이터를 보냄
8. exception filters ( 필터 )
예외 처리를 담당. 에러 메세지를 원하는 형태로 가공해서 응답
9. response 

## `Project (폴더) 구조 설명`

### Crawling (Python)
```
📂crawling
├──📄.env (환경변수 관리)
├──📄crawler.py (크롤링 파일)
├──📄main.py (크롤링 -> DB)
├──📄params_code.py (선별적 크롤링 데이터)
├──📄requirements.txt (필요한 패키지)
```

### Server Side (NestJS)
```
📂nest-server
├──📂logs (특수한 로그 기록)
│   └── combined.log
├──📂src 
│   ├──📄main.ts
│   ├──📂common(미들웨어, 가드, 인터셉터, 예외필터, 데코레이터 등)
│   │   ├──📂decorator
│   │   ├──📂dto(반복적으로 사용되는 dto) 
│   │   │   ├──📄error-response.dto.ts(에러 dto)
│   │   │   └──📂response-object(객체 dto)
│   │   │       ├──📄application.dto.ts
│   │   │       ├──📄company.dto.ts
│   │   │       ├──📄job.dto.ts
│   │   │       └──📄user.dto.ts
│   │   ├──📂exception-filter(예외필터, 글로벌 에러핸들러)
│   │   │   ├──📄custom-token-unAuthorized.exception.ts
│   │   │   └──📄http-exception.filter.ts
│   │   ├──📂guard (인증 유효성(auth)을 위한 가드)
│   │   │   ├──📄jwt.auth.guard.ts(인증 전략)
│   │   │   └──📂strategy
│   │   │       └──📄jwtStrategy.ts(인증 범위)
│   │   ├──📂interceptor
│   │   │   └──📄performance-logging.interceptor.ts (로깅을 위한인터셉터)
│   │   └──📂middleware
│   ├──📂config
│   │   ├──📄app.controller.spec.ts
│   │   ├──📄app.controller.ts
│   │   ├──📄app.module.ts
│   │   └──📄app.service.ts
│   └── 📂module(모듈단위)
│       ├──📂applications(지원 모듈)
│       │   ├──📂dto
│       │   │   ├──📂request
│       │   │   │   └──📄create-applications.dto.ts
│       │   │   └──📂response
│       │   │       ├──📄response-delete-applications.dto.ts
│       │   │       ├──📄response-get-applications.dto.ts
│       │   │       └──📄response-post-applications.dto.ts
│       │   ├──📂entity
│       │   │   └──📄applications.entity.ts
│       │   ├──📄applications.controller.spec.ts
│       │   ├──📄applications.controller.ts
│       │   ├──📄applications.module.ts
│       │   ├──📄applications.service.spec.ts
│       │   └──📄applications.service.ts
│       ├──📂auth(인증 모듈)
│       │   ├──📂dto
│       │   │   ├──📂request
│       │   │   │   ├──📄create-login.dto.ts
│       │   │   │   ├──📄create-refresh.dto.ts
│       │   │   │   ├──📄create-user.dto.ts
│       │   │   │   ├──📄delete-user.dto.ts
│       │   │   │   └──📄update-profile.dto.ts
│       │   │   └──📂response
│       │   │       ├──📄response-delete-auth-profile.dto.ts
│       │   │       ├──📄response-post-auth-login.dto.ts
│       │   │       ├──📄response-post-auth-logout.dto.ts
│       │   │       ├──📄response-post-auth-refresh.dto.ts
│       │   │       ├──📄response-post-auth-register.dto.ts
│       │   │       └──📄response-put-auth-profile.dto.ts
│       │   ├──📂entity
│       │   │   └──📄auth.entity.ts
│       │   ├──📄auth.controller.spec.ts
│       │   ├──📄auth.controller.ts
│       │   ├──📄auth.module.ts
│       │   ├──📄auth.service.spec.ts
│       │   └──📄auth.service.ts
│       ├──📂bookmarks(북마크 모듈)
│       │   ├──📂dto
│       │   │   ├──📂request
│       │   │   │   └──📄create-bookmarks.dto.ts
│       │   │   └──📂response
│       │   │       ├──📄response-get-bookmarks.dto.ts
│       │   │       └──📄response-post-bookmarks.dto.ts
│       │   ├──📂entity
│       │   │   └──📄bookmarks.entity.ts
│       │   ├──📄bookmarks.controller.spec.ts
│       │   ├──📄bookmarks.controller.ts
│       │   ├──📄bookmarks.module.ts
│       │   ├──📄bookmarks.service.spec.ts
│       │   └──📄bookmarks.service.ts
│       ├──📂company(회사 모듈)
│       │   ├──📂dto
│       │   │   ├──📂request
│       │   │   │   └──📄create-company.dto.ts
│       │   │   └──📂response
│       │   │       └──📄response-post-company.dto.ts
│       │   ├──📂entity
│       │   │   └──📄company.entity.ts
│       │   ├──📄company.controller.spec.ts
│       │   ├──📄company.controller.ts
│       │   ├──📄company.module.ts
│       │   ├──📄company.service.spec.ts
│       │   └──📄company.service.ts
│       ├──📂jobs(채용 모듈)
│       │   ├──📂dto
│       │   │   ├──📂request
│       │   │   │   ├──📄create-jobs.dto.ts
│       │   │   │   ├──📄get-jobs.dto.ts
│       │   │   │   └──📄update-jobs.dot.ts
│       │   │   └──📂response
│       │   │       ├──📄response-delete-jobs-id.dto.ts
│       │   │       ├──📄response-get-jobs-id.dto.ts
│       │   │       ├──📄response-get-jobs.dto.ts
│       │   │       ├──📄response-post-jobs.dto.ts
│       │   │       └──📄response-put-jobs-id.dto.ts
│       │   ├──📂entity
│       │   │
│       │   ├──📂entity
│       │   │   └──📄jobs.entity.ts
│       │   ├──📄jobs.controller.spec.ts
│       │   ├──📄jobs.controller.ts
│       │   ├──📄jobs.module.ts
│       │   ├──📄jobs.service.spec.ts
│       │   └──📄jobs.service.ts
│       └──📂users(사용자 모듈)
│           ├──📂dto
│           │   ├──📂request
│           │   └──📂response
│           │       ├──📄response-get-users-all.dto.ts
│           │       ├──📄response-get-users-id.dto.ts
│           │       └──📄response-get-users-search.dto.ts
│           ├──📂entity
│           │   └──📄users.entity.ts
│           ├──📄users.controller.spec.ts
│           ├──📄users.controller.ts
│           ├──📄users.module.ts
│           ├──📄users.service.spec.ts
│           └──📄users.service.ts
├── 📂test(테스트 파일)
│   ├──📄app.e2e-spec.ts
│   └──📄jest-e2e.json
├── .env.development.local(개발환경 변수관리)
├── .env.production.local(배포환경 변수관리)
├── .ecosystem.config.js(배포 백그라운드 동작, pm2 설정 파일)
├── .eslintrc.js
├── .gitignore
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json

```

## `내용`

### 웹 크롤링 구현
- 사람인 웹사이트 크롤링 구현
- 크롤링을 위한 다양한 라이브러리 활용 (언어/프레임워크 무관)
- 채용 정보 데이터 수집 및 정제
    - 설계된 DB 구조에 맞는 데이터 정제
    - 데이터 무결성: 이미 있는 데이터는 저장하지 않도록 처리하는 로직
    - 에러 처리 및 재시도 로직 구현
    - 병렬 처리를 통한 크롤링 성능 최적화 
- 데이터 수집 및 저장
    - 최소 100개 이상의 채용 공고 데이터 수집
    - 수집된 데이터 구조화 및 정규화
    - 중복 데이터 처리 로직 구현
    - 데이터 업데이트 주기 관리 

### 데이터베이스 설계 및 구현
- 데이터베이스 스키마 설계
    - 테이블/컬렉션 구조 설계
    - 자체적인 DB 설계 
    - 빠른 탐색을 위한 DB 구조 설계
    - 중복이 없는 안정적인 DB 설계
    - 관계 설정 및 제약조건 정의
    - 인덱스 최적화 (Optional)
    - 정규화/비정규화 전략 수립 (Optional)
- 필수 데이터 모델 구현
    - 채용 공고 정보 모델
    - 회사 정보 모델
    - 사용자 정보 모델
    - 지원 내역 모델
    - 북마크/관심공고 모델

### API 기능 구현
- 필터링 및 검색 기능
- 페이지네이션 처리
- 정렬 기능
- 데이터 집계 API
- API 보안
    - JWT 발급 API
    - JWT 기반 인증 API 및 로직
    - 권한 검사 미들웨어
    - 입력 데이터 검증
    - Rate Limiting
- API 최적화
    - 응답 데이터 캐싱
    - N+1 문제 해결
    - 벌크 연산 처리
    - 부분 응답 처리

### 인증 및 보안 구현
- JWT 기반 인증
    - Access Token 발급 및 검증 
    - Refresh Token 구현 
    - 토큰 갱신 메커니즘 
    - 토큰 블랙리스트 관리 
- 보안 미들웨어 구현
    - 인증 미들웨어
    - 권한 검사 미들웨어
    - 입력 데이터 및 파라미터 검증
    - Rate Limiting 
- 보안 강화 
    - XSS 방지
    - CSRF 보호
    - SQL Injection 방지
    - 암호화 처리

### API 문서화 (Swagger)
- Swagger 문서 작성
    - API 엔드포인트 설명
    - 요청/응답 스키마 정의
    - 인증 방식 설명
    - 에러 코드 및 처리 방법
- API 테스트 환경 구성
    - Swagger UI 설정
    - 테스트 데이터 제공
    - API 사용 예제 작성
    - 환경별 설정 관리

### 에러 처리 및 로깅
- 에러 처리 구현
    - 글로벌 에러 핸들러 
    - 커스텀 에러 클래스 
    - HTTP 상태 코드 매핑
    - 에러 응답 포맷 통일
    - 트랜잭션 에러 처리
    - 에러 로깅
- 로깅 시스템 구축 
    - 요청/응답 로깅
    - 에러 로깅
    - 성능 모니터링
    - 로그 레벨 관리

### 코드 최적화 및 모듈화
- 코드 구조화 및 모듈화
    - MVC 아키텍처 패턴 적용 
    - 재사용 가능한 유틸리티 함수 구현
    - 프로젝트 폴더 구조 최적화
    - 의존성 주입 패턴 적용

