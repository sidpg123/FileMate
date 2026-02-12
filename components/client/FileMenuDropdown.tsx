import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentFileStore } from '@/store/store';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteFileDialogue from './DeleteFileDialogue';
import EditFileInfoDialogue from './EditFileInfoDialogue';

interface FileOptionsDropdownProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAction: () => void;
    cardId: string; // Unique identifier for this card
}

export default function FileOptionsDropdown({ 
    isOpen, 
    onOpenChange, 
    onAction, 
    cardId 
}: FileOptionsDropdownProps) {
    
    const setOpenDeleteFileDialog = useCurrentFileStore((state) => state.setOpenDeleteFileDialog);
    // const setOpenUpdateFileDialog = useCurrentFileStore((state) => state.setOpenUpdateFileDialog);
    const currentFileId = useCurrentFileStore((state) => state.fileId);
    
    const handleDeleteClick = () => {
        onAction(); // Set the file metadata
        setOpenDeleteFileDialog(true);
        onOpenChange(false);
    };

    // const handleEditClick = () => {
    //     onAction(); // Set the file metadata
    //     setOpenUpdateFileDialog(true);
    //     onOpenChange(false);
    // };

    // Only render dialogs for the currently selected file
    const shouldRenderDialogs = currentFileId === cardId;

    return (
        <div>
            <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger onClick={() => onOpenChange(true)}>
                    <MoreVertIcon color="inherit" className="cursor-pointer" />
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            handleDeleteClick();
                        }}
                        className='text-red-500'
                    >
                        Delete
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            handleEditClick();
                        }}
                    >
                        Edit File Info
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Only render dialogs for the currently selected file */}
            {shouldRenderDialogs && (
                <>
                    <DeleteFileDialogue />
                    <EditFileInfoDialogue />
                </>
            )}
        </div>
    );
}