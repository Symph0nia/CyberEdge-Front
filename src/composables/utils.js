// utils.js
export const transformSubdomainData = (subdomainData) => ({
  id: subdomainData.find((item) => item.Key === "_id")?.Value || "",
  domain: subdomainData.find((item) => item.Key === "domain")?.Value || "",
  is_read: subdomainData.find((item) => item.Key === "is_read")?.Value || false,
  ip: subdomainData.find((item) => item.Key === "ip")?.Value || "",
  httpStatus:
    subdomainData.find((item) => item.Key === "http_status")?.Value || null,
  httpTitle:
    subdomainData.find((item) => item.Key === "http_title")?.Value || "",
});

export const sortByIpAndDomain = (a, b) => {
  if (a.ip && b.ip) {
    const aIpParts = a.ip.split(".").map(Number);
    const bIpParts = b.ip.split(".").map(Number);

    for (let i = 0; i < 4; i++) {
      if (aIpParts[i] !== bIpParts[i]) {
        return aIpParts[i] - bIpParts[i];
      }
    }
    return a.domain.localeCompare(b.domain);
  }
  if (a.ip) return -1;
  if (b.ip) return 1;
  return a.domain.localeCompare(b.domain);
};
