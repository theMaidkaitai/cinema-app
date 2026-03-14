
interface ConfigType {
    ApiUrl: string
}

const config: ConfigType = {
    ApiUrl: import.meta.env.VITE_API_URL || '',
}
console.log ("API URL", config.ApiUrl);

export default config
