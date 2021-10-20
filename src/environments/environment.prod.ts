import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    products: 'https://0efj4ykl5i.execute-api.eu-west-1.amazonaws.com/dev',
    order: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    import: 'https://cdq7tq4ljh.execute-api.eu-west-1.amazonaws.com/dev',
    bff: 'https://dzpjptafi85kt.cloudfront.net',
    cart: 'http://serguntchik-cart-api-dev.eu-west-1.elasticbeanstalk.com/api',
  },
  apiEndpointsEnabled: {
    products: true,
    order: false,
    import: true,
    bff: true,
    cart: true,
  },
};
