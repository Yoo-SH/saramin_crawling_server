# `웹 크롤링 구현`
- 사람인 웹사이트 크롤링 구현
- 크롤링을 위한 다양한 라이브러리 활용 
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


# `API 기능 구현`
**필터링 및 검색 기능**/ **페이지네이션 처리**/ **정렬 기능**
```javascript
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
```javascript
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
```javascript
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
```javascript
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
```javascript
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

# `인증 및 보안 구현`
**JWT 기반 인증**/**Access Token 발급 및 검증**/**Refresh Token 구현**/**토큰 갱신 메커니즘**/
```javascript
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
```javascript
    @UseGuards(JwtAuthGuard)
    @Post()
    async createApplication(@Req() req, @Body() body: CreateApplicationsDto) {
        return this.applicationsService.createApplication(req.user.id, body);
    }
```
**암호화 처리**
```javascript
async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
```

# `API 문서화 (Swagger)`
### Swagger 문서 작성
- API 엔드포인트 설명
- 요청/응답 스키마 정의
- 인증 방식 설명
- 에러 코드 및 처리 방법
- 테스트 데이터 제공
- API 사용 예제 작성
   
```javascript
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
### API 테스트 환경 구성
**Swagger UI 설정**/**환경별 설정 관리**
```javascript
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

# `에러 처리 및 로깅`
**에러 처리 구현**/**글로벌 에러 핸들러**
```javascript
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

# `로깅 시스템 구축` 
**요청-응답 로깅**/**성능 모니터링**
```javascript
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
```javascript
    // 로그 레벨을 환경 변수에서 가져와서 설정
  const configService = app.get(ConfigService);
  const logLevels = configService.get<string>('LOG_LEVEL').split(',');
  app.useLogger(logLevels as any); // useLogger의 타입과 맞추기 위해 any로 캐스팅
```

# `코드 최적화 및 모듈화`
**MVC 아키텍처 패턴 적용**/**프로젝트 폴더 구조 최적화**/**의존성 주입 패턴 적용**/**모듈화**

