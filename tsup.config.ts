import { defineConfig } from 'tsup'

export default defineConfig((opts) => {
    return {
        entry: ["./main.ts"],
        splitting: false,
        sourcemap: true,
        clean: !opts.watch,
        dts: true,
        format: ["esm"],
        ignoreWatch: [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
        ]
    }
})
