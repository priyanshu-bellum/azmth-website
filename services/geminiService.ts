
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

// Initialize the chat session following strict @google/genai guidelines
export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  // Use process.env.API_KEY directly as it is a hard requirement
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    // Using recommended model for basic text and conversation tasks
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'AZMTH OS', the intelligence layer for Azmth Studio.
      Azmth is building a unified, human-centric AI ecosystem.
      
      Key Company Info (Reference these accurately):
      - Vision: A future where humans and AI co-evolve.
      - Core Product: B2B AI Calling & CRM Platform (Live in 2025).
      - Roadmap: Consumer App (Early 2026), Hardware Ecosystem (Late 2026), Humanoid Integration (2028), Frontier Tech like B-Cap (2029+).
      - Moats: Human-first philosophy, Privacy-first architecture, Unified software-hardware stack.
      - Partner: Cyient Ltd (Strategic Hardware Partner).
      - Funding: Currently raising £5 Million Seed Round for 18-24 month runway.
      
      Tone: High-intelligence, monochrome aesthetic, technical, precise. 
      Terms to use: "Ecosystem", "Co-evolution", "Intelligence Layer", "Human-centric", "MCP Protocol".
      Responses must be short (under 35 words). Act as an OS terminal.
      `,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // Directly check the environment variable
  if (!process.env.API_KEY) {
    return "Err: API_KEY_MISSING. OS Offline.";
  }

  try {
    const chat = initializeChat();
    // sendMessage parameters must only include 'message'
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    // Access the extracted string output via .text property
    return response.text || "Err: EMPTY_RESPONSE.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Err: UPLINK_LOST.";
  }
};
