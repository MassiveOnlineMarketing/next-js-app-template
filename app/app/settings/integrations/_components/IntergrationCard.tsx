interface CardProps {
  heading: string;
  subHeading: string;
  Icon: React.ElementType;
  children: React.ReactNode;
}

const IntegrationCard: React.FC<CardProps> = ({
  heading,
  subHeading,
  Icon,
  children,
}) => (
  <div className="w-full p-6 border border-gray-300 rounded-2xl flex flex-col">
    <Icon className="w-6 h-6 mb-[10px]" />
    <h3 className="text-lg leading-7 font-semibold text-gray-800">{heading}</h3>
    <p className="mb-6 text-base leading-6 font-normal text-gray-500">
      {subHeading}
    </p>
    {children}
  </div>
);

export default IntegrationCard;
