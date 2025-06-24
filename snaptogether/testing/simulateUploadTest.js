const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Replace with your real event code
const EVENT_CODE = "4a86c8";
const FILE_PATH = path.join(__dirname, "test-image.jpg");
const BASE_URL = "http://localhost:5000";

const verifyGuest = async (guestName) => {
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
      return res.data?.guestId || null;
    } catch (error) {
      console.error(`❌ Guest verify failed for ${guestName}:`, error.response?.data || error.message);
      return null;
    }
  };
  
  

  const uploadPhoto = async (guestId, guestName) => {
    const form = new FormData();
    form.append("media", fs.createReadStream(FILE_PATH), {
        filename: `${Date.now()}-blob`,
        contentType: "image/jpeg", // or your actual test file MIME
      });
      
  
    try {
      const res = await axios.post(
        `${BASE_URL}/api/photos/upload/${EVENT_CODE}/${guestId}`,
        form,
        {
          headers: form.getHeaders(),
          maxBodyLength: Infinity, // in case of larger files
        }
      );
      console.log(`✅ ${guestName} uploaded:`, res.status);
    } catch (error) {
      console.error(`❌ Upload failed for ${guestName}:`);
      console.error(error.response?.data || error.message);
    }
  };

const simulateGuestUpload = async (index) => {
  const guestName = `TestGuest${index}`;
  const guestId = await verifyGuest(guestName);
  if (!guestId) return;
  await uploadPhoto(guestId, guestName);
};

const runSimulation = async () => {
    const concurrentUploads = Array.from({ length: 10 }, (_, i) => simulateGuestUpload(i + 1));
    await Promise.all(concurrentUploads);
  };
  

runSimulation();
