import { useNavigate } from "react-router-dom";

interface DashboardSignatureProps {
    title: string;
}

export const DashboardSignature: React.FC<DashboardSignatureProps> = ({
    title,
}) => {

    const navigate = useNavigate();

    return (
        <div className='flex justify-between items-center'>
          <h1 className='text-4xl text-white font-semibold'>{title}</h1>
          <button
            onClick={() => navigate(-1)}
            className="secondary-background-color w-[50px] aspect-square rounded-xl flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark primary-background-textcolor text-3xl"></i>
          </button>
        </div>
    )
}