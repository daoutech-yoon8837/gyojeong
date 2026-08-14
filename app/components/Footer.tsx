import { Camera, Mail, Music2, Video } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const sns = [
    { href: settings.instagram_url, label: "Instagram", Icon: Camera },
    { href: settings.youtube_url, label: "YouTube", Icon: Video },
    { href: settings.soundcloud_url, label: "SoundCloud", Icon: Music2 },
  ].filter((item) => item.href);

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {settings.band_name}
          </p>
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground"
            >
              <Mail size={13} />
              {settings.contact_email}
            </a>
          )}
        </div>

        {sns.length > 0 && (
          <div className="flex gap-4">
            {sns.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-muted transition-opacity hover:text-foreground"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="mx-auto max-w-6xl text-xs text-muted">
          © {new Date().getFullYear()} {settings.band_name}
        </p>
      </div>
    </footer>
  );
}
