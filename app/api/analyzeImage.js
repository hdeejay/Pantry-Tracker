import { OpenAI } from "openai";
import { storage } from "../../firebase"; // Update the path as needed
import { ref, getDownloadURL } from "firebase/storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { imagePath } = req.body;
      
      // Get the download URL from Firebase Storage
      const imageRef = ref(storage, imagePath);
      const imageUrl = await getDownloadURL(imageRef);

      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Tell me what's in this image. Limit your response to 1-5 words and keep it brief and simple." },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "low"
                }
              },
            ],
          },
        ],
        max_tokens: 20,
      });

      res.status(200).json({ result: response.choices[0].message.content.trim() });
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Error analyzing image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}