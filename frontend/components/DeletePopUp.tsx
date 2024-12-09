import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { OctagonAlert } from "lucide-react";

const DeletePopUp = ({
  isOpen,
  onClose,
  handleDeleteDocument,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleDeleteDocument: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:rounded-[10px] border-0 p-4 max-h-[90vh] overflow-auto rounded-[10px]">
        <DialogTitle className="font-semibold text-xl text-yellow-900 text-center">
          Delete Document
        </DialogTitle>

        <DialogHeader>
          <div className="flex flex-col items-center justify-center mb-6 text-gray-800">
            <OctagonAlert className="text-yellow-600 w-16  h-16 mb-4" />
            <h1 className="text-lg">
              Do you really want to delete this document?{" "}
            </h1>
            <h1 className="text-md font-bold">This action is irreversible.</h1>
          </div>
          <div className="flex items-center justify-center gap-x-2">
            <Button
              className="bg-red-500 hover:bg-red-900 text-white"
              onClick={() => {
                handleDeleteDocument();
              }}
            >
              Confirmer
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-900"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePopUp;
