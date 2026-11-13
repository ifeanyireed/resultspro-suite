export const toast = {
  success: (msg: string) => {
    if (typeof window !== 'undefined') console.info('[Toast Success]:', msg);
  },
  error: (msg: string) => {
    if (typeof window !== 'undefined') console.warn('[Toast Error]:', msg);
  },
};

export default toast;
