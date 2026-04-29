import { NextRequest, NextResponse } from "next/server";

type AIRequestMode = "general" | "client" | "project";

type AIClientContext = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
};

type AIProjectContext = {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: string;
  deadline: string;
  budget?: number;
  paidAmount?: number;
  remainingAmount?: number;
};

function enrichProject(project?: AIProjectContext) {
  if (!project) return undefined;

  const budget = Number(project.budget) || 0;
  const paidAmount = Number(project.paidAmount) || 0;
  const remainingAmount = Math.max(budget - paidAmount, 0);

  return {
    ...project,
    budget,
    paidAmount,
    remainingAmount,
  };
}

function buildSystemPrompt(params: {
  mode: AIRequestMode;
  clients?: AIClientContext[];
  projects?: AIProjectContext[];
  client?: AIClientContext;
  project?: AIProjectContext;
}) {
  const { mode, clients = [], projects = [], client, project } = params;

  const enrichedProject = enrichProject(project);
  const enrichedProjects = projects.map((item) => enrichProject(item));

  const basePrompt = `
You are Nexus AI inside a CRM system.

Rules:
- Be natural and simple.
- Don't over-explain.
- Only analyze when the user clearly asks.
- If the message is casual (thanks, ok, hello), respond briefly.
- Keep answers short and useful.
- Always use the real CRM data provided in the context.
- Never invent financial numbers.
- If project financial data exists, use budget, paidAmount, and remainingAmount.

Language:
- Arabic → Arabic response
- English → English response
`;

  if (mode === "client" && client) {
    return `
${basePrompt}

Context: One client

Client:
${JSON.stringify(client, null, 2)}

Related Projects:
${JSON.stringify(enrichedProjects, null, 2)}

If the user asks about this client:
- Analyze briefly
- Mention financial/project insights only from the provided data
- Suggest next actions
- Do not overcomplicate
`;
  }

  if (mode === "project" && enrichedProject) {
    return `
${basePrompt}

Context: One project

Project:
${JSON.stringify(enrichedProject, null, 2)}

If the user asks:
- Identify risks
- Mention budget, paid amount, and remaining amount when relevant
- Suggest next steps
- Keep it short
`;
  }

  return `
${basePrompt}

Context: General CRM

Clients:
${JSON.stringify(clients, null, 2)}

Projects:
${JSON.stringify(enrichedProjects, null, 2)}

Only analyze when needed.
`;
}

async function callGroq(params: {
  message: string;
  mode: AIRequestMode;
  clients?: AIClientContext[];
  projects?: AIProjectContext[];
  client?: AIClientContext;
  project?: AIProjectContext;
}) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const systemPrompt = buildSystemPrompt(params);

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: params.message,
          },
        ],
        temperature: 0.3,
        max_tokens: 250,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Groq error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Empty AI reply");
  }

  return reply;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body?.message?.trim();
    const mode: AIRequestMode = body?.mode ?? "general";

    const clients: AIClientContext[] = body?.clients ?? [];
    const projects: AIProjectContext[] = body?.projects ?? [];
    const client: AIClientContext | undefined = body?.client;
    const project: AIProjectContext | undefined = body?.project;

    if (!message) {
      return NextResponse.json(
        { message: "Message required" },
        { status: 400 }
      );
    }

    const reply = await callGroq({
      message,
      mode,
      clients,
      projects,
      client,
      project,
    });

    return NextResponse.json({
      reply,
      provider: "groq",
    });
  } catch {
    return NextResponse.json({ message: "AI failed" }, { status: 500 });
  }
}