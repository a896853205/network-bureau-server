module.exports = {
  apps: [
    {
      name: 'API',
      script: './bin/www',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      env: {
        COMMON_VARIABLE: 'true'
      }
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: '39.97.175.30',
      ref: 'origin/borong',
      repo: 'git@github.com:a896853205/network-bureau-server.git',
      path: '/network-bureau/network-bureau-registration-final-server',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'post-setup': 'npm install'
    }
  }
};
