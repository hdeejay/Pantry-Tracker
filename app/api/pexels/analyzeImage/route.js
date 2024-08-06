import { NextResponse } from 'next/server';
import { OpenAI } from "openai";
import { storage } from "../../../firebase"; // Adjust path as needed
import { ref, getDownloadURL } from "firebase/storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const { imagePath } = await request.json();
  
  try {
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

    return NextResponse.json({ result: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}