interface Env {
    VITE_DEEPSEEK_API_KEY: string;
  }
  
  export const getEnv = (): Env => {
    return {
      VITE_DEEPSEEK_API_KEY: import.meta.env.VITE_DEEPSEEK_API_KEY || ''
    };
  };