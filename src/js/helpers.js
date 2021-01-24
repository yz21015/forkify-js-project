import { promises } from "fs";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            );
        }, s * 1000);
    });
};

export const cameliseKeys = function (obj) {
    const newEntries = Object.entries(obj).map((arr) => {
        let [key, value] = arr;
        if (!key.includes("_")) return [key, value];
        const [a, b] = key.split("_");
        key = a + b[0].toUpperCase() + b.slice(1);
        return [key, value];
    });

    return Object.fromEntries(newEntries);
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const request = fetch(
            url,
            uploadData
                ? {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify(uploadData),
                  }
                : fetch(url)
        );

        const res = await Promise.race([request, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data;
    } catch (err) {
        throw err;
    }
};
