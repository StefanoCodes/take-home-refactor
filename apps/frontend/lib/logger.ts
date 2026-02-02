export const Logger = {
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, data);
    }
  },
  error: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, data);
    }
  },
};
