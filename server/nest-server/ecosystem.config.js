module.exports = {
    apps: [
        {
            name: 'nest-server',
            script: 'dist/main.js',
            cwd: '/server/nest-server', // 프로젝트 루트 경로
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};