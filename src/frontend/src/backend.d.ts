import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    addExternalText(text: string): Promise<void>;
    addPersistentCanister(id: Principal): Promise<void>;
    addRemoteCanister(id: Principal): Promise<void>;
    getExternalTexts(): Promise<Array<string>>;
    getPersistentCanisters(): Promise<Array<string>>;
    getRemoteCanisters(): Promise<Array<string>>;
}
