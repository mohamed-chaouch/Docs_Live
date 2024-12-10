"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const UserTypeSelector = ({
  userType,
  setUserType,
  onHandleClick,
  className,
}: UserTypeSelectorProps) => {

  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onHandleClick && onHandleClick(type);
  };
  
  return (
    <Select
      value={userType}
      onValueChange={(type: UserType) => accessChangeHandler(type)}
    >
      <SelectTrigger className={cn("cursor-pointer bg-gray-1 w-[100px] !border-0 !outline-none shadow-none appearance-none absolute top-0 right-0 focus:ring-0 focus:ring-offset-0", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer" className="cursor-pointer">
          can view
        </SelectItem>
        <SelectItem value="editor" className="cursor-pointer">
          can edit
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserTypeSelector;
