/// <reference types="vite/client" />

interface Window {
    ethereum: {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        on: (event: string, callback: (params: unknown) => void) => void;
        removeListener: (event: string, callback: (params: unknown) => void) => void;
    };
}

interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}