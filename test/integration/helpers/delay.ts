export const delay = (milis: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, milis));
};