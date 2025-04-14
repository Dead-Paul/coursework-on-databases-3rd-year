declare global {
    interface Window {
        electron: {
            database: (sourceQuery: string, params?: any[]) => Promise<Object[]>;
        };
    };
};

export {};