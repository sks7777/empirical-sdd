export declare const BRAND_RED: "#F43737";
export declare const BRAND_YELLOW: "#FFCD15";
export declare const BRAND_BLUE: "#4A5CFF";
export interface BrandBannerOptions {
    version: string;
    columns?: number;
    color?: boolean;
}
export interface BrandBannerOutput {
    isTTY?: boolean;
    columns?: number;
}
export type BrandBannerEnvironment = Readonly<Record<string, string | undefined>>;
export declare function renderBrandBanner(options: BrandBannerOptions): string;
export declare function renderBrandBannerForOutput(version: string, output?: BrandBannerOutput, environment?: BrandBannerEnvironment): string;
