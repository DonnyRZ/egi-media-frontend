import type { JSX, ReactNode, SVGProps } from "react";

import type { SocialPlatform } from "@/features/footer/constants/social.constants";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      {children}
    </svg>
  );
}

function YouTubeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z" />
    </BaseIcon>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9A3.1 3.1 0 1 1 12 8.9a3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Zm3.1 1.1c-.1-1.8-.5-3.4-1.8-4.7S16.3 1.2 14.5 1.1C12.6 1 11.4 1 12 1s-.6 0-2.5.1C7.7 1.2 6.1 1.6 4.8 2.9S1.9 6.1 1.8 7.9C1.7 9.8 1.7 11 1.7 12s0 2.2.1 4.1c.1 1.8.5 3.4 1.8 4.7s2.9 1.7 4.7 1.8c1.9.1 3.1.1 5 .1s3.1 0 5-.1c1.8-.1 3.4-.5 4.7-1.8s1.7-2.9 1.8-4.7c.1-1.9.1-3.1.1-5s0-2.2-.1-4.1ZM20.3 16c-.1 1.3-.3 2.1-1 2.8s-1.5.9-2.8 1c-1.8.1-2.4.1-4.5.1s-2.7 0-4.5-.1c-1.3-.1-2.1-.3-2.8-1s-.9-1.5-1-2.8c-.1-1.8-.1-2.4-.1-4.5s0-2.7.1-4.5c.1-1.3.3-2.1 1-2.8s1.5-.9 2.8-1C9.3 3.1 9.9 3.1 12 3.1s2.7 0 4.5.1c1.3.1 2.1.3 2.8 1s.9 1.5 1 2.8c.1 1.8.1 2.4.1 4.5s0 2.7-.1 4.5Z" />
    </BaseIcon>
  );
}

function TikTokIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19.6 6.9a5.7 5.7 0 0 1-3.3-1.1v8.2a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.9a3 3 0 1 0 2.1 2.9V2.2h2.9c0 .4.1.9.2 1.3a5.7 5.7 0 0 0 3.1 3.4Z" />
    </BaseIcon>
  );
}

function SpotifyIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 1.7a10.3 10.3 0 1 0 0 20.6 10.3 10.3 0 0 0 0-20.6Zm4.7 14.8a.64.64 0 0 1-.88.21c-2.41-1.47-5.45-1.8-9.03-.99a.64.64 0 1 1-.29-1.25c3.92-.89 7.25-.5 9.98 1.14a.64.64 0 0 1 .22.89Zm1.26-2.8a.8.8 0 0 1-1.1.26c-2.76-1.7-6.97-2.19-10.24-1.2a.8.8 0 1 1-.46-1.54c3.73-1.12 8.37-.58 11.54 1.37a.8.8 0 0 1 .26 1.11Zm.11-2.92C14.9 8.9 9.2 8.7 5.86 9.72a.96.96 0 1 1-.56-1.84c3.84-1.16 10.2-.94 14.22 1.5a.96.96 0 1 1-1.05 1.6Z" />
    </BaseIcon>
  );
}

function TwitterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14.2 10.4 22.1 1.5h-1.9l-6.8 7.8L8 1.5H1.5l8.3 12.1L1.5 22.5h1.9l7.3-8.3 5.8 8.3H23l-8.8-12.1Zm-2.6 2.9-.8-1.2L4 2.9h2.9l5.3 7.6.8 1.2 6.9 9.9h-2.9l-5.5-7.9Z" />
    </BaseIcon>
  );
}

const SOCIAL_ICONS: Record<SocialPlatform, (props: IconProps) => JSX.Element> = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  spotify: SpotifyIcon,
  twitter: TwitterIcon,
};

interface SocialIconProps extends IconProps {
  platform: SocialPlatform;
}

export function SocialIcon({ platform, ...props }: SocialIconProps) {
  const Icon = SOCIAL_ICONS[platform];
  return <Icon {...props} />;
}
