export interface ParsedUserAgent {
    device: string | null;
    browser: string | null;
    os: string | null;
}

export function parseUserAgent(userAgent: string | undefined): ParsedUserAgent {
    if (!userAgent) {
        return { device: null, browser: null, os: null };
    }

    const ua = userAgent.toLowerCase();

    let device: string | null = null;

    if (ua.includes('mobile')) {
        device = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
        device = 'Tablet';
    } else {
        device = 'Desktop';
    }

    let browser: string | null = null;

    if (ua.includes('edg/') || ua.includes('edge/')) {
        browser = 'Edge';
    } else if (ua.includes('opr/') || ua.includes('opera')) {
        browser = 'Opera';
    } else if (ua.includes('chrome/') && !ua.includes('edg')) {
        browser = 'Chrome';
    } else if (ua.includes('safari/') && !ua.includes('chrome')) {
        browser = 'Safari';
    } else if (ua.includes('firefox/')) {
        browser = 'Firefox';
    } else {
        browser = 'Other';
    }

    let os: string | null = null;

    if (ua.includes('windows')) {
        os = 'Windows';
    } else if (ua.includes('mac os x') || ua.includes('macintosh')) {
        os = 'macOS';
    } else if (ua.includes('linux')) {
        os = 'Linux';
    } else if (ua.includes('android')) {
        os = 'Android';
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
        os = 'iOS';
    } else {
        os = 'Other';
    }

    return { device, browser, os };
}
