export interface IMessage {
  to_user_id: string;
  from_user_id: string;
  bodyMessage: string;
  room_id: string;
  createdAt?: Date;
}

export interface IGetHistoric {
  emailDestinatary: string;
  pageNumber: number;
  userId: string
}

export interface IGetLastMessage {
  userId: string
  userIdDestinatary: string,
  pageNumber: number
}