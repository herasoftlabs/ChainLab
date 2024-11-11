import crypto from 'crypto-browserify';
import stream from 'stream-browserify';
import url from 'url';
import zlib from 'browserify-zlib';
import http from 'stream-http';
import https from 'https-browserify';
import assert from 'assert';
import os from 'os-browserify';
import path from 'path-browserify';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        url: 'url',
        zlib: 'browserify-zlib',
        http: 'stream-http',
        https: 'https-browserify',
        assert: 'assert',
        os: 'os-browserify',
        path: 'path-browserify',
        encoding: false,
      };
    }
    return config;
  },
  transpilePackages: [
    '@metamask/sdk',
    '@walletconnect/sign-client',
    '@walletconnect/logger',
    '@jnwng/walletconnect-solana',
    '@solana/wallet-adapter-walletconnect',
    '@solana/wallet-adapter-react-ui',
  ],
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/icons/chain/**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;