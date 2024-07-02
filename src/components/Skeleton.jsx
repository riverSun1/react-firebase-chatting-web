const Skeleton = () => {
  return (
    <div className="flex flex-row p-3 gap-2 space-y-2 animate-pulse items-center justify-center">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="col">
        <div className="h-5 bg-gray-300 my-1 rounded w-1/2" />
        <div className="h-5 bg-gray-300 my-1 rounded w-1/2" />
      </div>
    </div>
  );
};

export default Skeleton;
