import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import withLess from 'next-plugin-less';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const withMDX = createMDX({});

const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default withBundleAnalyzer(
    withMDX(
        withLess(nextConfig, {
            lessOptions: {
                javascriptEnabled: true,
            },
        })
    )
);
