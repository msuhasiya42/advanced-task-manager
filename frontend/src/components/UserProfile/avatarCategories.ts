// Avatar categories for DiceBear API
// API documentation: https://www.dicebear.com/

// We'll only use the Lorelei style as specified
export const avatarStyles = ["lorelei"];

// Generate a URL for a DiceBear avatar with Lorelei style
export function getAvatarUrl(): string {
  return "https://api.dicebear.com/7.x/lorelei/svg";
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

// Generate random avatar URL with a seed for Lorelei style
export function getRandomAvatarUrl(): string {
  const randomSeed = Math.random().toString(36).substring(2, 15);
  return `${getAvatarUrl()}?seed=${randomSeed}`;
}

// Generate multiple different avatar URLs with different seeds
export const getAvatarUrls = (category: string, count: number): string[] => {
  const avatarUrls: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    // Add some options for the Lorelei style
    avatarUrls.push(
      `${getAvatarUrl()}?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
    );
  }

  return avatarUrls;
};
