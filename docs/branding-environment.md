# Branding environment variables

This project reads branding from **process environment variables** (Docker Compose, systemd, Kubernetes, `.env`, etc.). Enterprise deployments can also set the same values via **`privateConfig.yml`** next to `config.yml`; the server maps YAML keys into these env vars at startup.

**Sources:** `src/lib/pullEnv.ts`, `server/private/lib/config.ts`, `server/private/lib/readConfigFile.ts`.

---

## Quick example (auth pages)

Replace product name, copyright line, edition label, and footer links without editing code:

```bash
BRANDING_APP_NAME=MyProduct
BRANDING_AUTH_FOOTER_PUBLISHER="My Company"
BRANDING_SITE_URL=https://example.com
BRANDING_AUTH_FOOTER_EDITION="MyProduct"
```

Optional:

```bash
# Hide the © … publisher column
BRANDING_AUTH_FOOTER_HIDE_PUBLISHER=true

# Hide the edition segment (Community / Enterprise / Cloud text)
BRANDING_AUTH_FOOTER_HIDE_EDITION=true

# Hide the entire auth layout footer (Enterprise: see note below)
BRANDING_HIDE_AUTH_LAYOUT_FOOTER=true
```

Restart the application after changing env vars.

---

## Auth layout footer (`src/app/auth/layout.tsx`)

| Environment variable | Purpose |
|---------------------|---------|
| `BRANDING_APP_NAME` | Middle segment in the footer (product name). Default in code if unset: `Pangolin`. |
| `BRANDING_SITE_URL` | URL for the © line and product name links. Default if unset: `https://pangolin.net`. |
| `BRANDING_AUTH_FOOTER_PUBLISHER` | Text after the year in the © line (replaces default `Fossorial, Inc.`). |
| `BRANDING_AUTH_FOOTER_HIDE_PUBLISHER` | Set to `true` to remove the © column entirely. |
| `BRANDING_AUTH_FOOTER_EDITION` | Replaces the edition label (e.g. Community Edition). If set to an empty string, that label is omitted. |
| `BRANDING_AUTH_FOOTER_HIDE_EDITION` | Set to `true` to hide the edition segment. |
| `BRANDING_HIDE_AUTH_LAYOUT_FOOTER` | Set to `true` to hide the whole footer. On **Enterprise**, the server may still hide the footer when the host has a valid non-personal license (see `auth/layout.tsx`). |

**privateConfig.yml (Enterprise)** — under `branding:`:

| YAML key | Maps to |
|----------|---------|
| `site_url` | `BRANDING_SITE_URL` |
| `auth_footer_publisher` | `BRANDING_AUTH_FOOTER_PUBLISHER` |
| `auth_footer_edition` | `BRANDING_AUTH_FOOTER_EDITION` |
| `hide_auth_footer_publisher` | `BRANDING_AUTH_FOOTER_HIDE_PUBLISHER` |
| `hide_auth_footer_edition` | `BRANDING_AUTH_FOOTER_HIDE_EDITION` |
| `hide_auth_layout_footer` | `BRANDING_HIDE_AUTH_LAYOUT_FOOTER` |

---

## Logos and layout

| Environment variable | Purpose |
|---------------------|---------|
| `BRANDING_LOGO_LIGHT_PATH` | Logo URL/path for light mode (e.g. `/branding/logo-light.svg`). |
| `BRANDING_LOGO_DARK_PATH` | Logo URL/path for dark mode. |
| `BRANDING_LOGO_AUTH_WIDTH` | Logo width on auth pages (pixels). |
| `BRANDING_LOGO_AUTH_HEIGHT` | Logo height on auth pages (pixels). |
| `BRANDING_LOGO_NAVBAR_WIDTH` | Navbar logo width (pixels). |
| `BRANDING_LOGO_NAVBAR_HEIGHT` | Navbar logo height (pixels). |
| `BACKGROUND_IMAGE_PATH` | Background image on auth routes (mount assets under `/app/public` in Docker). |

**privateConfig.yml:** `branding.logo` (`light_path`, `dark_path`, `auth_page`, `navbar`), `background_image_path`.

---

## Page copy (login, signup, resource auth)

| Environment variable | Purpose |
|---------------------|---------|
| `LOGIN_PAGE_SUBTITLE_TEXT` | Subtitle under the login card (when license-gated UI allows custom subtitle). |
| `SIGNUP_PAGE_SUBTITLE_TEXT` | Subtitle on the signup page. |
| `RESOURCE_AUTH_PAGE_SHOW_LOGO` | `true` to show logo on resource auth page. |
| `RESOURCE_AUTH_PAGE_TITLE_TEXT` | Custom title on resource auth page. |
| `RESOURCE_AUTH_PAGE_SUBTITLE_TEXT` | Custom subtitle; may use `{{resourceName}}` where supported. |

**privateConfig.yml:** `login_page.subtitle_text`, `signup_page.subtitle_text`, `resource_auth_page` (`show_logo`, `title_text`, `subtitle_text`).

---

## Other branding-related env

| Environment variable | Purpose |
|---------------------|---------|
| `BRANDING_FOOTER` | JSON string for custom footer link arrays (used where the app consumes `env.branding.footer`). |
| `BRANDING_COLORS` | Set by **privateConfig** `branding.colors` (JSON); theme injection in root layout. |

---

## Community (OSS) vs Enterprise

- **Auth layout footer** text and links driven by `pullEnv()` (table above) apply whenever those env vars are set in the running process, including **OSS** builds.
- **Custom logos, splash background, login/signup/resource-auth copy** from env are largely gated in the UI by **license status** (`isUnlocked()`). On **OSS**, that is typically **false**, so those features may not appear until you use an Enterprise build with a valid license or change that behavior in code.

Official upstream docs also describe branding: [Branding](https://docs.pangolin.net/manage/branding).

---

## GitHub Actions: OSS build workflow

The workflow `.github/workflows/oss-build.yml` runs on pushes and pull requests to `main` / `dev`, and on `workflow_dispatch`.

| Output | What it does |
|--------|----------------|
| **Artifacts** | Uploads `dist/` and `.next/` (cache stripped) as `pangolin-oss-<sha>`. |
| **GHCR** | Builds the repo `Dockerfile` with `BUILD=oss` and `DATABASE=sqlite`, then **pushes** to **`ghcr.io/<owner>/<repo>`** when the event is **not** a pull request (fork PRs do not push). Tags include `sha-<short>`, the branch name (`main`, `dev`, …), and `latest` for `main`. |

After the first push, open the package in **GitHub → Packages** and set visibility if you want it public. Pulling an image:

```bash
docker pull ghcr.io/<OWNER>/<REPO>:latest
```
