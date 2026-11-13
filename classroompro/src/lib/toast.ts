export const toast = {
  success: (msg: string, _options?: any) => {
    if (typeof window !== 'undefined') console.info('[Toast Success]:', msg);
  },
  error: (msg: string, _options?: any) => {
    if (typeof window !== 'undefined') console.warn('[Toast Error]:', msg);
  },
};

export default toast;
