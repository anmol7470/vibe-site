## Project Rules

- Use bun as package manager.
- Use shadcn/ui as component library. Install components using `bun run shadcn-add <component>`.
- Use `toast` from `react-hot-toast` for all toast notifications.
- Use Image from `next/image` for all images.
- Use Link from `next/link` for app links and `<a>` for external links.
- Break down complex components into smaller components.
- Use kebab-case naming convention for file names.
- Use Lucide React for icons. Use the Icon version of the component for the icon. For example, use `SendIcon` instead of `Send`.
- Use `cn` from `@/lib/utils` for all class name merging.
- Never create markdown files (`.md`) after you are done. Never!
- Never cast to any type. Always use correct types.
- Don't use `process.env` directly. Use `env` from `@/lib/env/server` instead.
- Write all db queries, mutations, and api logic in `@/trpc` folder under appropriate routers.
