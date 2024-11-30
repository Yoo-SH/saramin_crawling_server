class ConfigCode:
    # loc_mcd (param code)
    LOCATION_CODES = {
        "서울": 101000,
        "경기": 102000,
        "인천": 108000,
        "부산": 106000,
        "대구": 104000,
        "광주": 103000,
        "대전": 105000,
        "울산": 107000,
        "세종": 118000,
        "강원": 109000,
        "경남": 110000,
        "경북": 111000,
        "전남": 112000,
        "전북": 113000,
        "충남": 115000,
        "충북": 114000,
        "제주": 116000,
        "전국": 117000,
        "미국": 220200,
        "일본": 211200,
        "중국·홍콩": 211300,
        "아시아·중동": 21000,
        "북·중미": 220000,
        "남미": 230000,
        "유럽": 240000,
        "오세아니아": 250000,
        "아프리카": 260000,
        "남극대륙": 270000,
        "기타해외": 280000,
    }

    # cat_mcls (param code)
    JOB_CODES = {
        "기획·전략": 16,
        "마케팅·홍보·조사": 14,
        "회계·세무·재무": 3,
        "인사·노무·HRD": 5,
        "총무·법무·사무": 4,
        "IT개발·데이터": 2,
        "디자인": 15,
        "영업·판매·무역": 8,
        "고객상담·TM": 21,
        "구매·자재·물류": 18,
        "상품기획·MD": 12,
        "운전·운송·배송": 7,
        "서비스": 10,
        "생산": 11,
        "건설·건축": 22,
        "의료": 6,
        "연구": 9,
        "교육": 19,
        "미디어·문화·스포츠": 13,
        "금융·보험": 17,
        "공공·복지": 20,
    }

    # recruitSort (param code)
    SORT_CODES = {
        "관련도순": "relation",
        "정확도순": "accuracy",
        "등록일순": "reg_dt",
        "수정일순": "edit_dt",
        "마감일순": "closing_dt",
        "지원자순": "apply_cnt",
        "사원수순": "employ_cnt",
    }

    # inner_com_type (param code)
    COMPANY_CODES = {
        "기업형태 전체": "",
        "대기업": "scale001",
        "외국계": "foreign",
        "중견·중소": "scale003",
        "공사·공기업": "public",
    }


def get_location_code(location_name):
    if location_name not in ConfigCode.LOCATION_CODES:
        raise ValueError(f"'{location_name}'은(는) 유효한 지역명이 아닙니다.")
    return ConfigCode.LOCATION_CODES[location_name]


def get_job_code(job_name):
    if job_name not in ConfigCode.JOB_CODES:
        raise ValueError(f"'{job_name}'은(는) 유효한 직업명이 아닙니다.")
    return ConfigCode.JOB_CODES[job_name]


def get_sort_code(sort_name):
    if sort_name not in ConfigCode.SORT_CODES:
        raise ValueError(f"'{sort_name}'은(는) 유효한 정렬명이 아닙니다.")
    return ConfigCode.SORT_CODES[sort_name]


def get_company_code(company_name):
    if company_name not in ConfigCode.COMPANY_CODES:
        raise ValueError(f"'{company_name}'은(는) 유효한 회사형태명이 아닙니다.")
    return ConfigCode.COMPANY_CODES[company_name]
