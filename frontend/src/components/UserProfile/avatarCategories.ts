// Avatar categories for avatar-placeholder API
// API documentation: https://avatar-placeholder.iran.liara.run/

export const avatarStyles = [
  "public", // Random avatars
  "boy", // Male avatars
  "girl", // Female avatars
];

// Get the base URL for the avatar API
const baseUrl = "https://avatar.iran.liara.run";

// Generate a URL for a random avatar based on the selected category
export function getAvatarUrl(category: string): string {
  switch (category) {
    case "boy":
      return `${baseUrl}/public/boy`;
    case "girl":
      return `${baseUrl}/public/girl`;
    case "public":
    default:
      return `${baseUrl}/public`;
  }
}

// Fetch an image and convert it to base64
export async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

// Generate random avatar URLs for preview
export function getRandomAvatarUrl(category: string): string {
  const randomParam = Math.floor(Math.random() * 1000);
  return `${getAvatarUrl(category)}?r=${randomParam}`;
}

// Generate multiple different avatar URLs for the same category
export const getAvatarUrls = (category: string, count: number): string[] => {
  const avatarUrls: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomParam = Math.floor(Math.random() * 1000);
    avatarUrls.push(`${getAvatarUrl(category)}?r=${randomParam}`);
  }

  return avatarUrls;
};
