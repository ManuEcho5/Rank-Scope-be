// Mock rank checking: randomly produce rank or not found
export function mockCheckRank(keyword, domain) {
    // 30% chance of not ranked
    const notRanked = Math.random() < 0.3;
    if (notRanked) {
        return { keyword, domain, page: null, position: null };
    }
    const page = Math.floor(Math.random() * 10) + 1; // 1-10
    const position = Math.floor(Math.random() * 10) + 1; // 1-10
    return { keyword, domain, page, position };
}
