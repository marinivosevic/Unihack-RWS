import React from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeletePostDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-4 mt-4">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

                )
                }

                export default DeletePostDialog
