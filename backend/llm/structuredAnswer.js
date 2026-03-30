const Groq = require("groq-sdk");
const z = require("zod");
const dotenv = require("dotenv");
dotenv.config();
const puppeteer = require("puppeteer");
const { GoogleGenAI } = require("@google/genai");
const { zodToJsonSchema } = require("zod-to-json-schema");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
- skillGap: list skills the candidate is missing for this job, rated as easy/medium/hard to acquire.Only list a skill as a gap if it is completely absent from the resume.
If a skill is mentioned, do NOT include it as a gap.
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

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "10mm",
            bottom: "10mm",
            left: "10mm",
            right: "10mm"
        }
    })

    await browser.close()

    return pdfBuffer
}
async function Resume ({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate take the candidate details from the resume provided not dummy projects too with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        add some skills from the jobDescription too that are not present in the actual resume so that the resume becomes appropriate for the application for that job
                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        the html content should be a single page and there should be uniform distance between the headings of the sections and the text below that it should not be uneven
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a professional resume writer. Return a JSON object containing the valid HTML code of the resume."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    
    // Deep-Scan Search: Find any key that sounds like 'html', 'resume', 'content', or 'document'
    const bestKey = Object.keys(parsed).find(key => {
        const k = key.toLowerCase();
        return k.includes('html') || k.includes('resume') || k.includes('content') || k.includes('document') || k.includes('code');
    });

    // Fallback: If no key matches, just take the largest value from the JSON
    const htmlContent = bestKey ? parsed[bestKey] : Object.values(parsed).sort((a,b) => b.length - a.length)[0];

    if (!htmlContent || typeof htmlContent !== 'string') {
        throw new Error("AI failed to generate a valid text block for the resume");
    }

    const pdfBuffer = await generatePdfFromHtml(htmlContent)

    return Buffer.from(pdfBuffer)
}

module.exports = {Report,Resume};