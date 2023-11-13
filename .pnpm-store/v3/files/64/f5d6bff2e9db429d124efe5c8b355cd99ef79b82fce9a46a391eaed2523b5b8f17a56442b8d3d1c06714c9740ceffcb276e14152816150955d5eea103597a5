import { emptyLicense } from './private/empty-license.js';
export async function validateGumroadLicenseKeyMainAsync(options) {
    const { licenseKey, productPermalink } = options;
    const incrementUseCount = options.incrementUseCount === true ? 'true' : 'false';
    const trimmedLicenseKey = licenseKey.trim();
    if (trimmedLicenseKey === '') {
        return { ...emptyLicense, result: 'INVALID_EMPTY' };
    }
    if (trimmedLicenseKey.length !== 35) {
        return { ...emptyLicense, result: 'INVALID' };
    }
    const onmessage = figma.ui.onmessage;
    return new Promise(function (resolve) {
        figma.ui.onmessage = function (result) {
            figma.ui.onmessage = onmessage;
            resolve(result);
            figma.ui.close();
        };
        const validationTimestamp = new Date().toISOString();
        const __html__ = `<script>const emptyLicense={email:null,licenseKey:null,purchaseTimestamp:null,validationTimestamp:null,variant:null};async function main(){async function n(){try{const t=await(await window.fetch("https://api.gumroad.com/v2/licenses/verify",{body:"increment_uses_count=${incrementUseCount}&license_key="+encodeURIComponent("${trimmedLicenseKey}")+"&product_permalink="+encodeURIComponent("${productPermalink}"),headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},method:"POST"})).json(),{purchase:e,success:a}=t;return a===!1||e.chargebacked===!0||e.disputed===!0||e.refunded===!0?{...emptyLicense,result:"INVALID"}:{email:e.email,licenseKey:"${trimmedLicenseKey}",purchaseTimestamp:e.sale_timestamp,result:"VALID",validationTimestamp:"${validationTimestamp}",variant:e.variants===""?null:e.variants}}catch{return{...emptyLicense,result:"ENDPOINT_DOWN"}}}window.parent.postMessage({pluginMessage:await n()},"*")}main();</script>`;
        figma.showUI(__html__, { visible: false });
    });
}
//# sourceMappingURL=validate-gumroad-license-key-main-async.js.map