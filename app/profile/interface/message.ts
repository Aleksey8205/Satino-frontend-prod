 export interface Message {
    _id?: string;
    author: string;
    text: string;
    idSupport: string | null;
    sentAt: string;
    readAt?: boolean;
  }