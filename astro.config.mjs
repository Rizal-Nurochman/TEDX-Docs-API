// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'TEDx Unair API Docs',
      description: 'Dokumentasi REST API backend TEDx Universitas Airlangga',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
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
            { label: 'Register', link: '/auth/register/', badge: { text: 'public', variant: 'note' } },
            { label: 'Login', link: '/auth/login/', badge: { text: 'public', variant: 'note' } },
            { label: 'Refresh Token', link: '/auth/refresh-token/', badge: { text: 'public', variant: 'note' } },
            { label: 'Logout', link: '/auth/logout/', badge: { text: 'auth', variant: 'danger' } },
            { label: 'Verifikasi Email', link: '/auth/verification/', badge: { text: 'public', variant: 'note' } },
            { label: 'Reset Password', link: '/auth/reset-password/', badge: { text: 'public', variant: 'note' } },
          ],
        },
      ],
    }),
  ],
});
