export type AIMessageRole = "user" | "assistant" | "system";

export type AIRequestMode = "general" | "client" | "project";

export type AIMessage = {
  id: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
};

export type AIClientContext = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
};

export type AIProjectContext = {
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

export type AIHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AIAction =
  | {
      type: "update_client_status";
      targetId: string;
      payload: {
        status: "Active" | "Pending" | "Inactive";
      };
    }
  | {
      type: "update_project_status";
      targetId: string;
      payload: {
        status: "Planned" | "In Progress" | "Completed" | "On Hold";
      };
    };

export type SendAIMessagePayload = {
  message: string;
  mode?: AIRequestMode;

  clients?: AIClientContext[];
  projects?: AIProjectContext[];
  client?: AIClientContext;
  project?: AIProjectContext;

  history?: AIHistoryMessage[];
};

export type SendAIMessageResponse = {
  reply: string;
  action?: AIAction;
};