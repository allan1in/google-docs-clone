interface DocumentsLayoutProps {
  children: React.ReactNode;
}

const DocumentsLayout = ({ children }: DocumentsLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {/* <div className="flex bg-red-500 justify-center">Documents Layout</div> */}
      {children}
    </div>
  );
};

export default DocumentsLayout;
