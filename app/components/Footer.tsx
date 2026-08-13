import { Camera, Mail, Music2, Video } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const sns = [
    { href: settings.instagram_url, label: "Instagram", Icon: Camera },
    { href: settings.youtube_url, label: "YouTube", Icon: Video },
    { href: settings.soundcloud_url, label: "SoundCloud", Icon: Music2 },
  ].filter((item) => item.href);

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-2xl font-black tracking-tight text-foreground">
            {settings.band_name}
          </p>
          <p className="mt-2 text-sm text-muted">록/인디록</p>
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Mail size={16} />
              {settings.contact_email}
            </a>
          )}
        </div>

        {sns.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-widest text-muted">FOLLOW</p>
            <div className="flex gap-3">
              {sns.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-light text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border px-5 py-5">
        <p className="mx-auto max-w-6xl text-xs text-muted">
          © {new Date().getFullYear()} {settings.band_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
