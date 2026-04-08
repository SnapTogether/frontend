import axios from "axios";
import FormData from "form-data";
import { createReadStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EVENT_CODE = "4a86c8";
const FILE_PATH = join(__dirname, "test-image.jpg");
const BASE_URL = "http://localhost:5000";

const verifyGuest = async (guestName: string): Promise<string | null> => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/guest/${EVENT_CODE}/verify`,
      { guestName },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data?.guestId ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Guest verify failed for ${guestName}:`, error.response?.data ?? error.message);
    } else {
      console.error(`❌ Guest verify failed for ${guestName}:`, error);
    }
    return null;
  }
};

const uploadPhoto = async (guestId: string, guestName: string): Promise<void> => {
  const form = new FormData();
  form.append("media", createReadStream(FILE_PATH), {
    filename: `${Date.now()}-blob`,
    contentType: "image/jpeg",
  });

  try {
    const res = await axios.post(
      `${BASE_URL}/api/photos/upload/${EVENT_CODE}/${guestId}`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      }
    );
    console.log(`✅ ${guestName} uploaded:`, res.status);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Upload failed for ${guestName}:`, error.response?.data ?? error.message);
    } else {
      console.error(`❌ Upload failed for ${guestName}:`, error);
    }
  }
};

const simulateGuestUpload = async (index: number): Promise<void> => {
  const guestName = `TestGuest${index}`;
  const guestId = await verifyGuest(guestName);
  if (!guestId) return;
  await uploadPhoto(guestId, guestName);
};

async function runSimulation(): Promise<void> {
  const concurrentUploads = Array.from({ length: 10 }, (_, i) => simulateGuestUpload(i + 1));
  await Promise.all(concurrentUploads);
}

void runSimulation();
