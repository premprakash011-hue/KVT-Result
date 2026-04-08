import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface StudentData {
  name: string;
  rollNumber: string;
  subjects: {
    name: string;
    marks: number;
    maxMarks: number;
  }[];
  totalPercentage: number;
  grade: string;
}

export async function analyzeStudentData(input: string | { mimeType: string; data: string }): Promise<StudentData[]> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert academic data analyzer. 
    Analyze the following student data (it could be a list of marks, a transcript, or an image of a report card).
    Extract the student name, roll number, and marks for each subject.
    Calculate the percentage for each student (sum of marks / sum of max marks * 100).
    Assign a grade based on the percentage:
    - 90%+: A+
    - 80-89%: A
    - 70-79%: B
    - 60-69%: C
    - 50-59%: D
    - Below 50%: F

    Return the data as a JSON array of objects with this structure:
    [{
      "name": "string",
      "rollNumber": "string",
      "subjects": [{"name": "string", "marks": number, "maxMarks": number}],
      "totalPercentage": number,
      "grade": "string"
    }]
  `;

  const contents = typeof input === 'string' 
    ? { parts: [{ text: prompt }, { text: input }] }
    : { parts: [{ text: prompt }, { inlineData: input }] };

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
