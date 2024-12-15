declare type NewDocumentProps = {
  email: string;
};

declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];

declare type RoomAccesses = Record<string, AccessType>;

declare type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};

declare type UserType = "creator" | "editor" | "viewer";

declare type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  userType?: UserType;
};

declare type CollaborativeRoomProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUserType: UserType;
};

declare type registrationFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

declare type signInFormData = {
  email: string;
  password: string;
};

declare type SharePopUpProps = {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  collaborators: User[];
  setCollaborators: React.Dispatch<React.SetStateAction<User[]>>
  creatorId: string;
};

declare type UserTypeSelectorProps = {
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  onHandleClick?: (value: UserType) => void;
  className?: string;
};

declare type CollaboratorProps = {
  collaborator: User;
  creatorId: string;
  roomId: string;
  email: string;
  handleUsers: (value: RoomAccesses) => void;
  user: User;
};

declare type ThreadWrapperProps = { thread: ThreadData<BaseMetadata> };