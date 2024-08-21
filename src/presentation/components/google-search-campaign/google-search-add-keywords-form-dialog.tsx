import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTriggerNoButton } from "@/presentation/components/common/dialog";
import AddKeywordsFrom from '../../keyword-tracker/components/forms/AddKeywordsForm';


const GoogleSearchAddKeywordsFormDialog = ({
  buttonClassName,
  children,
}: {
  buttonClassName: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTriggerNoButton
        className={buttonClassName}
        onClick={() => setOpen(true)}
      >
        {children}
      </DialogTriggerNoButton>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium text-2xl text-gray-800">
            Add Keywords to Campaign
          </DialogTitle>
          <DialogDescription className='font-medium text-base text-gray-500 pt-[4px]'>
            Please enter the keywords you want to track separated by line.
          </DialogDescription>
        </DialogHeader>

        <AddKeywordsFrom setOpen={setOpen} />
        
      </DialogContent>
    </Dialog>
  )
}

export default GoogleSearchAddKeywordsFormDialog