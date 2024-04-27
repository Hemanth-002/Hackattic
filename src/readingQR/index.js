import QRReader from "qrcode-reader";
import Jimp from "jimp";
import fetch from "node-fetch"; // Assuming you're using Node.js environment

export const readingQR = async (req, res) => {
  try {
    const accessToken = req.query.access_token;
    const response = await fetch(
      `https://hackattic.com/challenges/reading_qr/problem?access_token=${accessToken}`
    ).then((response) => response.json());

    const responseBuffer = await fetch(response.image_url);
    const resBuffer = await responseBuffer.buffer(); // Use buffer() instead of arrayBuffer()

    const result = await new Promise((resolve, reject) => {
      Jimp.read(resBuffer, function (err, image) {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        const qrCodeInstance = new QRReader();
        qrCodeInstance.callback = function (err, value) {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve(value.result);
        };
        qrCodeInstance.decode(image.bitmap);
      });
    });

    const solveResponse = await fetch(
      `https://hackattic.com/challenges/reading_qr/solve?access_token=${accessToken}`,
      {
        method: "POST",
        body: JSON.stringify({ code: result }), // Sending result as JSON object
        headers: { "Content-Type": "application/json" }, // Set Content-Type header
      }
    );

    const ans = await solveResponse.json();

    return res.json(ans);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
