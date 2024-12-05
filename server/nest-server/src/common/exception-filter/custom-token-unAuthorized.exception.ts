import { UnauthorizedException } from '@nestjs/common';

export class CustomTokenUnauthorizedException extends UnauthorizedException {
    constructor() {
        super('토큰이 더 이상 유효하지 않습니다.');
    }
}