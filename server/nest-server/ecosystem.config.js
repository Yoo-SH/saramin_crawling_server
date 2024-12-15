module.exports = {
    apps: [
        {
            name: 'nest-server',
            script: 'dist/main.js',
            cwd: '/home/ubuntu/saramin_server/server/nest-server/', // 프로젝트>
            env: {
                NODE_ENV: 'production.local',
            },
            env_production: {
                NODE_ENV: 'production.local',
            },
        },
    ],
};

