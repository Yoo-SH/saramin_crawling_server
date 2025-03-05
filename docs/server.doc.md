# 목차
- [웹 크롤링 구현](#웹-크롤링-구현)
- [데이터베이스 설계 및 구현](#데이터베이스-설계-및-구현)
- [API 기능 구현](#API-기능-구현)
- [인증 및 보안 구현](#인증-및-보안-구현)
- [API 문서화 (Swagger)](#API-문서화-Swagger)
- [API 테스트 환경 구성](#API-테스트-환경-구성)
- [에러 처리 및 로깅](#에러-처리-및-로깅)
- [로깅 시스템 구축](#로깅-시스템-구축)
- [모듈화](#모듈화)

<br>
<br>

# `웹 크롤링 구현`
**사람인 웹사이트 크롤링 구현**/**크롤링을 위한 beautifulsoup4,  pandas라이브러리 활용**
```python
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
```
**데이터 수집 및 저장**
```python
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
```

<br>
<br>

# `데이터베이스 설계 및 구현`
- **데이터베이스 스키마 설계**
    - 사용자 정보, 채용 정보, 회사 정보, 지원 정보, 북마크 정보 
    인증 정보를 저장하는 데이터베이스 설계
- **필수 데이터 모델 구현**
    - 채용 공고 정보 모델
    - 회사 정보 모델
    - 사용자 정보 모델
    - 지원 내역 모델
    - 북마크/관심공고 모델
- **ERD** 
    - 인증 정보와 사용자 정보는 1:1 관계, 회사 정봐 채용 정보는 1:N 관계
    - 사용자 정보와 북마크 정보는 1:N 관계, 채용 정보와 북마크 정보는 1:N 관계 
    - 사용자 정보와 지원 정보는 1:N 관계, 채용 정보와 지원 정보는 1:N 관계

![image](https://github.com/user-attachments/assets/d9fa6df6-a535-45b1-8992-5dbc91349713)

<br>
<br>

# `API 기능 구현`
**필터링 및 검색 기능**/ **페이지네이션 처리**/ **정렬 기능**
```typescript
async getJobs(getJobsDto: GetJobsDto) {
        try {
            const {
                page = 1,
                location,
                employment_type,
                salary,
                sector,
                sortBy = 'deadline',
                keyword,
                company,
                title,
            } = getJobsDto;

            const pageSize = 20; // 페이지 사이즈는 고정
            const query = this.repo_jobs.createQueryBuilder('job');

            // 필터링 조건
            if (keyword) {
                query.andWhere(
                    'job.title LIKE :keyword OR job.company LIKE :keyword OR job.location LIKE :keyword OR job.employment_type LIKE :keyword OR job.salary LIKE :keyword OR job.sector LIKE :keyword',
                    { keyword: `%${keyword}%` },
                );
            }
            if (location) query.andWhere('job.location LIKE :location', { location: `%${location}%` });
            if (employment_type) query.andWhere('job.employment_type LIKE :employment_type', { employment_type: `%${employment_type}%` });
            if (salary) query.andWhere('job.salary LIKE :salary', { salary: `%${salary}%` });
            if (sector) query.andWhere('job.sector LIKE :sector', { sector: `%${sector}%` });
            if (company) query.andWhere('job.company LIKE :company', { company: `%${company}%` });
            if (title) query.andWhere('job.title LIKE :title', { title: `%${title}%` });

            // 정렬 열 및 방식 검증
            const allowedSortColumns = ['deadline', 'viewCount', 'salary'];
            const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'deadline';
            const order = 'ASC'; // 정렬 방식은 현재 고정(필요시 수정 가능)

            query.orderBy(`job.${sortColumn}`, order);

            // 페이지네이션
            query.skip((page - 1) * pageSize).take(pageSize);

            const [jobs, total] = await query.getManyAndCount();
            if (jobs.length === 0 || total === 0) {
                return { messages: '데이터가 없습니다.', status: "error", statusCode: 404 };
            }

            return {
                status: "success",
                messages: '성공',
                statusCode: 200,
                data: jobs,
                '총 개수': total,
                '페이지 번호': page,
                '페이지 크기': pageSize,

            };

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('공고 조회 중 서버에서 에러가 발생했습니다.');
        }
    }
```
**JWT 발급 API**
```typescript
async generateToken(user_id: Users['id']): Promise<Token> {
        const accessToken = this.jwtService.sign(
            { user_id: user_id }, // sub는 토큰 소유자의 ID를 나타내는 키를 sub로 설정
        );

        // 리프레시 토큰 생성 (7일 유효기간)
        const refreshToken = this.jwtService.sign(
            { user_id: user_id },
            { secret: this.configService.get<string>('REFRESH_SECRET'), expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN') },
        );

        return { accessToken, refreshToken }; // 생성된 토큰 반환
    }
```
**JWT 기반 인증 API 및 로직**
```typescript
interface Token {
accessToken: string; //액세스 토큰
refreshToken: string; //리프레시 토큰
}

async createLogin(createLoginDto: CreateLoginDto, @Res() res: Response) {
        try {
            const { email, password } = createLoginDto;

            const auth = await this.repo_auth.findOne({
                where: { email }, relations: ['user'],
            });
            if (!auth) {
                throw new NotFoundException('등록되지 않은 이메일입니다.');
            }

            const isValidPassword = await bcrypt.compare(password, auth.password);
            if (!isValidPassword) {
                throw new NotFoundException('비밀번호가 일치하지 않습니다.');
            }

            const tokens = await this.generateToken(auth.user.id);
            await this.saveRefreshToken(auth.user.id, tokens.refreshToken);

            // 로그인 이력 저장
            auth.user.lastLoginAt = new Date();
            await this.repo_users.save(auth.user);

            // 쿠키 설정
            res.cookie('access_token', tokens.accessToken, {
                httpOnly: true,
                secure: this.configService.get<boolean>("COOKIE_ACCESS_HTTPS"), //https에서만 쿠키 전송할지 여부
                sameSite: 'lax', //쿠키가 다른 도메인으로 전송되는 것을 방지하기 위해 사용
                maxAge: this.configService.get<number>("COOKIE_ACCESS_EXPIRES_IN"),
            });

            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: this.configService.get<boolean>("COOKIE_REFRESH_HTTPS"), //https에서만 쿠키 전송할지 여부
                sameSite: 'lax', //쿠키가 다른 도메인으로 전송되는 것을 방지하기 위해 사용
                maxAge: this.configService.get<number>("COOKIE_REFRESH_EXPIRES_IN"),
            });

            return res.status(HttpStatus.OK).json({
                status: 'success',
                message: '로그인에 성공하였습니다.',
                statusCode: HttpStatus.OK,
                data: { username: auth.user.name, email: auth.email }
            });

        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new InternalServerErrorException('로그인 중 오류가 발생했습니다.');
        }
    }
```
**권한 검사 미들웨어**
```typescript
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService,
        private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                // 요청에서 쿠키로부터 JWT를 추출
                return request?.cookies?.access_token;
            }]),
            ignoreExpiration: false, // 만료된 JWT 토큰을 허용할지 여부
            secretOrKey: configService.get<string>('ACCESS_SECRET_KEY'), // JWT 토큰을 검증하기 위한 비밀 키
        });
    }

    async validate(payload: any) {

        if (payload == null) { // payload에 user_id가 없으면 토큰이 유효하지 않다고 판단
            throw new CustomTokenUnauthorizedException();
        }


        try {
            const user = await this.usersService.findUsersById(payload.user_id); 
            return { id: user.data.user_id };
        } catch (error) {
            throw error;
        }
    }
}
```
**입력 데이터 검증**
```typescript
export class CreateLoginDto {

    @ApiProperty({ example: 'test@jbnu.ac.kr', description: '이메일' })
    @IsEmail({}, { message: '유효한 이메일 주소 형식을 입력하세요.' })
    @IsNotEmpty({ message: '이메일은 필수 항목입니다.' })
    email: string;

    @ApiProperty({ example: 'test@123', description: '비밀번호' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    password: string;
}
```
<br>
<br>

# `인증 및 보안 구현`
**JWT 기반 인증**/**Access Token 발급 및 검증**/**Refresh Token 구현**/**토큰 갱신 메커니즘**/
```typescript
        async createNewAccessTokenByRefreshToken(createRefreshDto: CreateRefreshDto, @Res() res: Response) {
        const { refreshToken } = createRefreshDto;

        try {
            // 리프레시 토큰의 유효성을 검증
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_SECRET'),
            });

            // 사용자 정보를 가져옵니다.
            const user = await this.repo_users.findOne({ where: { id: payload.user_id } });
            const auth = await this.repo_auth.findOne({ where: { user: { id: payload.user_id } } });

            // 사용자 또는 토큰이 유효하지 않을 경우, 인증 오류 발생
            if (!user || !auth.refreshToken || auth.refreshToken !== refreshToken) {
                console.log('refreshToken:', refreshToken);
                console.log('user.refreshToken:', auth.refreshToken);
                throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            // 새로운 액세스 및 리프레시 토큰을 생성합니다.
            const tokens = await this.generateToken(user.id);
            await this.saveRefreshToken(user.id, tokens.refreshToken); // 새로운 리프레시 토큰 저장

            // 쿠키 설정
            res.cookie('access_token', tokens.accessToken, {
                httpOnly: true,
                secure: this.configService.get<boolean>("COOKIE_ACCESS_HTTPS"),
                sameSite: 'lax',
                maxAge: this.configService.get<number>('COOKIE_ACCESS_EXPIRES_IN'),
            });

            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: this.configService.get<boolean>("COOKIE_REFRESH_HTTPS"),
                sameSite: 'lax',
                maxAge: this.configService.get<number>('COOKIE_REFRESH_EXPIRES_IN'),
            });

            return res.status(HttpStatus.OK).json({
                status: 'success',
                message: '토큰이 갱신되었습니다.',
                statusCode: HttpStatus.OK,
                data: {
                    username: user.name,
                },
            });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Refresh token이 만료되었습니다. 다시 로그인 하세요.');
                }
                throw error;
            }
            console.error(error);
            throw new InternalServerErrorException('토큰 갱신 중 오류가 발생했습니다.');
        }
    }
```
**보안 미들웨어 구현**/**인증 미들웨어**/**권한 검사 미들웨어**/
```typescript
    @UseGuards(JwtAuthGuard)
    @Post()
    async createApplication(@Req() req, @Body() body: CreateApplicationsDto) {
        return this.applicationsService.createApplication(req.user.id, body);
    }
```
**암호화 처리**
```typescript
async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
```
<br>
<br>

# `API 문서화 (Swagger)`
**요청/응답 스키마 정의**
```typescript
    export class CreateJobsDto {
    @ApiProperty({ example: '(주)씨아이랩스', description: '회사명' })
    @IsString({ message: 'compnay는 문자열 입니다.' })
    @IsOptional()
    company: string;

    @ApiProperty({ example: '경력직 풀스택 개발자(ReactJS/Nodejs/ 등) 구인공고', description: '제목' })
    @IsString({ message: 'title는 문자열 입니다.' })
    @IsOptional()
    title: string;

    @ApiProperty({ example: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=search&rec_idx=49371713&location=ts&searchword=node+js&searchType=search&paid_fl=n&search_uuid=61cd8441-b754-4080-b9f0-2821b30aa8b3', description: '링크' })
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: "link가 url 형식이 아닙니다." })
    link: string;

    @ApiProperty({ example: '경기 고양시 일산동구', description: '지역' })
    @IsString({ message: 'location는 문자열 입니다.' })
    @IsOptional()
    location: string;

    @ApiProperty({ example: '경력6년↑', description: '경력' })
    @IsString({ message: 'experience는 문자열 입니다.' })
    @IsOptional()
    experience: string;

    @ApiProperty({ example: '학력무관', description: '학력' })
    @IsString({ message: 'education는 문자열 입니다.' })
    @IsOptional()
    education: string;

    @ApiProperty({ example: '정규직', description: '고용형태' })
    @IsString({ message: 'employment_type는 문자열 입니다.' })
    @IsOptional()
    employment_type: string;

    @ApiProperty({ example: '"~ 01/10(금)', description: '마감일' })
    @IsString({ message: 'deadline는 문자열 입니다.' })
    @IsOptional()
    deadline: string;

    @ApiProperty({ example: 'ReactJS, JSP, 앱개발, 웹개발, API', description: '업종' })
    @IsString({ message: 'sector는 문자열 입니다.' })
    @IsOptional()
    sector: string;

    @ApiProperty({ example: '성과급/상여금', description: '급여' })
    @IsString({ message: 'salary는 문자열 입니다.' })
    @IsOptional()
    salary: string;
}
```
**API 사용 예제 작성**/**API 엔드포인트 설명**/**테스트 데이터 제공**/
```typescript
     @ApiOperation({ summary: '토큰 갱신' }) // 401 응답 시 /auth/refresh 엔드포인트를 통해 새 Access Token을 요청하도록 클라이언트 측에서 처리
    @ApiResponse({ status: 200, description: '토큰이 갱신 되었습니다.', type: ResponsePostAuthRefreshDto })
    @ApiResponse({ status: 400, description: '리프레시 토큰은 필수 항목입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 400, description: '리프레시 토큰은 문자열이어야 합니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: '유효하지 않은 토큰입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token이 만료되었습니다. 다시 로그인 하세요.', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: '해당 유저를 찾을 수 없습니다. updateRefreshToken', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '토큰 갱신 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @Post('refresh')
    refresh(@Body() body: CreateRefreshDto, @Res() res: Response) {
        return this.authService.createNewAccessTokenByRefreshToken(body, res);
    }
```
![Image](https://github.com/user-attachments/assets/c346d8bc-fa82-434a-a2e6-53eada120894)
<br>
<br>

# `API 테스트 환경 구성`
**Swagger UI 설정**/**환경별 설정 관리**
```typescript
    const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED');
  if (swaggerEnabled) {
    const swaggerPath = configService.get<string>('SWAGGER_PATH');

    // Swagger 설정
    const config = new DocumentBuilder()
      .setTitle('SARAMIN SERVER API')
      .setDescription('NestJS를 이용한 SARAMIN SERVER API 문서입니다.')
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'access_token', // 쿠키 이름
          in: 'cookie', // 쿠키에서 읽는다는 것을 명시
        },
        'cookieAuth', // 인증 스키마 이름
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }
```
<br>
<br>

# `에러 처리 및 로깅`
**에러 처리 구현**/**글로벌 에러 핸들러**
```typescript
    // @Catch() 데코레이터는 모든 예외를 잡겠다고 명시합니다.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name); // Logger 인스턴스를 생성합니다.

    // ExceptionFilter 인터페이스의 catch 메서드를 구현합니다.
    catch(exception: unknown, host: ArgumentsHost) {
        // 현재 처리하고 있는 HTTP 요청/응답을 얻기 위해 host 객체에서 HTTP 관련 컨텍스트를 가져옵니다.
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>(); // 클라이언트로 응답을 보내기 위한 Response 객체를 가져옵니다.
        const request = ctx.getRequest<Request>();    // 요청 정보를 확인하기 위한 Request 객체를 가져옵니다.

        // 예외가 HttpException인지 여부에 따라 다른 방식으로 상태 코드와 메시지를 설정합니다.
        let status: number;
        let message: string;

        if (exception instanceof HttpException) {
            // 예외가 HttpException일 경우, 예외로부터 상태 코드와 응답 메시지를 가져옵니다.
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // 응답 메시지가 문자열인 경우 그대로 사용하고, 객체일 경우 내부의 메시지를 사용합니다.
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message;
        } else {
            // 예외가 HttpException이 아닌 경우, 내부 서버 오류로 처리하고 기본 메시지를 설정합니다.
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }
        // 요청 정보와 함께 에러 로그 출력
        this.logger.error(
            `message: ${message}, HTTP statusCode: ${status},  method: ${request.method}, url: ${request.url}`,
        );


        // 클라이언트에게 JSON 형식으로 에러 응답을 보냅니다.
        response.status(status).json({
            status: "error",                 // HTTP 상태 코드
            message,                       // 예외 메시지
            statusCode: status,            // HTTP 상태 코드
        });
    }
}
```
<br>
<br>

# `로깅 시스템 구축` 
**요청-응답 로깅**/**성능 모니터링**
```typescript
    export class PerformanceLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(PerformanceLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 요청 정보를 가져옵니다.
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const startTime = Date.now(); // 요청 시작 시간 기록

        this.logger.log(`Incoming Request: [${method}] ${url}`);

        return next.handle().pipe(
            tap(() => {
                const endTime = Date.now(); // 응답이 끝난 시간 기록
                const responseTime = endTime - startTime; // 총 소요 시간 계산


                if (responseTime > 500) {
                    this.logger.warn(
                        `Slow Response Detected: [${method}] ${url} - Response Time: ${responseTime}ms`,
                    );
                } else {
                    this.logger.log(
                        `Outgoing Response: [${method}] ${url} - Response Time: ${responseTime}ms`,
                    );
                }
            }),
        );
    }
}
```
**로그 레벨 관리**
```typescript
    // 로그 레벨을 환경 변수에서 가져와서 설정
  const configService = app.get(ConfigService);
  const logLevels = configService.get<string>('LOG_LEVEL').split(',');
  app.useLogger(logLevels as any); // useLogger의 타입과 맞추기 위해 any로 캐스팅
```
<br>
<br>

# `코드 최적화 및 모듈화`
**MVC 아키텍처 패턴 적용**/**프로젝트 폴더 구조 최적화**/**의존성 주입 패턴 적용**/**모듈화**

NestJS 프로젝트에서 코드의 가독성과 재사용성을 높이고 유지보수를 용이하게 하기 위해 아래의 최적화 방법과 모듈화를 적용합니다.

### 1. MVC 아키텍처 패턴 적용

**MVC(Model-View-Controller)**는 애플리케이션 로직을 명확하게 분리하여 각 역할의 책임을 정의합니다.

- **Model**: 데이터 구조와 비즈니스 로직을 처리합니다.  
  예: `Entity`, `Repository`, `Service` 등.
- **View**: 클라이언트에게 반환되는 데이터입니다.  
  예: REST API를 통해 반환되는 JSON 데이터.
- **Controller**: 요청을 받아 적절한 서비스 호출 및 응답 반환.  
  예: 각 라우트 요청에 대해 알맞은 로직 처리.

**예시 코드**

```typescript
// product.controller.ts
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }
}
```
### 2. 프로젝트 폴더 구조 최적화
모듈, 컨트롤러, 서비스, 리포지토리 등의 파일을 기능별로 분리하여 폴더 구조를 최적화합니다.
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
```

### 3. 의존성 주입 패턴 적용

NestJS는 **DI(Dependency Injection)** 패턴을 통해 객체 간의 결합도를 줄이고, 테스트 및 확장을 쉽게 만듭니다.

### 서비스와 컨트롤러 간의 DI 예시

```typescript
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAll() {
    return this.productRepository.findAll();
  }
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }
}
```

### 4. 모듈화

NestJS는 모듈 기반 구조로 동작하며, 기능별 모듈화를 통해 높은 응집력과 재사용성을 제공합니다.


### 모듈 정의 예시

```typescript
@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
```


