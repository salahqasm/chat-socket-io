export function getEnv(envName: string) {
    return import.meta.env["VITE_" + envName] ?? ""
}