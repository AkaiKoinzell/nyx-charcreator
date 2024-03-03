export function a2b(s: string): string {
    const urlUnsafeString = s.replace(/_/g, "/").replace(/-/g, "+");
    if (typeof window !== "undefined") {
        //Favour atob in browser
        if (typeof atob !== "undefined") {
            return atob(urlUnsafeString);
        }
        if (typeof Buffer !== "undefined") {
            const buf = new Buffer(urlUnsafeString, "base64");
            return buf.toString("latin1");
        }
    } else {
        if (typeof Buffer !== "undefined") {
            const buf = new Buffer(urlUnsafeString, "base64");
            return buf.toString("latin1");
        }
        if (typeof atob !== "undefined") {
            return atob(urlUnsafeString);
        }
    }
    throw new Error("Unsupported operation a2b");
}

export function formatDate(timestamp: number): string {   
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
}