export function createPageUrl(pageName, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    return queryString ? `/${pageName}?${queryString}` : `/${pageName}`;
}