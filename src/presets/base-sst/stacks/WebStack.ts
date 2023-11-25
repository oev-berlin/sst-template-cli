import { NextjsSite, StackContext, use } from 'sst/constructs';
import { DOMAIN, FRONTEND_PATH } from './utils/constants';
import { ApiStack } from './ApiStack';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { aws_cloudfront as cloudfront, Duration } from 'aws-cdk-lib';

export function WebStack({ stack }: StackContext) {
  const stage = stack.stage;
  const { api } = use(ApiStack);
  const { WAF_ID, CERT_ARN } = process.env;

  const stageDomain = stage === 'prod' ? DOMAIN : `${stage}.${DOMAIN}`;

  const certificate = Certificate.fromCertificateArn(stack, `${stage}-cert`, CERT_ARN ?? '');

  const web = new NextjsSite(stack, `${stage}-frontend`, {
    path: FRONTEND_PATH,
    environment: {
      NEXT_PUBLIC_API_URL: api.url,
    },
    warm: stage === 'prod' ? 5 : undefined,
    customDomain: {
      hostedZone: stageDomain,
      domainName: stageDomain,
      domainAlias: `www.${stageDomain}`,
      cdk: {
        certificate,
      },
    },
    cdk: {
      serverCachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      distribution: {
        webAclId: WAF_ID ?? undefined,
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: Duration.minutes(0),
          },
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: Duration.minutes(0),
          },
        ],
      },
    },
  });

  stack.addOutputs({
    SiteUrl: web.url,
  });
}
