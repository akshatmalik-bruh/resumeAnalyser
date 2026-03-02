const Groq = require("groq-sdk");
const z = require("zod");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const interviewReportSchema = z.object({
  AtsScore: z.number().min(0).max(100),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string()
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string()
    })
  ),
  skillGap: z.array(
    z.object({
      skill: z.string(),
      level: z.enum(["easy", "medium", "hard"])
    })
  ),
  title: z.string()
});


const groqSchema = {
  type: "object",
  properties: {
    AtsScore: { type: "number" },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false
      }
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false
      }
    },
    skillGap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          level: {
            type: "string",
            enum: ["easy", "medium", "hard"]
          }
        },
        required: ["skill", "level"],
        additionalProperties: false
      }
    },
    title: { type: "string" }
  },
  required: [
    "AtsScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGap",
    "title"
  ],
  additionalProperties: false
};


const Report = async (selfDescription, jobDescription, resume) => {
  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content:
            `You are a professional interview preparation coach and report generator. 
Analyze the candidate's resume, self-description, and the target job description carefully. 
Generate a detailed interview report with:
- AtsScore: a realistic score 0-100 based on how well the resume matches the job description
- technicalQuestions: at least 5 relevant technical interview questions with the interviewer's intention and a detailed suggested answer
- behavioralQuestions: at least 3 behavioral questions with intention and suggested answers
- skillGap: list skills the candidate is missing for this job, rated as easy/medium/hard to acquire
- title: the job title being applied for

Be thorough and specific. Do not return empty arrays.`
        },
        {
          role: "user",
          content: `Here is the candidate's information:

Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Generate a comprehensive interview report.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "interview_report",
          strict: true,
          schema: groqSchema
        }
      }
    });

    const raw = response.choices[0].message.content;
    const parsed = JSON.parse(raw || "{}");

    
    const validated = interviewReportSchema.parse(parsed);
    console.log(validated);
    return validated;

  } catch (error) {
    console.error("Report generation error:", error);
    throw error;
  }
};

module.exports = {Report};