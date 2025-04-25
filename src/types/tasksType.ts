import { BoilerAttributes } from "./boilerType";
import { UserAttributes } from "./userType";

export type CleaningTemplateLocation = {
    id: number;
    templateId: number;
    name: string;
    qrCodeIdentifier: string;
    instructions: string;
    exampleImageUrl: string | null;
};

export type CleaningTemplate = {
    id: number;
    boilerId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    locations: CleaningTemplateLocation[];
};

export type CreateCleaningTemplatePayload = {
    name: string;
    boilerId: number;
    description: string;
    locations: {
        name: string;
        description?: string;
        qrCodeIdentifier?: string;
        instructions?: string;
    }[];
};
export type CleaningTaskLocation = {
    id: number;
    taskId: number;
    templateLocationId: number;
    photoUrl: string | null;
    notes: string | null;
    completedAt: string | null;
    createdAt: string;
    templateLocation: {
      id: number;
      name: string;
      qrCodeIdentifier: string;
      instructions: string;
      exampleImageUrl: string | null;
    };
  };

export type  CleaningTask  = {
    id: number;
    templateId: number;
    boilerId: number;
    createdBy: number;
    assignedTo: number | null;
    status: 'pending' | 'in_process' | 'completed' | 'canceled'; // nếu có nhiều trạng thái
    scheduledDate: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    locations: CleaningTaskLocation[];
    creator: {
      id: number;
      fullName: string;
      email: string;
    };
    assignedUser: {
      id: number;
      fullName: string;
      email: string;
    } | null;
    boiler: {
      id: number;
      name: string;
      location: string;
    };
    template: {
      id: number;
      name: string;
    };
  };


export type WaterReportItem = {
    id: number;
    templateId: number;
    label: string;
    description: string;
};

export type WaterReportTemplate = {
    id: number;
    boilerId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    items: WaterReportItem[];
    boiler:{
        id:number;
        name:string
    }
};

export type WaterReportTemplateUpdatePayload = {
    name: string;
    boilerId: number;
    description: string;
    items: {
        id?: number;
        templateId: number;
        label: string;
        description: string;
    }[];
};
export type WaterReportTemplateCreatePayload = {
    name: string;
    boilerId: number;
    description?: string;
    items: {
        label: string;
        description?: string;
    }[];
};

export type WaterReportTaskItem = {
  id: number;
  taskId: number;
  templateItemId: number;
  imageUrl?: string | null;
  valueFromAI?: string | null;
  isQualify?: boolean | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  templateItem: {
    id: number;
    templateId: number;
    label: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type WaterReportTask = {
  id: number;
  templateId: number;
  boilerId: number;
  assignedTo?: number | null;
  scheduledDate: string;
  status: 'pending' | 'in_process' | 'completed' | 'canceled';
  createdBy?: number | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  boiler:BoilerAttributes;
  assignee?: UserAttributes | null;
  creator?: UserAttributes | null;
  template: {
    id: number;
    name: string;
    description: string;
    boilerId: number;
    createdAt: string;
    updatedAt: string;
  };
  items: WaterReportTaskItem[];
};


export type SelfGeneratedMaintainTaskItem = {
  title:string;
  photoUrl:string;
  result:string
}
export type SelfGeneratedMaintainTask = {
  deviceId:number ;

}