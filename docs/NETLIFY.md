# Netlify Deploy – AuftragMatch

Die Flutter-Web-App kann auf Netlify gehostet werden.

## Live-Deploy

| | |
|---|---|
| **URL** | https://lustrous-monstera-3f4e0a.netlify.app |
| **Passwort** | `My-Drop-Site` |
| **Claim** | https://app.netlify.com/drop/lustrous-monstera-3f4e0a |

Anonymous-Deploys müssen innerhalb von **60 Minuten** geclaimt werden, sonst wird die Site entfernt. Nach dem Claim gehört sie deinem Netlify-Account und bleibt dauerhaft (Passwort kannst du dort entfernen).

## Schnell-Deploy (lokal gebaut)

```bash
flutter build web --release
npx netlify-cli deploy --dir=build/web --prod --no-build
```

Ohne Login (temporär, 1 Stunde zum Claimen):

```bash
npx netlify-cli deploy --dir=build/web --prod --allow-anonymous --no-build
```

## Continuous Deployment (GitHub → Netlify)

1. Repo auf [app.netlify.com](https://app.netlify.com) verbinden
2. Build kommt aus `netlify.toml` + `scripts/netlify_build.sh`
3. Publish-Directory: `build/web`

Der erste CI-Build lädt Flutter herunter und braucht entsprechend länger.
