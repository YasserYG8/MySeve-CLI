# yassergombra - Terminal CV

An interactive Terminal CV CLI for Yasser Gombra built using Ink, React, TypeScript, and the OpenRouter API.

## Features

- **AI Chat Agent**: Streaming responses answering details about Yasser Gombra using the auto-routing free model (`openrouter/free` via OpenRouter).
- **Dynamic Views**:
  - **[P] Projects**: Project cards with details, GitHub links, and tech stacks.
  - **[S] Skills**: Grouped skills categorized by domain.
  - **[E] Experience**: Detailed timeline of professional and academic experience.
  - **[C] Contact**: Direct communication options.
  - **[H] Help**: Instruction panel.
- **Slash Commands**: Run `/about`, `/hire`, `/projects`, `/skills`, `/experience`, `/contact`, `/help`, or `/clear` inside the chat.
- **Responsive Layout**: Adjusts UI component boundaries automatically to terminal size.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YasserYG8/MySeve-CLI.git
   cd MySeve-CLI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Key**:
   Create a `.env` file from the template and fill in your OpenRouter API Key:
   ```bash
   cp .env.example .env
   ```
   Add your key:
   ```env
   OPENROUTER_API_KEY=your-openrouter-api-key
   ```

4. **Build the CLI**:
   ```bash
   npm run build
   ```

5. **Run the CLI**:
   ```bash
   npm start
   ```

## Local Development

To run with auto-compiling:
```bash
npm run dev
```
And in another terminal window, run:
```bash
npm start
```

## How to Publish

Publishing is done by GitHub Actions (`.github/workflows/publish.yml`) when a version tag is pushed:

```bash
npm version patch        # or minor / major: bumps package.json and creates a vX.Y.Z tag
git push --follow-tags   # the tag starts the publish workflow
```

The workflow uses npm trusted publishing, so no npm token is stored in GitHub. One-time setup on npmjs.com: package **Settings → Trusted Publisher → GitHub Actions**, with owner `YasserYG8`, repository `MySeve-CLI` and workflow file `publish.yml`.

To publish by hand instead, run `npm login` and then `npm publish` (it builds first through `prepublishOnly`).

Now anyone can run your CV by executing:
   ```bash
   npx yassergombra
   ```

## Proxy Deployment (Vercel)

The TUI communicates with OpenRouter through a secure, serverless API proxy hosted on Vercel. This prevents exposing your private `OPENROUTER_API_KEY` inside the published client package.

The proxy is located in the `proxy/` directory and uses the Vercel Edge Runtime.

### To Deploy the Proxy:
1. Navigate into the proxy directory:
   ```bash
   cd proxy
   ```
2. Log in and deploy using the Vercel CLI:
   ```bash
   vercel login
   vercel --prod
   ```
3. Set the environment variable on Vercel:
   ```bash
   vercel env add OPENROUTER_API_KEY
   ```
   *(Ensure you apply it to the Production environment, and run `vercel --prod` again to activate the changes).*

4. The proxy runs at `https://<your-project>.vercel.app/api/chat`.
