import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/response-object/user.dto';
import { JobDto } from 'src/common/dto/response-object/job.dto';

class IdDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({
        type: JobDto, isArray: true, example: [{
            id: "",
            company: "",
            title: "",
            link: "",
            location: "",
            experience: "",
            education: "",
            employment_type: "",
            deadline: "",
            sector: "",
            salary: "",
            viewCount: ""
        }, {
            id: "",
            company: "",
            title: "",
            link: "",
            location: "",
            experience: "",
            education: "",
            employment_type: "",
            deadline: "",
            sector: "",
            salary: "",
            viewCount: ""
        }]
    })
    bookmark_job: JobDto[];
}


class DataResponseGetBookmarksDto {

    @ApiProperty({ example: IdDto })
    id: IdDto;

}

export class ResponseGetBookmarksDto {
    @ApiProperty({ example: "suceess" })
    status: string;

    @ApiProperty({ example: "성공" })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ type: DataResponseGetBookmarksDto })
    data: DataResponseGetBookmarksDto;

    @ApiProperty({ example: "6" })
    total: "6";

    @ApiProperty({ example: "1" })
    currentPage: "1";

    @ApiProperty({ example: "1" })
    totalPages: "1";


}