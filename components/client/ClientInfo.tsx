
import { Button } from '../ui/button';
import EditClientDialog from './EditClientDialogue';
import { useCurrentClient } from '@/store/store';


export default function ClientInfo() {
  // const session = useSession();
  const {clientId, name, email , phone, pendingFees} = useCurrentClient((state => state));
  if (!name && !email && !phone) {
    return <p>Updating...</p>
  }

  // console.log("Session data: ", session);
  return (
    <div>
      <div className="container mx-auto">
        <div className="bg-white mt-3 shadow-md rounded-lg p-6">
          <div className=' sm:flex '>
            <h2 className="text-3xl sm:text-4xl  text-slate-800 font-light  mb-2">{name}</h2>
            <Button className='w-full sm:w-2/5 md:w-1/5 lg:w-1/6 ml-auto mt-3 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600 text-wrap  shadow-md shadow-blue-500'>
              Pending Payment: {pendingFees}
            </Button>
          </div>
          <div className='sm:flex sm:justify-between mt-4'>
            <p className="text-gray-600 text-lg mb-2">Email: {email}</p>
            <p className="text-gray-600 text-lg mb-2">Phone: {phone}</p>
            {/* <Button className='w-full sm:w-1/6 mt-3 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600'>Edit Client</Button> */}
            <EditClientDialog />
          </div>
        </div>
      </div>
    </div>
  )
}
