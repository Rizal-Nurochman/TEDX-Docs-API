// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'TEDx Unair API Docs',
      description: 'Dokumentasi REST API backend TEDx Universitas Airlangga',
      logo: {
        src: './src/assets/logo.svg',
      },
      editLink: {
        baseUrl: 'https://github.com/webdevtedxuniversitasairlangga',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/webdevtedxuniversitasairlangga' },
      ],
      sidebar: [
        {
          label: 'Mulai',
          items: [
            { label: 'Overview', link: '/overview/' },
            { label: 'Autentikasi', link: '/authentication/' },
            { label: 'Format Respon & Error', link: '/response-format/' },
          ],
        },
        {
          label: 'Auth',
          items: [
            { label: 'Register', link: '/auth/register/' },
            { label: 'Login', link: '/auth/login/' },
            { label: 'Refresh Token', link: '/auth/refresh-token/' },
            { label: 'Logout', link: '/auth/logout/' },
            { label: 'Verifikasi Email', link: '/auth/verification/' },
            { label: 'Reset Password', link: '/auth/reset-password/' },
          ],
        },
      ],
    }),
  ],
});
