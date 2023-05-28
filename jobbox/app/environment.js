const environment = process.env.NODE_ENV || 'development';

const environments = {
  development: {
    API_URL: 'https://tranquil-ocean-74659.herokuapp.com',
    API_KEY: 'dev-api-key',
  },
  production: {
    API_URL: 'https://tranquil-ocean-74659.herokuapp.com',
    API_KEY: 'prod-api-key',
  },
};

const currentEnvironment = environments[environment];

Object.keys(currentEnvironment).forEach((key) => {
  process.env[key] = currentEnvironment[key];
});

console.log('Environment variables set successfully.');
