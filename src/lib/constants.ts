// Swap these for production values
export const ADMIN_PIN = "3275";
export const DAD_EMAIL = "owner@norlogbuilding.com";
export const COMPANY = {
  name: "NORLOG BUILDING CONCEPT",
  tagline: "Building Stronger Foundations.",
  phone: "+234 803 000 0000",
  whatsapp: "+234 803 000 0000",
  email: "info@norlogbuilding.com",
  address: "Plot 14, Industrial Layout, Abuja, Nigeria",
};

export const formatNaira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
